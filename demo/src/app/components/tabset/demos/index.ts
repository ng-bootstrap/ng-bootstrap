import {NgbdTabsetBasic} from './basic/tabset-basic';
import {NgbdTabsetPills} from './pills/tabset-pills';
import {NgbdTabsetPreventchange} from './preventchange/tabset-preventchange';
import {NgbdTabsetSelectbyid} from './selectbyid/tabset-selectbyid';

export const DEMO_DIRECTIVES = [NgbdTabsetBasic, NgbdTabsetPills, NgbdTabsetPreventchange, NgbdTabsetSelectbyid];

export const DEMO_SNIPPETS = {
  basic: {
    code: require('!!prismjs?lang=typescript!./basic/tabset-basic'),
    markup: require('!!prismjs?lang=markup!./basic/tabset-basic.html')},
  pills: {
    code: require('!!prismjs?lang=typescript!./pills/tabset-pills'),
    markup: require('!!prismjs?lang=markup!./pills/tabset-pills.html')},
  preventChange: {
    code: require('!!prismjs?lang=typescript!./preventchange/tabset-preventchange'),
    markup: require('!!prismjs?lang=markup!./preventchange/tabset-preventchange.html')},
  selectById: {
    code: require('!!prismjs?lang=typescript!./selectbyid/tabset-selectbyid'),
    markup: require('!!prismjs?lang=markup!./selectbyid/tabset-selectbyid.html')},
};
