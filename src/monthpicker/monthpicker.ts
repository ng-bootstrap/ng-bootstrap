import { fromEvent, merge } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ContentChild,
	DestroyRef,
	Directive,
	ElementRef,
	EventEmitter,
	forwardRef,
	inject,
	Injector,
	Input,
	NgZone,
	OnChanges,
	OnInit,
	Output,
	SimpleChanges,
	TemplateRef,
	ViewChild,
	ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { JsonPipe, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { NgbMonthCalendar } from './ngb-month-calendar';
import { NgbMonth } from './ngb-month';
import { MonthpickerServiceInputs, NgbMonthpickerService } from './monthpicker-service';
import { MonthpickerViewModel, YearMonthViewModel, NavigationEvent, YearViewModel } from './monthpicker-view-model';
import { NgbMonthpickerConfig } from './monthpicker-config';
import { NgbMonthAdapter } from './adapters/ngb-month-adapter';
import { NgbMonthStruct } from './ngb-month-struct';
import { NgbMonthpickerI18n } from './monthpicker-i18n';
import { NgbMonthpickerKeyboardService } from './monthpicker-keyboard-service';
import { isChangedDate, isChangedMonth } from './monthpicker-tools';
import { NgbMonthpickerNavigation } from './monthpicker-navigation';
import { ContentTemplateContext } from './monthpicker-content-template-context';
import { MonthTemplateContext } from './monthpicker-month-template-context';
import { NgbMonthpickerMonthView } from './monthpicker-month-view';

/**
 * An event emitted right before the navigation happens and the month displayed by the monthpicker changes.
 */
export interface NgbMonthpickerNavigateEvent {
	/**
	 * The currently displayed month.
	 */
	current: { year: number; month: number } | null;

	/**
	 * The month we're navigating to.
	 */
	next: { year: number; month: number };

	/**
	 * Calling this function will prevent navigation from happening.
	 *
	 * @since 4.1.0
	 */
	preventDefault: () => void;
}

/**
 * An interface that represents the readonly public state of the monthpicker.
 *
 * Accessible via the `monthpicker.state` getter
 *
 * @since 5.2.0
 */
export interface NgbMonthpickerState {
	/**
	 * The earliest date that can be displayed or selected
	 */
	readonly minDate: NgbMonth | null;

	/**
	 * The latest date that can be displayed or selected
	 */
	readonly maxDate: NgbMonth | null;

	/**
	 * The first visible date of currently displayed months
	 */
	readonly firstDate: NgbMonth;

	/**
	 * The last visible date of currently displayed months
	 */
	readonly lastDate: NgbMonth;

	/**
	 * The date currently focused by the monthpicker
	 */
	readonly focusedDate: NgbMonth;

	/**
	 * First dates of months currently displayed by the monthpicker
	 *
	 * @since 5.3.0
	 */
	readonly years: NgbMonth[];
}

/**
 * A directive that marks the content template that customizes the way monthpicker months are displayed
 *
 * @since 5.3.0
 */
@Directive({ selector: 'ng-template[NgbMonthpickerContent]', standalone: true })
export class NgbMonthpickerContent {
	templateRef = inject(TemplateRef);
}

/**
 * A component that renders one year including all the months. Can be used inside
 * the `<ng-template NgbMonthpickerMonths></ng-template>` when you want to customize months layout.
 *
 * For a usage example, see [custom month layout demo](#/components/monthpicker/examples#custommonth)
 *
 * @since 5.3.0
 */
@Component({
	selector: 'ngb-monthpicker-year',
	standalone: true,
	imports: [NgIf, NgFor, NgTemplateOutlet],
	host: { role: 'grid', '(keydown)': 'onKeyDown($event)' },
	encapsulation: ViewEncapsulation.None,
	styleUrls: ['./monthpicker-year.scss'],
	template: `
		<ng-template ngFor let-month [ngForOf]="viewModel.months">
			<div
				role="gridcell"
				class="ngb-mp-month"
				(click)="doSelect(month); $event.preventDefault()"
				[class.disabled]="month.context.disabled"
				[tabindex]="month.tabindex"
				[class.ngb-mp-today]="month.context.today"
				[attr.aria-label]="month.ariaLabel"
			>
				<ng-template
					[ngTemplateOutlet]="monthpicker.monthTemplate"
					[ngTemplateOutletContext]="month.context"
				></ng-template>
			</div>
		</ng-template>
	`,
})
export class NgbMonthpickerYear {
	private _keyboardService = inject(NgbMonthpickerKeyboardService);
	private _service = inject(NgbMonthpickerService);

	i18n = inject(NgbMonthpickerI18n);
	monthpicker = inject(NgbMonthpicker);

	viewModel: YearViewModel;

	/**
	 * The first date of year to be rendered.
	 *
	 * This year must one of the years present in the
	 * [monthpicker state](#/components/monthpicker/api#NgbMonthpickerState).
	 */
	@Input()
	set year(year: NgbMonthStruct) {
		this.viewModel = this._service.getYear(year);
		console.log('set', this.viewModel);
	}

	onKeyDown(event: KeyboardEvent) {
		this._keyboardService.processKey(event, this.monthpicker);
	}

	doSelect(month: YearMonthViewModel) {
		if (!month.context.disabled) {
			this.monthpicker.onDateSelect(month.date);
		}
	}
}

/**
 * A highly configurable component that helps you with selecting calendar dates.
 *
 * `NgbMonthpicker` is meant to be displayed inline on a page or put inside a popup.
 */
@Component({
	exportAs: 'ngbMonthpicker',
	selector: 'ngb-monthpicker',
	standalone: true,
	imports: [NgIf, NgFor, NgTemplateOutlet, NgbMonthpickerNavigation, NgbMonthpickerYear, NgbMonthpickerMonthView],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	styleUrls: ['./monthpicker.scss'],
	host: { '[class.disabled]': 'model.disabled' },
	template: `
		<ng-template
			#defaultMonthTemplate
			let-date="date"
			let-currentMonth="currentMonth"
			let-selected="selected"
			let-disabled="disabled"
			let-focused="focused"
		>
			<div
				ngbMonthpickerMonthView
				[date]="date"
				[currentMonth]="currentMonth"
				[selected]="selected"
				[disabled]="disabled"
				[focused]="focused"
			>
			</div>
		</ng-template>
		<ng-template #defaultContentTemplate>
			<div *ngFor="let year of model.years; let i = index" class="ngb-mp-year">
				<div *ngIf="navigation === 'none' || (displayYears > 1 && navigation === 'select')" class="ngb-mp-year-name">
					{{ year.year }}
				</div>
				<ngb-monthpicker-year [year]="year.firstDate"></ngb-monthpicker-year>
			</div>
		</ng-template>

		<div class="ngb-mp-header">
			<ngb-monthpicker-navigation
				*ngIf="navigation !== 'none'"
				[date]="model.firstDate!"
				[months]="model.months"
				[disabled]="model.disabled"
				[showSelect]="model.navigation === 'select'"
				[prevDisabled]="model.prevDisabled"
				[nextDisabled]="model.nextDisabled"
				[selectBoxes]="model.selectBoxes"
				(navigate)="onNavigateEvent($event)"
				(select)="onNavigateDateSelect($event)"
			>
			</ngb-monthpicker-navigation>
		</div>

		<div class="ngb-mp-content" [class.ngb-mp-years]="!contentTemplate" #content>
			<ng-template
				[ngTemplateOutlet]="contentTemplate || contentTemplateFromContent?.templateRef || defaultContentTemplate"
				[ngTemplateOutletContext]="{ $implicit: this }"
				[ngTemplateOutletInjector]="injector"
			></ng-template>
		</div>

		<ng-template [ngTemplateOutlet]="footerTemplate"></ng-template>
	`,
	providers: [
		{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NgbMonthpicker), multi: true },
		NgbMonthpickerService,
	],
})
export class NgbMonthpicker implements AfterViewInit, OnChanges, OnInit, ControlValueAccessor {
	static ngAcceptInputType_autoClose: boolean | string;
	static ngAcceptInputType_navigation: string;

