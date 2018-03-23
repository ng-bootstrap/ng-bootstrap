import {NgbdButtonsCheckbox} from './checkbox/buttons-checkbox';
import {NgbdButtonsCheckboxreactive} from './checkboxreactive/buttons-checkboxreactive';
import {NgbdButtonsRadio} from './radio/buttons-radio';
import {NgbdButtonsRadioreactive} from './radioreactive/buttons-radioreactive';

export const DEMO_DIRECTIVES = [NgbdButtonsCheckbox, NgbdButtonsCheckboxreactive, NgbdButtonsRadio, NgbdButtonsRadioreactive];

export const DEMO_SNIPPETS = {
  'checkbox': {
    'code': require('!!raw-loader!./checkbox/buttons-checkbox'),
    'markup': require('!!raw-loader!./checkbox/buttons-checkbox.html')},
  'checkboxreactive': {
    'code': require('!!raw-loader!./checkboxreactive/buttons-checkboxreactive'),
      'markup': require('!!raw-loader!./checkboxreactive/buttons-checkboxreactive.html')},
  'radio': {
    'code': require('!!raw-loader!./radio/buttons-radio'),
    'markup': require('!!raw-loader!./radio/buttons-radio.html')},
  'radioreactive': {
    'code': require('!!raw-loader!./radioreactive/buttons-radioreactive'),
    'markup': require('!!raw-loader!./radioreactive/buttons-radioreactive.html')}
};
