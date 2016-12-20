import { NgbdSelectBasic } from './basic/select-basic';
import { NgbdSelectAdvanced } from './advanced/select-advanced';

export const DEMO_DIRECTIVES = [NgbdSelectBasic, NgbdSelectAdvanced];

export const DEMO_SNIPPETS = {
  basic: {
    code: require('!!prismjs-loader?lang=typescript!./basic/select-basic'),
    markup: require('!!prismjs-loader?lang=markup!./basic/select-basic.html')},
  advanced: {
    code: require('!!prismjs-loader?lang=typescript!./advanced/select-advanced'),
    markup: require('!!prismjs-loader?lang=markup!./advanced/select-advanced.html')},
};
