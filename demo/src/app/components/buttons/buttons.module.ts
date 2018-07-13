import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NgbdSharedModule } from '../../shared';
import { ComponentWrapper } from '../../shared/component-wrapper/component.component';
import { NgbdComponentsSharedModule } from '../shared';
import { getApis, NgbdApiPage } from '../shared/api-page/api.component';
import { NgbdExamplesPage } from '../shared/examples-page/examples.component';
import { NgbdButtonsCheckbox } from './demos/checkbox/buttons-checkbox';
import { NgbdButtonsCheckboxreactive } from './demos/checkboxreactive/buttons-checkboxreactive';
import { NgbdButtonsRadio } from './demos/radio/buttons-radio';
import { NgbdButtonsRadioreactive } from './demos/radioreactive/buttons-radioreactive';

const DEMO_DIRECTIVES = [NgbdButtonsCheckbox, NgbdButtonsCheckboxreactive, NgbdButtonsRadio, NgbdButtonsRadioreactive];

const demos = {
  checkbox: {
    title: 'Checkbox buttons',
    type: NgbdButtonsCheckbox,
    code: require('!!raw-loader!./demos/checkbox/buttons-checkbox'),
    markup: require('!!raw-loader!./demos/checkbox/buttons-checkbox.html')
  },
  checkboxreactive: {
    title: 'Checkbox buttons (Reactive Forms)',
    type: NgbdButtonsCheckboxreactive,
    code: require('!!raw-loader!./demos/checkboxreactive/buttons-checkboxreactive'),
    markup: require('!!raw-loader!./demos/checkboxreactive/buttons-checkboxreactive.html')
  },
  radio: {
    title: 'Radio buttons',
    type: NgbdButtonsRadio,
    code: require('!!raw-loader!./demos/radio/buttons-radio'),
    markup: require('!!raw-loader!./demos/radio/buttons-radio.html')
  },
  radioreactive: {
    title: 'Radio buttons (Reactive Forms)',
    type: NgbdButtonsRadioreactive,
    code: require('!!raw-loader!./demos/radioreactive/buttons-radioreactive'),
    markup: require('!!raw-loader!./demos/radioreactive/buttons-radioreactive.html')
  }
};

const apis = getApis('buttons');

const ROUTES = [
  { path: '', pathMatch: 'full', redirectTo: 'examples' },
  { path: '',
    component: ComponentWrapper,
    data: { demos, apis },
    children: [
      { path: 'examples', component: NgbdExamplesPage },
      { path: 'api', component: NgbdApiPage }
    ]
  }
]

@NgModule({
  imports: [NgbdSharedModule, NgbdComponentsSharedModule, RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
  declarations: DEMO_DIRECTIVES,
  entryComponents: DEMO_DIRECTIVES
})
export class NgbdButtonsModule {}
