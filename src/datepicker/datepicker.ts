import { fromEvent, merge } from 'rxjs';
import { filter } from 'rxjs/operators';
import {
	afterNextRender,
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
import { NgTemplateOutlet } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
import { NgbDatepickerDayView } from './datepicker-day-view';
import { NgbDatepickerNavigation } from './datepicker-navigation';
import { ContentTemplateContext } from './datepicker-content-template-context';

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
	templateRef = inject(TemplateRef);
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
    imports: [NgTemplateOutlet],
    host: {
        role: 'grid',
        '(keydown)': 'onKeyDown($event)',
    },
    encapsulation: ViewEncapsulation.None,
    styleUrl: './datepicker-month.scss',
    template: `
		@if (viewModel.weekdays.length > 0) {
			<div class="ngb-dp-week ngb-dp-weekdays" role="row">
				@if (datepicker.showWeekNumbers) {
					<div class="ngb-dp-weekday ngb-dp-showweek small">{{ i18n.getWeekLabel() }}</div>
				}
				@for (weekday of viewModel.weekdays; track $index) {
					<div class="ngb-dp-weekday small" role="columnheader">{{ weekday }}</div>
				}
			</div>
		}
		@for (week of viewModel.weeks; track week) {
			@if (!week.collapsed) {
				<div class="ngb-dp-week" role="row">
					@if (datepicker.showWeekNumbers) {
						<div class="ngb-dp-week-number small text-muted">{{ i18n.getWeekNumerals(week.number) }}</div>
					}
					@for (day of week.days; track day) {
						<div
							(click)="doSelect(day); $event.preventDefault()"
							class="ngb-dp-day"
							role="gridcell"
							[class.disabled]="day.context.disabled"
							[tabindex]="day.tabindex"
							[class.hidden]="day.hidden"
							[class.ngb-dp-today]="day.context.today"
							[attr.aria-label]="day.ariaLabel"
						>
							@if (!day.hidden) {
								<ng-template [ngTemplateOutlet]="datepicker.dayTemplate" [ngTemplateOutletContext]="day.context" />
							}
						</div>
					}
				</div>
			}
		}
	`
})
export class NgbDatepickerMonth {
	private _keyboardService = inject(NgbDatepickerKeyboardService);
	private _service = inject(NgbDatepickerService);

	i18n = inject(NgbDatepickerI18n);
	datepicker = inject(NgbDatepicker);

	viewModel: MonthViewModel;

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
    imports: [NgTemplateOutlet, NgbDatepickerDayView, NgbDatepickerMonth, NgbDatepickerNavigation],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    styleUrl: './datepicker.scss',
    host: {
        '[class.disabled]': 'model.disabled',
    },
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
			@for (month of model.months; track month) {
				<div class="ngb-dp-month">
					@if (navigation === 'none' || (displayMonths > 1 && navigation === 'select')) {
						<div class="ngb-dp-month-name">
							{{ i18n.getMonthLabel(month.firstDate) }}
						</div>
					}
					<ngb-datepicker-month [month]="month.firstDate" />
				</div>
			}
		</ng-template>

		<div class="ngb-dp-header">
			@if (navigation !== 'none') {
				<ngb-datepicker-navigation
					[date]="model.firstDate!"
					[months]="model.months"
					[disabled]="model.disabled"
					[showSelect]="model.navigation === 'select'"
					[prevDisabled]="model.prevDisabled"
					[nextDisabled]="model.nextDisabled"
					[selectBoxes]="model.selectBoxes"
					(navigate)="onNavigateEvent($event)"
					(select)="onNavigateDateSelect($event)"
				/>
			}
		</div>

		<div class="ngb-dp-content" [class.ngb-dp-months]="!contentTemplate" #content>
			<ng-template
				[ngTemplateOutlet]="contentTemplate || contentTemplateFromContent?.templateRef || defaultContentTemplate"
				[ngTemplateOutletContext]="{ $implicit: this }"
				[ngTemplateOutletInjector]="injector"
			/>
		</div>

