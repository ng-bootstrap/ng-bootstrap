import {NgModule} from '@angular/core';

import {NgbdSharedModule} from '../../../app/shared';
import {ComponentWrapper} from '../../shared/component-wrapper/component-wrapper.component';
import {NgbdComponentsSharedModule, NgbdDemoList} from '../shared';
import {NgbdApiPage} from '../shared/api-page/api.component';
import {NgbdExamplesPage} from '../shared/examples-page/examples.component';
import {NgbdToastCloseable} from './demos/closeable/toast-closeable';
import {NgbdToastCloseableModule} from './demos/closeable/toast-closeable.module';
import {NgbdToastCustomHeader} from './demos/custom-header/toast-custom-header';
import {NgbdToastCustomHeaderModule} from './demos/custom-header/toast-custom-header.module';
import {NgbdToastGlobal} from './demos/howto-global/toast-global.component';
import {NgbdToastGlobalModule} from './demos/howto-global/toast-global.module';
import {NgbdToastInline} from './demos/inline/toast-inline';
import {NgbdToastInlineModule} from './demos/inline/toast-inline.module';
import {NgbdToastPreventAutohide} from './demos/prevent-autohide/toast-prevent-autohide';
import {NgbdToastPreventAutohideModule} from './demos/prevent-autohide/toast-prevent-autohide.module';
import {NgbdToastOverviewComponent} from './overview/toast-overview.component';

const OVERVIEW = {
  'inline-usage': 'Declarative usage',
  'toast-service': 'Building a toast management service'
};

const DEMOS = {
  inline: {
    title: 'Declarative inline usage',
    type: NgbdToastInline,
    code: require('!!raw-loader!./demos/inline/toast-inline'),
    markup: require('!!raw-loader!./demos/inline/toast-inline.html')
  },
  'custom-header': {
    title: 'Using a Template as header',
    type: NgbdToastCustomHeader,
    files: [
      {
        name: 'toast-custom-header.html',
        source: require('!!raw-loader!./demos/custom-header/toast-custom-header.html')
      },
      {name: 'toast-custom-header.ts', source: require('!!raw-loader!./demos/custom-header/toast-custom-header')}
    ]
  },
  closeable: {
    title: 'Closeable toast',
    type: NgbdToastCloseable,
    files: [
      {name: 'toast-closeable.html', source: require('!!raw-loader!./demos/closeable/toast-closeable.html')},
      {name: 'toast-closeable.ts', source: require('!!raw-loader!./demos/closeable/toast-closeable.ts')}
    ]
  },
  'prevent-autohide': {
    title: 'Prevent autohide on mouseover',
    type: NgbdToastPreventAutohide,
    files: [
      {
        name: 'toast-prevent-autohide.html',
        source: require('!!raw-loader!./demos/prevent-autohide/toast-prevent-autohide.html')
      },
      {
        name: 'toast-prevent-autohide.ts',
        source: require('!!raw-loader!./demos/prevent-autohide/toast-prevent-autohide.ts')
      }
    ]
  },
  global: {
    title: 'Toast management service',
    type: NgbdToastGlobal,
    files: [
      {name: 'toast-service.ts', source: require('!!raw-loader!./demos/howto-global/toast-service.ts')}, {
        name: 'toast-global.component.html',
        source: require('!!raw-loader!./demos/howto-global/toast-global.component.html')
      },
      {name: 'toast-global.component.ts', source: require('!!raw-loader!./demos/howto-global/toast-global.component')},
      {
        name: 'toasts-container.component.ts',
        source: require('!!raw-loader!./demos/howto-global/toasts-container.component')
      }
    ]
  }
};

export const ROUTES = [
  {path: '', pathMatch: 'full', redirectTo: 'overview'}, {
    path: '',
    component: ComponentWrapper,
    data: {OVERVIEW},
    children: [
      {path: 'overview', component: NgbdToastOverviewComponent}, {path: 'examples', component: NgbdExamplesPage},
      {path: 'api', component: NgbdApiPage}
    ]
  }
];

@NgModule({
  imports: [
    NgbdSharedModule, NgbdComponentsSharedModule, NgbdToastInlineModule, NgbdToastCloseableModule,
    NgbdToastCustomHeaderModule, NgbdToastPreventAutohideModule, NgbdToastGlobalModule
  ],
  declarations: [NgbdToastOverviewComponent]
})
export class NgbdToastModule {
  constructor(demoList: NgbdDemoList) { demoList.register('toast', DEMOS, OVERVIEW); }
}