	model: MonthpickerViewModel;

	@ViewChild('defaultMonthTemplate', { static: true }) private _defaultMonthTemplate: TemplateRef<MonthTemplateContext>;
	@ViewChild('content', { static: true }) private _contentEl: ElementRef<HTMLElement>;

	protected injector = inject(Injector);

	private _service = inject(NgbMonthpickerService);
	private _calendar = inject(NgbMonthCalendar);
	private _i18n = inject(NgbMonthpickerI18n);
	private _config = inject(NgbMonthpickerConfig);
	private _nativeElement = inject(ElementRef).nativeElement as HTMLElement;
	private _NgbMonthAdapter = inject(NgbMonthAdapter<any>);
	private _ngZone = inject(NgZone);
	private _destroyRef = inject(DestroyRef);

	private _controlValue: NgbMonth | null = null;
	private _publicState: NgbMonthpickerState = <any>{};

	/**
	 * The reference to a custom content template.
	 *
	 * Allows to completely override the way monthpicker displays months.
	 *
	 * See [`NgbMonthpickerContent`](#/components/monthpicker/api#NgbMonthpickerContent) and
	 * [`ContentTemplateContext`](#/components/monthpicker/api#ContentTemplateContext) for more details.
	 *
	 * @since 14.2.0
	 */
	@Input() contentTemplate: TemplateRef<ContentTemplateContext>;
	@ContentChild(NgbMonthpickerContent, { static: true }) contentTemplateFromContent?: NgbMonthpickerContent;

