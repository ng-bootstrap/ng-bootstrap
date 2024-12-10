import { Component } from '@angular/core';

import { Snippet } from '../../../services/snippet';
import { NgbdDatepickerHebrew } from '../demos/hebrew/datepicker-hebrew';
import { NgbdDatepickerIslamiccivil } from '../demos/islamiccivil/datepicker-islamiccivil';
import { NgbdDatepickerIslamicumalqura } from '../demos/islamicumalqura/datepicker-islamicumalqura';
import { NgbdDatepickerJalali } from '../demos/jalali/datepicker-jalali';
import { NgbdDatepickerBuddhist } from '../demos/buddhist/datepicker-buddhist';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { CodeComponent } from '../../../shared/code.component';
import { NgbdWidgetDemoComponent } from '../../../shared/examples-page/demo.component';
import { NgComponentOutlet } from '@angular/common';
import { NgbdDatepickerEthiopian } from '../demos/ethiopian/datepicker-ethiopian';
import { NgbdComponentPage } from '../../../shared/component-wrapper/component-page.class';
import { Demo, MenuItem } from 'src/app/tokens';

const DEMOS: Demo[] = [
	{
		fragment: 'hebrew',
		title: 'Hebrew',
		type: NgbdDatepickerHebrew,
		code: 'datepicker/demos/hebrew/datepicker-hebrew.ts',
		markup: 'datepicker/demos/hebrew/datepicker-hebrew.html',
	},
	{
		fragment: 'jalali',
		title: 'Jalali',
		type: NgbdDatepickerJalali,
		code: 'datepicker/demos/jalali/datepicker-jalali.ts',
		markup: 'datepicker/demos/jalali/datepicker-jalali.html',
	},
	{
		fragment: 'islamiccivil',
		title: 'Islamic Civil',
		type: NgbdDatepickerIslamiccivil,
		code: 'datepicker/demos/islamiccivil/datepicker-islamiccivil.ts',
		markup: 'datepicker/demos/islamiccivil/datepicker-islamiccivil.html',
	},
	{
		fragment: 'islamicumalqura',
		title: 'Islamic Umm al-Qura',
		type: NgbdDatepickerIslamicumalqura,
		code: 'datepicker/demos/islamicumalqura/datepicker-islamicumalqura.ts',
		markup: 'datepicker/demos/islamicumalqura/datepicker-islamicumalqura.html',
	},
	{
		fragment: 'buddhist',
		title: 'Buddhist',
		type: NgbdDatepickerBuddhist,
		code: 'datepicker/demos/buddhist/datepicker-buddhist.ts',
		markup: 'datepicker/demos/buddhist/datepicker-buddhist.html',
	},
	{
		fragment: 'ethiopian',
		title: 'Ethiopian',
		type: NgbdDatepickerEthiopian,
		code: 'datepicker/demos/ethiopian/datepicker-ethiopian.ts',
		markup: 'datepicker/demos/ethiopian/datepicker-ethiopian.html',
	},
];

@Component({
	selector: 'ngbd-datepicker-calendars',
	imports: [NgbAlertModule, CodeComponent, NgbdWidgetDemoComponent, NgComponentOutlet],
	template: `
		<p>
			Datepicker relies on <code>NgbCalendar</code> abstract class for calendar-related calculations. Default
			implementation is the <code>NgbCalendarGregorian</code>, but can be any calendar that has notion of days, months
			and years.
		</p>

		<p>For instance, other calendar implementations available are:</p>
		<ul class="list-unstyled ms-4">
			<li><code>NgbCalendarHebrew</code> + <code>NgbDatepickerI18nHebrew</code></li>
			<li><code>NgbCalendarPersian</code></li>
			<li><code>NgbCalendarIslamicCivil</code></li>
			<li><code>NgbCalendarIslamicUmalqura</code></li>
			<li><code>NgbCalendarBuddhist</code></li>
			<li><code>NgbCalendarEthiopian</code></li>
		</ul>

		<ngb-alert [dismissible]="false">
			Please note that calendar support is experimental! We're not calendar experts and any community help is very much
			appreciated.
		</ngb-alert>

		<p>
			To use any of them, simply provide a different calendar implementation. Some calendars (like Hebrew in the example
			and demo below) also come with i18n support to override the way day/week/year numerals and weekday/month names are
			displayed.
		</p>

		<ngbd-code [snippet]="snippets.calendars"></ngbd-code>

		<br />

		<p>Here are some demos of the calendars you can use</p>

		<br />

		@for (demo of demos; track demo) {
			<ngbd-widget-demo
				[fragment]="demo.fragment"
				[demoTitle]="demo.title"
				[code]="demo.code"
				[markup]="demo.markup"
				component="datepicker"
			>
				<ng-template [ngComponentOutlet]="demo.type"></ng-template>
			</ngbd-widget-demo>
		}
	`,
})
export class NgbdDatepickerCalendarsComponent extends NgbdComponentPage {
	get menuItems(): MenuItem[] {
		return DEMOS;
	}

	demos = DEMOS;

	snippets = {
		calendars: Snippet({
			lang: 'typescript',
			code: `
        providers: [
          {provide: NgbCalendar, useClass: NgbCalendarHebrew},
          {provide: NgbDatepickerI18n, useClass: NgbDatepickerI18nHebrew}
      ]
      `,
		}),
	};
}
