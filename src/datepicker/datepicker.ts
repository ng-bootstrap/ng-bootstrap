import { fromEvent, merge, Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ContentChild,
	Directive,
	ElementRef,
	EventEmitter,
	forwardRef,
	Inject,
	Input,
	NgZone,
	OnChanges,
	OnDestroy,
	OnInit,
	Output,
	SimpleChanges,
	TemplateRef,
	ViewChild,
	ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgFor, NgIf, NgTemplateOutlet, TranslationWidth } from '@angular/common';

import { NgbCalendar } from './ngb-calendar';
import { NgbDate } from './ngb-date';
import { DatepickerServiceInputs, NgbDatepickerService } from './datepicker-service';
import { DatepickerViewModel, DayViewModel, MonthViewModel, NavigationEvent } from './datepicker-view-model';
import { DayTemplateContext } from './datepicker-day-template-context';
import { NgbDatepickerConfig } from './datepicker-config';
import { NgbDateAdapter } from './adapters/ngb-date-adapter';
import { NgbDateStruct } from './ngb-date-struct';
import { NgbDatepickerI18n } from './datepicker-i18n';
import { NgbDatepickerKeyboardService } from './datepicker-keyboard-service';
import { isChangedDate, isChangedMonth } from './datepicker-tools';
import { hasClassName } from '../util/util';
import { NgbDatepickerDayView } from './datepicker-day-view';
import { NgbDatepickerNavigation } from './datepicker-navigation';

/**
 * An event emitted right before the navigation happens and the month displayed by the datepicker changes.
 */
export interface NgbDatepickerNavigateEvent {
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
 * An interface that represents the readonly public state of the datepicker.
 *
 * Accessible via the `datepicker.state` getter
 *
 * @since 5.2.0
 */
export interface NgbDatepickerState {
	/**
	 * The earliest date that can be displayed or selected
	 */
	readonly minDate: NgbDate | null;

	/**
	 * The latest date that can be displayed or selected
	 */
	readonly maxDate: NgbDate | null;

	/**
	 * The first visible date of currently displayed months
	 */
	readonly firstDate: NgbDate;

	/**
	 * The last visible date of currently displayed months
	 */
	readonly lastDate: NgbDate;

	/**
	 * The date currently focused by the datepicker
	 */
	readonly focusedDate: NgbDate;

	/**
	 * First dates of months currently displayed by the datepicker
	 *
	 * @since 5.3.0
	 */
	readonly months: NgbDate[];
}

/**
 * A directive that marks the content template that customizes the way datepicker months are displayed
 *
 * @since 5.3.0
 */
@Directive({ selector: 'ng-template[ngbDatepickerContent]', standalone: true })
export class NgbDatepickerContent {
	constructor(public templateRef: TemplateRef<any>) {}
}

/**
 * A component that renders one month including all the days, weekdays and week numbers. Can be used inside
 * the `<ng-template ngbDatepickerMonths></ng-template>` when you want to customize months layout.
 *
 * For a usage example, see [custom month layout demo](#/components/datepicker/examples#custommonth)
 *
 * @since 5.3.0
 */
@Component({
	selector: 'ngb-datepicker-month',
	standalone: true,
	imports: [NgIf, NgFor, NgTemplateOutlet],
	host: { role: 'grid', '(keydown)': 'onKeyDown($event)' },
	encapsulation: ViewEncapsulation.None,
	styleUrls: ['./datepicker-month.scss'],
	template: `
		<div *ngIf="viewModel.weekdays.length > 0" class="ngb-dp-week ngb-dp-weekdays" role="row">
			<div *ngIf="datepicker.showWeekNumbers" class="ngb-dp-weekday ngb-dp-showweek small">{{
				i18n.getWeekLabel()
			}}</div>
			<div *ngFor="let weekday of viewModel.weekdays" class="ngb-dp-weekday small" role="columnheader">{{
				weekday
			}}</div>
		</div>
		<ng-template ngFor let-week [ngForOf]="viewModel.weeks">
			<div *ngIf="!week.collapsed" class="ngb-dp-week" role="row">
				<div *ngIf="datepicker.showWeekNumbers" class="ngb-dp-week-number small text-muted">{{
					i18n.getWeekNumerals(week.number)
				}}</div>
				<div
					*ngFor="let day of week.days"
					(click)="doSelect(day); $event.preventDefault()"
					class="ngb-dp-day"
					role="gridcell"
					[class.disabled]="day.context.disabled"
					[tabindex]="day.tabindex"
					[class.hidden]="day.hidden"
					[class.ngb-dp-today]="day.context.today"
					[attr.aria-label]="day.ariaLabel"
				>
					<ng-template [ngIf]="!day.hidden">
						<ng-template
							[ngTemplateOutlet]="datepicker.dayTemplate"
							[ngTemplateOutletContext]="day.context"
						></ng-template>
					</ng-template>
				</div>
			</div>
		</ng-template>
	`,
})
export class NgbDatepickerMonth {
	/**
	 * The first date of month to be rendered.
	 *
	 * This month must one of the months present in the
	 * [datepicker state](#/components/datepicker/api#NgbDatepickerState).
	 */
	@Input()
	set month(month: NgbDateStruct) {
		this.viewModel = this._service.getMonth(month);
	}

