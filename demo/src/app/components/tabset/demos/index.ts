import {NgbdTabsetBasic} from './basic/tabset-basic';
import {NgbdTabsetPills} from './pills/tabset-pills';
import {NgbdTabsetPreventChange} from './preventChange/tabset-preventChange';
import {NgbdTabsetSelectById} from './selectById/tabset-selectById';
  
export const DEMO_DIRECTIVES = [NgbdTabsetBasic, NgbdTabsetPills, NgbdTabsetPreventChange, NgbdTabsetSelectById];

export const DEMO_SNIPPETS = {
  "basic": {
    "code": require('!!prismjs?lang=typescript!./basic/tabset-basic'),
    "markup": require('!!prismjs?lang=markup!./basic/tabset-basic.html')},
  "pills": {
    "code": require('!!prismjs?lang=typescript!./pills/tabset-pills'),
    "markup": require('!!prismjs?lang=markup!./pills/tabset-pills.html')},
  "preventChange": {
    "code": require('!!prismjs?lang=typescript!./preventChange/tabset-preventChange'),
    "markup": require('!!prismjs?lang=markup!./preventChange/tabset-preventChange.html')},
  "selectById": {
    "code": require('!!prismjs?lang=typescript!./selectById/tabset-selectById'),
    "markup": require('!!prismjs?lang=markup!./selectById/tabset-selectById.html')},
};
