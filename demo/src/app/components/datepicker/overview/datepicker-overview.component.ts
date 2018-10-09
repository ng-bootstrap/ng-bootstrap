import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgbdDemoList } from '../../shared';
import { NgbdOverview } from '../../shared/overview';

@Component({
  selector: 'ngbd-datepicker-overview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './datepicker-overview.component.html',
  host: {
    '[class.overview]': 'true'
  }
})

export class NgbdDatepickerOverviewComponent {

  snippets = {
    basic: `
<!-- 1. inline datepicker -->
<ngb-datepicker #d></ngb-datepicker>

<!-- 2. datepicker in the popup -->
<input type="text" ngbDatepicker #d="ngbDatepicker"/>
`,
    popup: `
<input type="text" ngbDatepicker #d="ngbDatepicker"/>
<button (click)="d.toggle()">Toggle</button>
`,
    form: `
<input type="text" ngbDatepicker [(ngModel)]="date"/>
`,
    selection: `
<!-- inline -->
<ngb-datepicker (select)="onDateSelect($event)"></ngb-datepicker>

<!-- in the popup -->
<input type="text" ngbDatepicker (dateSelect)="onDateSelect($event)"/>
`,
    navigation: `
<ngb-datepicker #d [startDate]="{year: 1789, month: 7}"></ngb-datepicker>
<button (click)="d.navigateTo({year: 2048, month: 1})">Goto JAN 2048</button>
`,
    dateStruct: `
const date: NgbDateStruct = { day: 14, month: 7, year: 1789 }; // July, 14 1789
`,
    nativeAdapter: `
// native adapter is bundled with library
providers: [{provide: NgbDateAdapter, useClass: NgbDateNativeAdapter}]
`,
    adapter: `
@Injectable()
export abstract class NgbDateAdapter<D> {
  abstract fromModel(value: D): NgbDateStruct; // from your model -> internal model
  abstract toModel(date: NgbDateStruct): D; // from internal model -> your mode
}

// create your own if necessary
providers: [{provide: NgbDateAdapter, useClass: YourOwnDateAdapter}]
`,
    formatter: `
@Injectable()
export abstract class NgbDateParserFormatter {
  abstract parse(value: string): NgbDateStruct; // from input -> internal model
  abstract format(date: NgbDateStruct): string; // from internal model -> string
}

// create your own if necessary
providers: [{provide: NgbDateParserFormatter, useClass: YourOwnParserFormatter}]
`,
    dayTemplate: `
<ng-template #t let-date>
	{{ date.day }}
</ng-template>

<ngbDatepicker [dayTemplate]=“t”/>
`,
    footerTemplate: `
<ng-template #t>
  <button (click)="model = today">Today</button>
</ng-template>

<ngbDatepicker [footerTemplate]=“t”/>
`,
  disablingTS: `
// disable the 13th of each month
const isDisabled = (date: NgbDateStruct, current: {month: number}) => day.date === 13;
`,
  disablingHTML: `
<ngb-datepicker [minDate]="{year: 2010, month: 1, day: 1}"
                [maxDate]="{year: 2048, month: 12, day: 31}"
                [markDisabled]="isDisabled">
</ngb-datepicker>
`,
  i18n: `
@Injectable()
export abstract class NgbDatepickerI18n {
  abstract getWeekdayShortName(weekday: number): string;
  abstract getMonthShortName(month: number): string;
  abstract getMonthFullName(month: number): string;
  abstract getDayAriaLabel(date: NgbDateStruct): string;
}

// provide your own if necessary
providers: [{provide: NgbDatepickerI18n, useClass: YourOwnDatepickerI18n}]
`
  };

  sections: NgbdOverview = {};

  constructor(demoList: NgbdDemoList) {
    this.sections = demoList.getOverviewSections('datepicker');
  }
}
