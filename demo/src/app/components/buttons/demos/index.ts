import {NgbdButtonsCheckbox} from './checkbox/buttons-checkbox';
import {NgbdButtonsRadio} from './radio/buttons-radio';

export const DEMO_DIRECTIVES = [NgbdButtonsCheckbox, NgbdButtonsRadio];

export const DEMO_SNIPPETS = {
  checkbox: {
    code: require('!!prismjs?lang=typescript!./checkbox/buttons-checkbox'),
    markup: require('!!prismjs?lang=markup!./checkbox/buttons-checkbox.html')},
  radio: {
    code: require('!!prismjs?lang=typescript!./radio/buttons-radio'),
    markup: require('!!prismjs?lang=markup!./radio/buttons-radio.html')}
};