	viewModel: MonthViewModel;

	constructor(
		public i18n: NgbDatepickerI18n,
		@Inject(forwardRef(() => NgbDatepicker)) public datepicker: NgbDatepicker,
		private _keyboardService: NgbDatepickerKeyboardService,
		private _service: NgbDatepickerService,
	) {}

	onKeyDown(event: KeyboardEvent) {
		this._keyboardService.processKey(event, this.datepicker);
	}

	doSelect(day: DayViewModel) {
		if (!day.context.disabled && !day.hidden) {
			this.datepicker.onDateSelect(day.date);
		}
	}
}

/**
 * A highly configurable component that helps you with selecting calendar dates.
 *
 * `NgbDatepicker` is meant to be displayed inline on a page or put inside a popup.
 */
@Component({
	exportAs: 'ngbDatepicker',
	selector: 'ngb-datepicker',
	standalone: true,
	imports: [NgIf, NgFor, NgTemplateOutlet, NgbDatepickerDayView, NgbDatepickerMonth, NgbDatepickerNavigation],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	styleUrls: ['./datepicker.scss'],
	host: { '[class.disabled]': 'model.disabled' },
	template: `
		<ng-template
			#defaultDayTemplate
			let-date="date"
			let-currentMonth="currentMonth"
			let-selected="selected"
			let-disabled="disabled"
			let-focused="focused"
		>
			<div
				ngbDatepickerDayView
				[date]="date"
				[currentMonth]="currentMonth"
				[selected]="selected"
				[disabled]="disabled"
				[focused]="focused"
			>
			</div>
		</ng-template>

		<ng-template #defaultContentTemplate>
			<div *ngFor="let month of model.months; let i = index" class="ngb-dp-month">
				<div *ngIf="navigation === 'none' || (displayMonths > 1 && navigation === 'select')" class="ngb-dp-month-name">
					{{ i18n.getMonthLabel(month.firstDate) }}
				</div>
				<ngb-datepicker-month [month]="month.firstDate"></ngb-datepicker-month>
			</div>
		</ng-template>

		<div class="ngb-dp-header">
			<ngb-datepicker-navigation
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
			</ngb-datepicker-navigation>
		</div>

		<div class="ngb-dp-content" [class.ngb-dp-months]="!contentTemplate" #content>
			<ng-template [ngTemplateOutlet]="contentTemplate?.templateRef || defaultContentTemplate"></ng-template>
		</div>

		<ng-template [ngTemplateOutlet]="footerTemplate"></ng-template>
	`,
	providers: [
		{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NgbDatepicker), multi: true },
		NgbDatepickerService,
	],
})
export class NgbDatepicker implements AfterViewInit, OnDestroy, OnChanges, OnInit, ControlValueAccessor {
	static ngAcceptInputType_autoClose: boolean | string;
	static ngAcceptInputType_navigation: string;
	static ngAcceptInputType_outsideDays: string;
	static ngAcceptInputType_weekdays: boolean | number;

	model: DatepickerViewModel;

	@ViewChild('defaultDayTemplate', { static: true }) private _defaultDayTemplate: TemplateRef<DayTemplateContext>;
	@ViewChild('content', { static: true }) private _contentEl: ElementRef<HTMLElement>;
	@ContentChild(NgbDatepickerContent, { static: true }) contentTemplate?: NgbDatepickerContent;

	private _controlValue: NgbDate | null = null;
	private _destroyed$ = new Subject<void>();
	private _publicState: NgbDatepickerState = <any>{};

	/**
	 * The reference to a custom template for the day.
	 *
	 * Allows to completely override the way a day 'cell' in the calendar is displayed.
	 *
	 * See [`DayTemplateContext`](#/components/datepicker/api#DayTemplateContext) for the data you get inside.
	 */
	@Input() dayTemplate: TemplateRef<DayTemplateContext>;

	/**
	 * The callback to pass any arbitrary data to the template cell via the
	 * [`DayTemplateContext`](#/components/datepicker/api#DayTemplateContext)'s `data` parameter.
	 *
	 * `current` is the month that is currently displayed by the datepicker.
	 *
	 * @since 3.3.0
	 */
	@Input() dayTemplateData: (date: NgbDate, current?: { year: number; month: number }) => any;

