import { NgModule } from '@angular/core';
import { NgbdSharedModule } from '../../shared';
import { ComponentWrapper } from '../../shared/component-wrapper/component-wrapper.component';
import { NgbdComponentsSharedModule, NgbdDemoList } from '../shared';
import { NgbdApiPage } from '../shared/api-page/api.component';
import { NgbdExamplesPage } from '../shared/examples-page/examples.component';
import { NgbdCheckboxBasic } from './demos/basic/checkbox-basic';
import { NgbdCheckboxBasicModule } from './demos/basic/checkbox-basic.module';
import { NgbdCheckboxForm } from './demos/form/checkbox-form';
import { NgbdCheckboxFormModule } from './demos/form/checkbox-form.module';

const DEMOS = {
  basic: {
    title: 'Basic demo',
    type: NgbdCheckboxBasic,
    code: require('!!raw-loader!./demos/basic/checkbox-basic').default,
    markup: require('!!raw-loader!./demos/basic/checkbox-basic.html').default
  },
  form: {
    title: 'Form integration',
    type: NgbdCheckboxForm,
    code: require('!!raw-loader!./demos/form/checkbox-form').default,
    markup: require('!!raw-loader!./demos/form/checkbox-form.html').default
  }
};

export const ROUTES = [
  { path: '', pathMatch: 'full', redirectTo: 'examples' },
  {
    path: '',
    component: ComponentWrapper,
    children: [{ path: 'examples', component: NgbdExamplesPage }, { path: 'api', component: NgbdApiPage }]
  }
];

@NgModule({
  imports: [NgbdSharedModule, NgbdComponentsSharedModule, NgbdCheckboxBasicModule, NgbdCheckboxFormModule]
})
export class NgbdCheckboxModule {
  constructor(demoList: NgbdDemoList) {
    demoList.register('checkbox', DEMOS);
  }
}