		<ng-template [ngTemplateOutlet]="footerTemplate" />
	`,
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NgbDatepicker), multi: true },
        NgbDatepickerService,
    ]
})
export class NgbDatepicker implements AfterViewInit, OnChanges, OnInit, ControlValueAccessor {
	static ngAcceptInputType_autoClose: boolean | string;
	static ngAcceptInputType_navigation: string;
	static ngAcceptInputType_outsideDays: string;
	static ngAcceptInputType_weekdays: boolean | string;

	model: DatepickerViewModel;

	@ViewChild('defaultDayTemplate', { static: true }) private _defaultDayTemplate: TemplateRef<DayTemplateContext>;
	@ViewChild('content', { static: true }) private _contentEl: ElementRef<HTMLElement>;

	protected injector = inject(Injector);

	private _service = inject(NgbDatepickerService);
	private _calendar = inject(NgbCalendar);
	private _i18n = inject(NgbDatepickerI18n);
	private _config = inject(NgbDatepickerConfig);
	private _nativeElement = inject(ElementRef).nativeElement as HTMLElement;
	private _ngbDateAdapter = inject(NgbDateAdapter<any>);
	private _ngZone = inject(NgZone);
	private _destroyRef = inject(DestroyRef);
	private _injector = inject(Injector);

	private _controlValue: NgbDate | null = null;
	private _publicState: NgbDatepickerState = <any>{};
	private _initialized = false;

	/**
	 * The reference to a custom content template.
	 *
	 * Allows to completely override the way datepicker displays months.
	 *
	 * See [`NgbDatepickerContent`](#/components/datepicker/api#NgbDatepickerContent) and
	 * [`ContentTemplateContext`](#/components/datepicker/api#ContentTemplateContext) for more details.
	 *
	 * @since 14.2.0
	 */
	@Input() contentTemplate: TemplateRef<ContentTemplateContext>;
	@ContentChild(NgbDatepickerContent, { static: true }) contentTemplateFromContent?: NgbDatepickerContent;

	/**
	 * The reference to a custom template for the day.
	 *
	 * Allows to completely override the way a day 'cell' in the calendar is displayed.
	 *
	 * See [`DayTemplateContext`](#/components/datepicker/api#DayTemplateContext) for the data you get inside.
	 */
	@Input() dayTemplate = this._config.dayTemplate;

	/**
	 * The callback to pass any arbitrary data to the template cell via the
	 * [`DayTemplateContext`](#/components/datepicker/api#DayTemplateContext)'s `data` parameter.
	 *
	 * `current` is the month that is currently displayed by the datepicker.
	 *
	 * @since 3.3.0
	 */
	@Input() dayTemplateData = this._config.dayTemplateData;

	/**
	 * The number of months to display.
	 */
	@Input() displayMonths = this._config.displayMonths;

	/**
	 * The first day of the week.
	 *
	 * With default calendar we use ISO 8601: 'weekday' is 1=Mon ... 7=Sun.
	 */
	@Input() firstDayOfWeek = this._config.firstDayOfWeek;

	/**
	 * The reference to the custom template for the datepicker footer.
	 *
	 * @since 3.3.0
	 */
	@Input() footerTemplate = this._config.footerTemplate;

	/**
	 * The callback to mark some dates as disabled.
	 *
	 * It is called for each new date when navigating to a different month.
	 *
	 * `current` is the month that is currently displayed by the datepicker.
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
	 * The way of displaying days that don't belong to the current month.
	 *
	 * * `"visible"` - days are visible
	 * * `"hidden"` - days are hidden, white space preserved
	 * * `"collapsed"` - days are collapsed, so the datepicker height might change between months
	 *
	 * For the 2+ months view, days in between months are never shown.
	 */
	@Input() outsideDays = this._config.outsideDays;

	/**
	 * If `true`, week numbers will be displayed.
	 */
	@Input() showWeekNumbers = this._config.showWeekNumbers;

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
	 * The way weekdays should be displayed.
	 *
	 * * `true` - weekdays are displayed using default width
	 * * `false` - weekdays are not displayed
	 * * `"short" | "long" | "narrow"` - weekdays are displayed using specified width
	 *
	 * @since 9.1.0
	 */
	@Input() weekdays = this._config.weekdays;

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
	 * Returns the i18n service used in the specific datepicker instance.
	 *
	 * @since 14.2.0
	 */
	get i18n(): NgbDatepickerI18n {
		return this._i18n;
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
		afterNextRender(
			{
				read: () => {
					this._nativeElement.querySelector<HTMLElement>('div.ngb-dp-day[tabindex="0"]')?.focus();
				},
			},
			{ injector: this._injector },
		);
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

			// we're changing 'focusVisible' only when entering or leaving months view
			// and ignoring all focus events where both 'target' and 'related' target are day cells
			merge(focusIns$, focusOuts$)
				.pipe(
					filter((focusEvent) => {
						const target = focusEvent.target as HTMLElement | null;
						const relatedTarget = focusEvent.relatedTarget as HTMLElement | null;

						return !(
							target?.classList.contains('ngb-dp-day') &&
							relatedTarget?.classList.contains('ngb-dp-day') &&
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
		this._initialized = true;
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

		if ('startDate' in changes && this._initialized) {
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
