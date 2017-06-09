import {NgbdTabsetBasic} from './basic/tabset-basic';
import {NgbdTabsetPills} from './pills/tabset-pills';
import {NgbdTabsetPreventchange} from './preventchange/tabset-preventchange';
import {NgbdTabsetSelectbyid} from './selectbyid/tabset-selectbyid';
import {NgbdTabsetConfig} from './config/tabset-config';

export const DEMO_DIRECTIVES =
    [NgbdTabsetBasic, NgbdTabsetPills, NgbdTabsetPreventchange, NgbdTabsetSelectbyid, NgbdTabsetConfig];

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
  'config': {
    'code': require('!!prismjs-loader?lang=typescript!./config/tabset-config'),
    'markup': require('!!prismjs-loader?lang=markup!./config/tabset-config.html')
  }
};