	/**
	 * The number of months to display.
	 */
	@Input() displayMonths: number;

	/**
	 * The first day of the week.
	 *
	 * With default calendar we use ISO 8601: 'weekday' is 1=Mon ... 7=Sun.
	 */
	@Input() firstDayOfWeek: number;

	/**
	 * The reference to the custom template for the datepicker footer.
	 *
	 * @since 3.3.0
	 */
	@Input() footerTemplate: TemplateRef<any>;

	/**
	 * The callback to mark some dates as disabled.
	 *
	 * It is called for each new date when navigating to a different month.
	 *
	 * `current` is the month that is currently displayed by the datepicker.
	 */
	@Input() markDisabled: (date: NgbDate, current?: { year: number; month: number }) => boolean;

	/**
	 * The latest date that can be displayed or selected.
	 *
	 * If not provided, 'year' select box will display 10 years after the current month.
	 */
	@Input() maxDate: NgbDateStruct;

	/**
	 * The earliest date that can be displayed or selected.
	 *
	 * If not provided, 'year' select box will display 10 years before the current month.
	 */
	@Input() minDate: NgbDateStruct;

	/**
	 * Navigation type.
	 *
	 * * `"select"` - select boxes for month and navigation arrows
	 * * `"arrows"` - only navigation arrows
	 * * `"none"` - no navigation visible at all
	 */
	@Input() navigation: 'select' | 'arrows' | 'none';

	/**
	 * The way of displaying days that don't belong to the current month.
	 *
	 * * `"visible"` - days are visible
	 * * `"hidden"` - days are hidden, white space preserved
	 * * `"collapsed"` - days are collapsed, so the datepicker height might change between months
	 *
	 * For the 2+ months view, days in between months are never shown.
	 */
	@Input() outsideDays: 'visible' | 'collapsed' | 'hidden';

	/**
	 * If `true`, week numbers will be displayed.
	 */
	@Input() showWeekNumbers: boolean;

	/**
	 * The date to open calendar with.
	 *
	 * With the default calendar we use ISO 8601: 'month' is 1=Jan ... 12=Dec.
	 * If nothing or invalid date is provided, calendar will open with current month.
	 *
	 * You could use `navigateTo(date)` method as an alternative.
	 */
	@Input() startDate: { year: number; month: number; day?: number };

	/**
	 * The way weekdays should be displayed.
	 *
	 * * `true` - weekdays are displayed using default width
	 * * `false` - weekdays are not displayed
	 * * `TranslationWidth` - weekdays are displayed using specified width
	 *
	 * @since 9.1.0
	 */
	@Input() weekdays: TranslationWidth | boolean;

	/**
	 * An event emitted right before the navigation happens and displayed month changes.
	 *
	 * See [`NgbDatepickerNavigateEvent`](#/components/datepicker/api#NgbDatepickerNavigateEvent) for the payload info.
	 */
	@Output() navigate = new EventEmitter<NgbDatepickerNavigateEvent>();

	/**
	 * An event emitted when user selects a date using keyboard or mouse.
	 *
	 * The payload of the event is currently selected `NgbDate`.
	 *
	 * @since 5.2.0
	 */
	@Output() dateSelect = new EventEmitter<NgbDate>();

	onChange = (_: any) => {};
	onTouched = () => {};