	/**
	 * The reference to a custom template for the month.
	 *
	 * Allows to completely override the way a month 'cell' in the calendar is displayed.
	 *
	 * See [`MonthTemplateContext`](#/components/monthpicker/api#MonthTemplateContext) for the data you get inside.
	 */
	@Input() monthTemplate = this._config.monthTemplate;

	/**
	 * The callback to pass any arbitrary data to the template cell via the
	 * [`MonthTemplateContext`](#/components/monthpicker/api#MonthTemplateContext)'s `data` parameter.
	 *
	 * `current` is the month that is currently displayed by the monthpicker.
	 *
	 * @since 3.3.0
	 */
	@Input() monthTemplateData = this._config.monthTemplateData;

	/**
	 * The number of years to display.
	 */
	@Input() displayYears = this._config.displayYears;

	/**
	 * The reference to the custom template for the monthpicker footer.
	 *
	 * @since 3.3.0
	 */
	@Input() footerTemplate = this._config.footerTemplate;

	/**
	 * The callback to mark some dates as disabled.
	 *
	 * It is called for each new date when navigating to a different month.
	 *
	 * `current` is the month that is currently displayed by the monthpicker.
	 */
	@Input() markDisabled = this._config.markDisabled;

	/**
	 * The latest date that can be displayed or selected.
	 *
	 * If not provided, 'year' select box will display 10 years after the current month.
	 */
	@Input() maxDate = this._config.maxDate;

	/**
	 * The earliest date that can be displayed or selected.
	 *
	 * If not provided, 'year' select box will display 10 years before the current month.
	 */
	@Input() minDate = this._config.minDate;

	/**
	 * Navigation type.
	 *
	 * * `"select"` - select boxes for month and navigation arrows
	 * * `"arrows"` - only navigation arrows
	 * * `"none"` - no navigation visible at all
	 */
	@Input() navigation = this._config.navigation;

	/**
	 * The date to open calendar with.
	 *
	 * With the default calendar we use ISO 8601: 'month' is 1=Jan ... 12=Dec.
	 * If nothing or invalid date is provided, calendar will open with current month.
	 *
	 * You could use `navigateTo(date)` method as an alternative.
	 */
	@Input() startDate = this._config.startDate;

	/**
	 * An event emitted right before the navigation happens and displayed month changes.
	 *
	 * See [`NgbMonthpickerNavigateEvent`](#/components/monthpicker/api#NgbMonthpickerNavigateEvent) for the payload info.
	 */
	@Output() navigate = new EventEmitter<NgbMonthpickerNavigateEvent>();

	/**
	 * An event emitted when user selects a date using keyboard or mouse.
	 *
	 * The payload of the event is currently selected `NgbMonth`.
	 *
	 * @since 5.2.0
	 */
	@Output() dateSelect = new EventEmitter<NgbMonth>();

	onChange = (_: any) => {};
	onTouched = () => {};

	constructor() {
		const cd = inject(ChangeDetectorRef);

		this._service.dateSelect$.pipe(takeUntilDestroyed()).subscribe((date) => {
			this.dateSelect.emit(date);
		});

		this._service.model$.pipe(takeUntilDestroyed()).subscribe((model) => {
			const newDate = model.firstDate!;
			const oldDate = this.model ? this.model.firstDate : null;

			// update public state
			this._publicState = {
				maxDate: model.maxDate,
				minDate: model.minDate,
				firstDate: model.firstDate!,
				lastDate: model.lastDate!,
				focusedDate: model.focusDate!,
				years: model.years.map((viewModel) => viewModel.firstDate),
			};

			let navigationPrevented = false;
			// emitting navigation event if the first month changes
			if (!newDate.equals(oldDate)) {
				this.navigate.emit({
					current: oldDate ? { year: oldDate.year, month: oldDate.month } : null,
					next: { year: newDate.year, month: newDate.month },
					preventDefault: () => (navigationPrevented = true),
				});

				// can't prevent the very first navigation
				if (navigationPrevented && oldDate !== null) {
					this._service.open(oldDate);
					return;
				}
			}

			const newSelectedDate = model.selectedDate;
			const newFocusedDate = model.focusDate;
			const oldFocusedDate = this.model ? this.model.focusDate : null;

			this.model = model;
			console.log('model', model);

			// handling selection change
			if (isChangedDate(newSelectedDate, this._controlValue)) {
				this._controlValue = newSelectedDate;
				this.onTouched();
				this.onChange(this._NgbMonthAdapter.toModel(newSelectedDate));
			}

			// handling focus change
			if (isChangedDate(newFocusedDate, oldFocusedDate) && oldFocusedDate && model.focusVisible) {
				this.focus();
			}

			cd.markForCheck();
		});
	}

