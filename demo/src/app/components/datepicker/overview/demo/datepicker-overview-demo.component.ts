import {ChangeDetectionStrategy, Component} from '@angular/core';
import {NgbCalendar, NgbDate, NgbDateNativeAdapter} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-datepicker-demo-overview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mb-3">
      <h5>Vacations </h5>
      <p>
        from
        <b>{{ adapter.toModel(fromDate) | date : 'mediumDate' }}</b>
        to
        <b>{{ adapter.toModel(toDate ? toDate : hoveredDate) | date : 'mediumDate' }}</b>
      </p>
    </div>

    <ng-template #dayTemplate let-date="date" let-focused="focused"
                 let-currentMonth="currentMonth" let-disabled="disabled">

      <span class="custom-day" [ngbTooltip]="getTooltip(date)" container="body"
            [class.holiday]="!!isHoliday(date)"
            [class.weekend]="isWeekend(date)"
            [class.range]="isRange(date)"
            [class.faded]="isHovered(date) || isInside(date)"
            (mouseenter)="hoveredDate = date"
            (mouseleave)="hoveredDate = null">
        {{ date.day }}
      </span>
    </ng-template>

    <ngb-datepicker
      (select)="onDateSelection($event)"
      [dayTemplate]="dayTemplate"
      [markDisabled]="markDisabled"
      [showWeekNumbers]="true"
      outsideDays="hidden"
      [displayMonths]="2">
    </ngb-datepicker>
  `,
  styles: [`
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
    .weekend {
      color: #bbbbbb;
    }
    .weekend:hover {
      background-color: transparent;
    }
    .holiday, .holiday.weekend, .holiday:hover {
      color: white;
      background-color: coral;
    }
    .range:not(.holiday):not(.weekend), .custom-day:not(.weekend):not(.holiday):hover {
      background-color: rgb(2, 117, 216);
      color: white;
    }
    .faded:not(.holiday):not(.weekend) {
      background-color: rgba(2, 117, 216, 0.5);
    }
  `],
  providers: [NgbDateNativeAdapter]
})

export class NgbdDatepickerOverviewDemoComponent {

  hoveredDate: NgbDate;

  fromDate: NgbDate;
  toDate: NgbDate;

  holidays: {month, day, text}[] = [
    {month: 1, day: 1, text: 'New Years Day'},
    {month: 3, day: 30, text: 'Good Friday (hi, Alsace!)'},
    {month: 5, day: 1, text: 'Labour Day'},
    {month: 5, day: 5, text: 'V-E Day'},
    {month: 7, day: 14, text: 'Bastille Day'},
    {month: 8, day: 15, text: 'Assumption Day'},
    {month: 11, day: 1, text: 'All Saints Day'},
    {month: 11, day: 11, text: 'Armistice Day'},
    {month: 12, day: 25, text: 'Christmas Day'}
  ];

  constructor(private calendar: NgbCalendar, public adapter: NgbDateNativeAdapter) {
    this.markDisabled = this.markDisabled.bind(this);
    this.fromDate = this.getFirstAvailableDate(calendar.getToday());
    this.toDate = this.getFirstAvailableDate(calendar.getNext(calendar.getToday(), 'd', 15));
  }

  isHoliday(date: NgbDate): string {
    const holiday = this.holidays.find(h => h.day === date.day && h.month === date.month);
    return holiday ? holiday.text : '';
  }

  markDisabled(date: NgbDate, current: {month: number}) {
    return this.isHoliday(date) || (this.isWeekend(date) && date.month === current.month);
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && (date.after(this.fromDate) || date.equals(this.fromDate))) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  getTooltip(date: NgbDate) {
    const holidayTooltip = this.isHoliday(date);

    if (holidayTooltip) {
      return holidayTooltip;
    } else if (this.isRange(date) && !this.isWeekend(date)) {
      return 'Vacations!';
    } else {
      return '';
    }
  }

  getFirstAvailableDate(date): NgbDate {
    while (this.isWeekend(date) || this.isHoliday(date)) {
      date = this.calendar.getNext(date, 'd', 1);
    }
    return date;
  }

  isWeekend(date: NgbDate) {
    return this.calendar.getWeekday(date) >= 6;
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return date.after(this.fromDate) && date.before(this.toDate);
  }
}
