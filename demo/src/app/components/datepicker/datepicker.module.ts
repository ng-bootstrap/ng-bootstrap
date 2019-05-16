import { NgModule } from '@angular/core';

import { NgbdSharedModule } from '../../shared';
import { ComponentWrapper } from '../../shared/component-wrapper/component-wrapper.component';
import { NgbdComponentsSharedModule, NgbdDemoList } from '../shared';
import { NgbdApiPage } from '../shared/api-page/api.component';
import { NgbdExamplesPage } from '../shared/examples-page/examples.component';
import {
  DEMO_CALENDAR_MODULES,
  NgbdDatepickerCalendarsComponent
} from './calendars/datepicker-calendars.component';
import { NgbdDatepickerAdapter } from './demos/adapter/datepicker-adapter';
import { NgbdDatepickerAdapterModule } from './demos/adapter/datepicker-adpater.module';
import { NgbdDatepickerBasic } from './demos/basic/datepicker-basic';
import { NgbdDatepickerBasicModule } from './demos/basic/datepicker-basic.module';
import { NgbdDatepickerConfig } from './demos/config/datepicker-config';
import { NgbdDatepickerConfigModule } from './demos/config/datepicker-config.module';
import { NgbdDatepickerCustomday } from './demos/customday/datepicker-customday';
import { NgbdDatepickerCustomdayModule } from './demos/customday/datepicker-customday.module';
import { NgbdDatepickerDisabled } from './demos/disabled/datepicker-disabled';
import { NgbdDatepickerDisabledModule } from './demos/disabled/datepicker-disabled.module';
import { NgbdDatepickerFooterTemplateModule } from './demos/footertemplate/datepicker-footer-template.module';
import { NgbdDatepickerFootertemplate } from './demos/footertemplate/datepicker-footertemplate';
import { NgbdDatepickerI18n } from './demos/i18n/datepicker-i18n';
import { NgbdDatepickerI18nModule } from './demos/i18n/datepicker-i18n.module';
import { NgbdDatepickerMultiple } from './demos/multiple/datepicker-multiple';
import { NgbdDatepickerMultipleModule } from './demos/multiple/datepicker-multiple.module';
import { NgbdDatepickerPopup } from './demos/popup/datepicker-popup';
import { NgbdDatepickerPopupModule } from './demos/popup/datepicker-popup.module';
import { NgbdDatepickerRange } from './demos/range/datepicker-range';
import { NgbdDatepickerRangeModule } from './demos/range/datepicker-range.module';
import { NgbdDatepickerOverviewComponent } from './overview/datepicker-overview.component';
import { NgbdDatepickerOverviewDemoComponent } from './overview/demo/datepicker-overview-demo.component';
import { NgbdDatepickerPositiontargetModule } from './demos/positiontarget/datepicker-position-target.module';
import { NgbdDatepickerPositiontarget } from './demos/positiontarget/datepicker-positiontarget';

const OVERVIEW = {
  'basic-usage': 'Basic Usage',
  'getting-date': 'Getting/setting a date',
  'date-model': 'Date model and format',
  navigation: 'Moving around',
  'limiting-dates': 'Disabling and limiting dates',
  'day-template': 'Day display customization',
  today: 'Today\'s date',
  'footer-template': 'Custom footer',
  range: 'Range selection',
  i18n: 'Internationalization',
  'keyboard-shortcuts': 'Keyboard shortcuts'
};