	/**
	 *  Returns the readonly public state of the monthpicker
	 *
	 * @since 5.2.0
	 */
	get state(): NgbMonthpickerState {
		return this._publicState;
	}

	/**
	 *  Returns the calendar service used in the specific monthpicker instance.
	 *
	 *  @since 5.3.0
	 */
	get calendar(): NgbMonthCalendar {
		return this._calendar;
	}

	/**
	 * Returns the i18n service used in the specific monthpicker instance.
	 *
	 * @since 14.2.0
	 */
	get i18n(): NgbMonthpickerI18n {
		return this._i18n;
	}

	/**
	 *  Focuses on given date.
	 */
	focusDate(date?: NgbMonthStruct | null): void {
		this._service.focus(NgbMonth.from(date));
	}

	/**
	 *  Selects focused date.
	 */
	focusSelect(): void {
		this._service.focusSelect();
	}

	focus() {
		this._ngZone.onStable
			.asObservable()
			.pipe(take(1))
			.subscribe(() => this._nativeElement.querySelector<HTMLElement>('div.ngb-mp-month[tabindex="0"]')?.focus());
	}

	/**
	 * Navigates to the provided date.
	 *
	 * With the default calendar we use ISO 8601: 'month' is 1=Jan ... 12=Dec.
	 * If nothing or invalid date provided calendar will open current month.
	 *
	 * Use the `[startDate]` input as an alternative.
	 */
	navigateTo(date?: { year: number; month: number }) {
		this._service.open(NgbMonth.from(date ? (date as NgbMonthStruct) : null));
	}

	ngAfterViewInit() {
		this._ngZone.runOutsideAngular(() => {
			const focusIns$ = fromEvent<FocusEvent>(this._contentEl.nativeElement, 'focusin');
			const focusOuts$ = fromEvent<FocusEvent>(this._contentEl.nativeElement, 'focusout');

			// we're changing 'focusVisible' only when entering or leaving months view
			// and ignoring all focus events where both 'target' and 'related' target are month cells
			merge(focusIns$, focusOuts$)
				.pipe(
					filter((focusEvent) => {
						const target = focusEvent.target as HTMLElement | null;
						const relatedTarget = focusEvent.relatedTarget as HTMLElement | null;

						return !(
							target?.classList.contains('ngb-mp-month') &&
							relatedTarget?.classList.contains('ngb-mp-month') &&
							this._nativeElement.contains(target) &&
							this._nativeElement.contains(relatedTarget)
						);
					}),
					takeUntilDestroyed(this._destroyRef),
				)
				.subscribe(({ type }) => this._ngZone.run(() => this._service.set({ focusVisible: type === 'focusin' })));
		});
	}

	ngOnInit() {
		if (this.model === undefined) {
			const inputs: MonthpickerServiceInputs = {};
			['monthTemplateData', 'markDisabled', 'navigation', 'minDate', 'maxDate'].forEach(
				(name) => (inputs[name] = this[name]),
			);
			this._service.set(inputs);

			this.navigateTo(this.startDate);
		}
		if (!this.monthTemplate) {
			this.monthTemplate = this._defaultMonthTemplate;
		}
	}

	ngOnChanges(changes: SimpleChanges) {
		const inputs: MonthpickerServiceInputs = {};
		['monthTemplateData', 'markDisabled', 'navigation', 'minDate', 'maxDate']
			.filter((name) => name in changes)
			.forEach((name) => (inputs[name] = this[name]));
		this._service.set(inputs);

		if ('startDate' in changes) {
			const { currentValue, previousValue } = changes.startDate;
			if (isChangedMonth(previousValue, currentValue)) {
				this.navigateTo(this.startDate);
			}
		}
	}

	onDateSelect(date: NgbMonth) {
		this._service.focus(date);
		this._service.select(date, { emitEvent: true });
	}

	onNavigateDateSelect(date: NgbMonth) {
		this._service.open(date);
	}

	onNavigateEvent(event: NavigationEvent) {
		switch (event) {
			case NavigationEvent.PREV:
				this._service.open(this._calendar.getPrev(this.model.firstDate!, 'y', 1));
				break;
			case NavigationEvent.NEXT:
				this._service.open(this._calendar.getNext(this.model.firstDate!, 'y', 1));
				break;
		}
	}

	registerOnChange(fn: (value: any) => any): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: () => any): void {
		this.onTouched = fn;
	}

	setDisabledState(disabled: boolean) {
		this._service.set({ disabled });
	}

	writeValue(value) {
		this._controlValue = NgbMonth.from(this._NgbMonthAdapter.fromModel(value));
		this._service.select(this._controlValue);
	}
}
