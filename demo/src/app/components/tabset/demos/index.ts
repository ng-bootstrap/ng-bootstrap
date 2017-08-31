import {NgbdTabsetBasic} from './basic/tabset-basic';
import {NgbdTabsetPills} from './pills/tabset-pills';
import {NgbdTabsetPreventchange} from './preventchange/tabset-preventchange';
import {NgbdTabsetSelectbyid} from './selectbyid/tabset-selectbyid';
import {NgbdTabsetConfig} from './config/tabset-config';
import {NgbdTabsetJustify} from './justify/tabset-justify';
import {NgbdTabsetOrientation} from './orientation/tabset-orientation';

export const DEMO_DIRECTIVES = [
  NgbdTabsetBasic, NgbdTabsetPills, NgbdTabsetPreventchange, NgbdTabsetSelectbyid,
  NgbdTabsetConfig, NgbdTabsetJustify, NgbdTabsetOrientation
];

export const DEMO_SNIPPETS = {
  'basic': {
    'code': require('!!prismjs-loader?lang=typescript!./basic/tabset-basic'),
    'markup': require('!!prismjs-loader?lang=markup!./basic/tabset-basic.html')
  },
  'pills': {
    'code': require('!!prismjs-loader?lang=typescript!./pills/tabset-pills'),
    'markup': require('!!prismjs-loader?lang=markup!./pills/tabset-pills.html')
  },
  'preventchange': {
    'code': require('!!prismjs-loader?lang=typescript!./preventchange/tabset-preventchange'),
    'markup': require('!!prismjs-loader?lang=markup!./preventchange/tabset-preventchange.html')
  },
  'selectbyid': {
    'code': require('!!prismjs-loader?lang=typescript!./selectbyid/tabset-selectbyid'),
    'markup': require('!!prismjs-loader?lang=markup!./selectbyid/tabset-selectbyid.html')
  },
  'justify': {
    'code': require('!!prismjs-loader?lang=typescript!./justify/tabset-justify'),
    'markup': require('!!prismjs-loader?lang=markup!./justify/tabset-justify.html')
  },
  'orientation': {
    'code': require('!!prismjs-loader?lang=typescript!./orientation/tabset-orientation'),
    'markup': require('!!prismjs-loader?lang=markup!./orientation/tabset-orientation.html')
  },
  'config': {
    'code': require('!!prismjs-loader?lang=typescript!./config/tabset-config'),
    'markup': require('!!prismjs-loader?lang=markup!./config/tabset-config.html')
  }
};
