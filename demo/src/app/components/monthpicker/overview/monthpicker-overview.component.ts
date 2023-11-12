import { ChangeDetectionStrategy, Component } from '@angular/core';

import { environment } from '../../../../environments/environment';

import { Snippet } from '../../../services/snippet';
import { NgbdDemoListService } from '../../../services/demo-list.service';
import { NgbdCodeComponent } from '../../../shared/code/code.component';
import { RouterLink } from '@angular/router';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbdMonthpickerOverviewDemoComponent } from './demo/monthpicker-overview-demo.component';
import { NgbdOverviewSectionComponent } from '../../../shared/overview/overview-section.component';
import { NgbdOverview } from '../../../shared/overview/overview';

@Component({
	selector: 'ngbd-monthpicker-overview',
	standalone: true,
	imports: [
		NgbdCodeComponent,
		RouterLink,
		NgbdOverviewSectionComponent,
		NgbAlertModule,
		NgbdMonthpickerOverviewDemoComponent,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './monthpicker-overview.component.html',
	host: {
		'[class.overview]': 'true',
	},
})
export class NgbdMonthpickerOverviewComponent {
	snippets = {
		basic: Snippet({
			lang: 'html',
			code: `
        <!-- 1. inline monthpicker -->
        <ngb-monthpicker #d></ngb-monthpicker>

        <!-- 2. monthpicker in the popup -->
        <input type="text" ngbMonthpicker #d="ngbMonthpicker"/>
      `,
		}),
		popup: Snippet({
			lang: 'html',
			code: `
        <input type="text" ngbMonthpicker #d="ngbMonthpicker"/>
        <button (click)="d.toggle()">Toggle</button>
      `,
		}),
		form: Snippet({
			lang: 'html',
			code: `
        <input type="text" ngbMonthpicker [(ngModel)]="date"/>
      `,
		}),
		selection: Snippet({
			lang: 'html',
			code: `
        <!-- inline -->
        <ngb-monthpicker (dateSelect)="onDateSelect($event)"></ngb-monthpicker>

        <!-- in the popup -->
        <input type="text" ngbMonthpicker (dateSelect)="onDateSelect($event)"/>
      `,
		}),
		navigation: Snippet({
			lang: 'html',
			code: `
        <ngb-monthpicker #d [startDate]="{year: 1789, month: 7}"></ngb-monthpicker>
        <button (click)="d.navigateTo({year: 2048, month: 1})">Goto JAN 2048</button>
      `,
		}),
		dateStruct: Snippet({
			lang: 'typescript',
			code: `
        const date: NgbMonthStruct = { year: 1789, month: 7}; // July, 1789
      `,
		}),
		date: Snippet({
			lang: 'typescript',
			code: `
        const date: NgbMonth = new NgbMonth(1789, 7);                // July, 1789

        date.before({ year: 1789, month: 7 });                // compare to a structure
        date.equals(NgbMonth.from({ year: 1789, month: 7 }));  // or to another date object
      `,
		}),
		nativeAdapter: Snippet({
			lang: 'typescript',
			code: `
        // native adapter is bundled with library
        providers: [{provide: NgbMonthAdapter, useClass: NgbMonthNativeAdapter}]

        // or another native adapter that works with UTC dates
        providers: [{provide: NgbMonthAdapter, useClass: NgbMonthNativeUTCAdapter}]
      `,
		}),
		adapter: Snippet({
			lang: 'typescript',
			code: `
        @Injectable()
        export abstract class NgbMonthAdapter<D> {
          abstract fromModel(value: D): NgbMonthStruct; // from your model -> internal model
          abstract toModel(date: NgbMonthStruct): D; // from internal model -> your mode
        }

        // create your own if necessary
        providers: [{provide: NgbMonthAdapter, useClass: YourOwnDateAdapter}]
      `,
		}),
		formatter: Snippet({
			lang: 'typescript',
			code: `
        @Injectable()
        export abstract class NgbMonthParserFormatter {
          abstract parse(value: string): NgbMonthStruct; // from input -> internal model
          abstract format(date: NgbMonthStruct): string; // from internal model -> string
        }

        // create your own if necessary
        providers: [{provide: NgbMonthParserFormatter, useClass: YourOwnParserFormatter}]
      `,
		}),
		monthTemplate: Snippet({
			lang: 'html',
			code: `
        <ng-template #t let-date>
        	{{ date.day }}
        </ng-template>

        <ngbMonthpicker [monthTemplate]=“t”/>
      `,
		}),
		contentTemplate: Snippet({
			lang: 'html',
			code: `
        <ngb-monthpicker #monthpicker
                        [startDate]="{month: 8, year: 2016}">
          <ng-template ngbMonthpickerContent>
            <div *ngFor="let monthStruct of monthpicker.state.months">
              <span>{{i18n.getMonthFullName(monthStruct.month)}} {{monthStruct.year}}</span>
              <ngb-monthpicker-month-view [month]="monthStruct"></ngb-monthpicker-month-view>
            </div>
          </ng-template>
        </ngb-monthpicker>
      `,
		}),
		todayHTML: Snippet({
			lang: 'html',
			code: `
        <div class="ngb-dp-day ngb-dp-today">
          <!-- day cell content omitted -->
        </div>
      `,
		}),
		tomonthTemplate: Snippet({
			lang: 'html',
			code: `
        <ng-template #t let-today="today">
          <span *ngIf="today">...</span>
        </ng-template>

        <ngbMonthpicker [monthTemplate]=“t”/>
      `,
		}),
		footerTemplate: Snippet({
			lang: 'html',
			code: `
        <ng-template #t>
          <button (click)="model = today">Today</button>
        </ng-template>

        <ngbMonthpicker [footerTemplate]=“t”/>
      `,
		}),
		disablingTS: Snippet({
			lang: 'typescript',
			code: `
        // disable the 13th of each month
        const isDisabled = (date: NgbMonth, current: {month: number}) => date.day === 13;
      `,
		}),
		disablingHTML: Snippet({
			lang: 'html',
			code: `
        <ngb-monthpicker [minDate]="{year: 2010, month: 1, day: 1}"
                        [maxDate]="{year: 2048, month: 12, day: 31}"
                        [markDisabled]="isDisabled">
        </ngb-monthpicker>
      `,
		}),
		i18n: Snippet({
			lang: 'typescript',
			code: `
        @Injectable()
        export abstract class NgbMonthpickerI18n {
          abstract getMonthShortName(month: number): string;
          abstract getMonthFullName(month: number): string;
          abstract getDayAriaLabel(date: NgbMonthStruct): string;
        }

        // provide your own if necessary
        providers: [{provide: NgbMonthpickerI18n, useClass: YourOwnMonthpickerI18n}]
      `,
		}),
	};

	bootstrapVersion = environment.bootstrap;

	sections: NgbdOverview = {};

	constructor(demoList: NgbdDemoListService) {
		this.sections = demoList.getOverviewSections('monthpicker');
	}
}