const DEMOS = {
  basic: {
    title: 'Basic datepicker',
    type: NgbdDatepickerBasic,
    code: require('!!raw-loader!./demos/basic/datepicker-basic'),
    markup: require('!!raw-loader!./demos/basic/datepicker-basic.html')
  },
  popup: {
    title: 'Datepicker in a popup',
    type: NgbdDatepickerPopup,
    code: require('!!raw-loader!./demos/popup/datepicker-popup'),
    markup: require('!!raw-loader!./demos/popup/datepicker-popup.html')
  },
  multiple: {
    title: 'Multiple months',
    type: NgbdDatepickerMultiple,
    code: require('!!raw-loader!./demos/multiple/datepicker-multiple'),
    markup: require('!!raw-loader!./demos/multiple/datepicker-multiple.html')
  },
  range: {
    title: 'Range selection',
    type: NgbdDatepickerRange,
    code: require('!!raw-loader!./demos/range/datepicker-range'),
    markup: require('!!raw-loader!./demos/range/datepicker-range.html')
  },
  disabled: {
    title: 'Disabled datepicker',
    type: NgbdDatepickerDisabled,
    code: require('!!raw-loader!./demos/disabled/datepicker-disabled'),
    markup: require('!!raw-loader!./demos/disabled/datepicker-disabled.html')
  },
  adapter: {
    title: 'Custom date adapter',
    type: NgbdDatepickerAdapter,
    code: require('!!raw-loader!./demos/adapter/datepicker-adapter'),
    markup: require('!!raw-loader!./demos/adapter/datepicker-adapter.html')
  },
  i18n: {
    title: 'Internationalization of datepickers',
    type: NgbdDatepickerI18n,
    code: require('!!raw-loader!./demos/i18n/datepicker-i18n'),
    markup: require('!!raw-loader!./demos/i18n/datepicker-i18n.html')
  },
  customday: {
    title: 'Custom day view',
    type: NgbdDatepickerCustomday,
    code: require('!!raw-loader!./demos/customday/datepicker-customday'),
    markup: require('!!raw-loader!./demos/customday/datepicker-customday.html')
  },
  footertemplate: {
    title: 'Footer template',
    type: NgbdDatepickerFootertemplate,
    code: require('!!raw-loader!./demos/footertemplate/datepicker-footertemplate'),
    markup: require('!!raw-loader!./demos/footertemplate/datepicker-footertemplate.html')
  },
  positiontarget: {
    title: 'Position target',
    type: NgbdDatepickerPositiontarget,
    code: require('!!raw-loader!./demos/positiontarget/datepicker-positiontarget'),
    markup: require('!!raw-loader!./demos/positiontarget/datepicker-positiontarget.html')
  },
  config: {
    title: 'Global configuration of datepickers',
    type: NgbdDatepickerConfig,
    code: require('!!raw-loader!./demos/config/datepicker-config'),
    markup: require('!!raw-loader!./demos/config/datepicker-config.html')
  }
};

export const ROUTES = [
  { path: '', pathMatch: 'full', redirectTo: 'overview' },
  {
    path: '',
    component: ComponentWrapper,
    data: { OVERVIEW },
    children: [
      { path: 'overview', component: NgbdDatepickerOverviewComponent },
      { path: 'examples', component: NgbdExamplesPage },
      { path: 'calendars', component: NgbdDatepickerCalendarsComponent },
      { path: 'api', component: NgbdApiPage }
    ]
  }
];

@NgModule({
  imports: [
    NgbdSharedModule,
    NgbdComponentsSharedModule,
    NgbdDatepickerBasicModule,
    NgbdDatepickerPopupModule,
    NgbdDatepickerDisabledModule,
    NgbdDatepickerI18nModule,
    NgbdDatepickerCustomdayModule,
    NgbdDatepickerFooterTemplateModule,
    NgbdDatepickerConfigModule,
    NgbdDatepickerPositiontargetModule,
    NgbdDatepickerMultipleModule,
    NgbdDatepickerRangeModule,
    NgbdDatepickerAdapterModule,
    ...DEMO_CALENDAR_MODULES
  ],
  declarations: [
    NgbdDatepickerCalendarsComponent,
    NgbdDatepickerOverviewComponent,
    NgbdDatepickerOverviewDemoComponent
  ]
})
export class NgbdDatepickerModule {
  constructor(demoList: NgbdDemoList) {
    demoList.register('datepicker', DEMOS, OVERVIEW);
  }
}
