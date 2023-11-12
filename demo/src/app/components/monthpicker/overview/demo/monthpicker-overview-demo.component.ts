import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
	NgbMonth,
	NgbMonthNativeAdapter,
	NgbTooltipModule,
	NgbMonthpickerModule,
	NgbMonthCalendar,
} from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';

@Component({
	selector: 'ngbd-monthpicker-demo-overview',
	standalone: true,
	imports: [NgbTooltipModule, NgbMonthpickerModule, DatePipe],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="mb-3">
			<h5>Vacations</h5>
			<p>
				from
				<b>{{ adapter.toModel(fromDate) | date : 'mediumDate' }}</b>
				to
				<b>{{ adapter.toModel(toDate ? toDate : hoveredDate) | date : 'mediumDate' }}</b>
			</p>
		</div>

		<ng-template #monthTemplate let-date let-disabled="disabled">
			<span
				class="custom-day"
				[ngbTooltip]="getTooltip(date)"
				container="body"
				[class.holiday]="!!isHoliday(date)"
				[class.disabled]="disabled || isWeekend(date)"
				[class.range]="isRange(date)"
				[class.faded]="isHovered(date) || isInside(date)"
				(mouseenter)="hoveredDate = date"
				(mouseleave)="hoveredDate = null"
			>
				{{ date.day }}
			</span>
		</ng-template>

		<ngb-monthpicker
			(dateSelect)="onDateSelection($event)"
			[monthTemplate]="monthTemplate"
			[markDisabled]="markDisabled"
			[minDate]="today"
		>
		</ngb-monthpicker>
	`,
	styles: [
		`
			.custom-day {
				text-align: center;
				display: inline-block;
				width: 2rem;
				height: 2rem;
				line-height: 2rem;
			}
			.custom-day:hover {
				background-color: #e6e6e6;
			}
			.disabled {
				color: #bbbbbb;
			}
			.disabled:hover {
				background-color: transparent;
			}
			.holiday,
			.holiday.disabled,
			.holiday:hover {
				color: white;
				background-color: coral;
			}
			.range:not(.holiday):not(.disabled),
			.custom-day:not(.disabled):not(.holiday):hover {
				background-color: rgb(2, 117, 216);
				color: white;
			}
			.faded:not(.holiday):not(.disabled) {
				background-color: rgba(2, 117, 216, 0.5);
			}
		`,
	],
	providers: [NgbMonthNativeAdapter],
})
export class NgbdMonthpickerOverviewDemoComponent {
	today: NgbMonth;

	hoveredDate: NgbMonth | null = null;

	fromDate: NgbMonth;
	toDate: NgbMonth | null = null;

	holidays: { month: number; day: number; text: string }[] = [
		{ month: 1, day: 1, text: 'New Years Day' },
		{ month: 3, day: 30, text: 'Good Friday (hi, Alsace!)' },
		{ month: 5, day: 1, text: 'Labour Day' },
		{ month: 5, day: 5, text: 'V-E Day' },
		{ month: 7, day: 14, text: 'Bastille Day' },
		{ month: 8, day: 15, text: 'Assumption Day' },
		{ month: 11, day: 1, text: 'All Saints Day' },
		{ month: 11, day: 11, text: 'Armistice Day' },
		{ month: 12, day: 25, text: 'Christmas Day' },
	];

	constructor(private calendar: NgbMonthCalendar, public adapter: NgbMonthNativeAdapter) {
		this.markDisabled = this.markDisabled.bind(this);
		this.today = calendar.getToday();
		this.fromDate = this.getFirstAvailableDate(this.today);
		this.toDate = this.getFirstAvailableDate(calendar.getNext(this.today, 'm', 15));
	}

	isHoliday(date: NgbMonth): string {
		const holiday = this.holidays.find((h) => h.month === date.month);
		return holiday ? holiday.text : '';
	}

	markDisabled(date: NgbMonth, current: { year: number; month: number }): boolean {
		return this.isHoliday(date) !== '' || date.month === current.month;
	}

	onDateSelection(date: NgbMonth) {
		if (!this.fromDate && !this.toDate) {
			this.fromDate = date;
		} else if (this.fromDate && !this.toDate && (date.after(this.fromDate) || date.equals(this.fromDate))) {
			this.toDate = date;
		} else {
			this.toDate = null;
			this.fromDate = date;
		}
	}

	getTooltip(date: NgbMonth): string {
		const holidayTooltip = this.isHoliday(date);

		if (holidayTooltip) {
			return holidayTooltip;
		} else if (this.isRange(date)) {
			return 'Vacations!';
		} else {
			return '';
		}
	}

	getFirstAvailableDate(date: NgbMonth): NgbMonth {
		while (this.isHoliday(date)) {
			date = this.calendar.getNext(date, 'm', 1);
		}
		return date;
	}

	isRange(date: NgbMonth) {
		return (
			date.equals(this.fromDate) ||
			(this.toDate && date.equals(this.toDate)) ||
			this.isInside(date) ||
			this.isHovered(date)
		);
	}

	isHovered(date: NgbMonth) {
		return (
			this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
		);
	}

	isInside(date: NgbMonth) {
		return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
	}
}