	constructor(
		private _service: NgbDatepickerService,
		private _calendar: NgbCalendar,
		public i18n: NgbDatepickerI18n,
		config: NgbDatepickerConfig,
		cd: ChangeDetectorRef,
		private _elementRef: ElementRef<HTMLElement>,
		private _ngbDateAdapter: NgbDateAdapter<any>,
		private _ngZone: NgZone,
	) {
		[
			'dayTemplate',
			'dayTemplateData',
			'displayMonths',
			'firstDayOfWeek',
			'footerTemplate',
			'markDisabled',
			'minDate',
			'maxDate',
			'navigation',
			'outsideDays',
			'showWeekNumbers',
			'startDate',
			'weekdays',
		].forEach((input) => (this[input] = config[input]));

		_service.dateSelect$.pipe(takeUntil(this._destroyed$)).subscribe((date) => {
			this.dateSelect.emit(date);
		});

		_service.model$.pipe(takeUntil(this._destroyed$)).subscribe((model) => {
			const newDate = model.firstDate!;
			const oldDate = this.model ? this.model.firstDate : null;

			// update public state
			this._publicState = {
				maxDate: model.maxDate,
				minDate: model.minDate,
				firstDate: model.firstDate!,
				lastDate: model.lastDate!,
				focusedDate: model.focusDate!,
				months: model.months.map((viewModel) => viewModel.firstDate),
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

			// handling selection change
			if (isChangedDate(newSelectedDate, this._controlValue)) {
				this._controlValue = newSelectedDate;
				this.onTouched();
				this.onChange(this._ngbDateAdapter.toModel(newSelectedDate));
			}

			// handling focus change
			if (isChangedDate(newFocusedDate, oldFocusedDate) && oldFocusedDate && model.focusVisible) {
				this.focus();
			}

			cd.markForCheck();
		});
	}

	/**
	 *  Returns the readonly public state of the datepicker
	 *
	 * @since 5.2.0
	 */
	get state(): NgbDatepickerState {
		return this._publicState;
	}

	/**
	 *  Returns the calendar service used in the specific datepicker instance.
	 *
	 *  @since 5.3.0
	 */
	get calendar(): NgbCalendar {
		return this._calendar;
	}

	/**
	 *  Focuses on given date.
	 */
	focusDate(date?: NgbDateStruct | null): void {
		this._service.focus(NgbDate.from(date));
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
			.subscribe(() => {
				const elementToFocus =
					this._elementRef.nativeElement.querySelector<HTMLDivElement>('div.ngb-dp-day[tabindex="0"]');
				if (elementToFocus) {
					elementToFocus.focus();
				}
			});
	}

	/**
	 * Navigates to the provided date.
	 *
	 * With the default calendar we use ISO 8601: 'month' is 1=Jan ... 12=Dec.
	 * If nothing or invalid date provided calendar will open current month.
	 *
	 * Use the `[startDate]` input as an alternative.
	 */
	navigateTo(date?: { year: number; month: number; day?: number }) {
		this._service.open(NgbDate.from(date ? (date.day ? (date as NgbDateStruct) : { ...date, day: 1 }) : null));
	}

	ngAfterViewInit() {
		this._ngZone.runOutsideAngular(() => {
			const focusIns$ = fromEvent<FocusEvent>(this._contentEl.nativeElement, 'focusin');
			const focusOuts$ = fromEvent<FocusEvent>(this._contentEl.nativeElement, 'focusout');
			const { nativeElement } = this._elementRef;

			// we're changing 'focusVisible' only when entering or leaving months view
			// and ignoring all focus events where both 'target' and 'related' target are day cells
			merge(focusIns$, focusOuts$)
				.pipe(
					filter(
						({ target, relatedTarget }) =>
							!(
								hasClassName(target, 'ngb-dp-day') &&
								hasClassName(relatedTarget, 'ngb-dp-day') &&
								nativeElement.contains(target as Node) &&
								nativeElement.contains(relatedTarget as Node)
							),
					),
					takeUntil(this._destroyed$),
				)
				.subscribe(({ type }) => this._ngZone.run(() => this._service.set({ focusVisible: type === 'focusin' })));
		});
	}

	ngOnDestroy() {
		this._destroyed$.next();
	}

	ngOnInit() {
		if (this.model === undefined) {
			const inputs: DatepickerServiceInputs = {};
			[
				'dayTemplateData',
				'displayMonths',
				'markDisabled',
				'firstDayOfWeek',
				'navigation',
				'minDate',
				'maxDate',
				'outsideDays',
				'weekdays',
			].forEach((name) => (inputs[name] = this[name]));
			this._service.set(inputs);

			this.navigateTo(this.startDate);
		}
		if (!this.dayTemplate) {
			this.dayTemplate = this._defaultDayTemplate;
		}
	}

	ngOnChanges(changes: SimpleChanges) {
		const inputs: DatepickerServiceInputs = {};
		[
			'dayTemplateData',
			'displayMonths',
			'markDisabled',
			'firstDayOfWeek',
			'navigation',
			'minDate',
			'maxDate',
			'outsideDays',
			'weekdays',
		]
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

	onDateSelect(date: NgbDate) {
		this._service.focus(date);
		this._service.select(date, { emitEvent: true });
	}

	onNavigateDateSelect(date: NgbDate) {
		this._service.open(date);
	}

	onNavigateEvent(event: NavigationEvent) {
		switch (event) {
			case NavigationEvent.PREV:
				this._service.open(this._calendar.getPrev(this.model.firstDate!, 'm', 1));
				break;
			case NavigationEvent.NEXT:
				this._service.open(this._calendar.getNext(this.model.firstDate!, 'm', 1));
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
		this._controlValue = NgbDate.from(this._ngbDateAdapter.fromModel(value));
		this._service.select(this._controlValue);
	}
}
