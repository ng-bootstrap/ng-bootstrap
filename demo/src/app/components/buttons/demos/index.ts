import {NgbdButtonsCheckbox} from './checkbox/buttons-checkbox';
import {NgbdButtonsCheckboxReactive} from './checkbox-reactive/buttons-checkbox-reactive';
import {NgbdButtonsRadio} from './radio/buttons-radio';
import {NgbdButtonsRadioReactive} from './radio-reactive/buttons-radio-reactive';

export const DEMO_DIRECTIVES = [NgbdButtonsCheckbox, NgbdButtonsCheckboxReactive, NgbdButtonsRadio, NgbdButtonsRadioReactive];

export const DEMO_SNIPPETS = {
  checkbox: {
    code: require('!!prismjs-loader?lang=typescript!./checkbox/buttons-checkbox'),
    markup: require('!!prismjs-loader?lang=markup!./checkbox/buttons-checkbox.html')},
  checkboxReactive: {
    code: require('!!prismjs-loader?lang=typescript!./checkbox-reactive/buttons-checkbox-reactive'),
    markup: require('!!prismjs-loader?lang=markup!./checkbox-reactive/buttons-checkbox-reactive.html')},
  radio: {
    code: require('!!prismjs-loader?lang=typescript!./radio/buttons-radio'),
    markup: require('!!prismjs-loader?lang=markup!./radio/buttons-radio.html')},
  radioReactive: {
    code: require('!!prismjs-loader?lang=typescript!./radio-reactive/buttons-radio-reactive'),
    markup: require('!!prismjs-loader?lang=markup!./radio-reactive/buttons-radio-reactive.html')}
};
