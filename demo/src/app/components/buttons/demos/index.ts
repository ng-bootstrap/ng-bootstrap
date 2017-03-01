import {NgbdButtonsCheckbox} from './checkbox/buttons-checkbox';
import {NgbdButtonsRadio} from './radio/buttons-radio';
import {NgbdButtonsVertical} from './vertical/buttons-vertical';

export const DEMO_DIRECTIVES = [NgbdButtonsCheckbox, NgbdButtonsRadio, NgbdButtonsVertical];

export const DEMO_SNIPPETS = {
  checkbox: {
    code: require('!!prismjs-loader?lang=typescript!./checkbox/buttons-checkbox'),
    markup: require('!!prismjs-loader?lang=markup!./checkbox/buttons-checkbox.html')},
  radio: {
    code: require('!!prismjs-loader?lang=typescript!./radio/buttons-radio'),
    markup: require('!!prismjs-loader?lang=markup!./radio/buttons-radio.html')},
  vertical: {
    code: require('!!prismjs-loader?lang=typescript!./vertical/buttons-vertical'),
    markup: require('!!prismjs-loader?lang=markup!./vertical/buttons-vertical.html')}
};
