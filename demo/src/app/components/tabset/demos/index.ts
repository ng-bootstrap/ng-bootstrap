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
    'code': require('!!raw-loader!./basic/tabset-basic'),
    'markup': require('!!raw-loader!./basic/tabset-basic.html')
  },
  'pills': {
    'code': require('!!raw-loader!./pills/tabset-pills'),
    'markup': require('!!raw-loader!./pills/tabset-pills.html')
  },
  'preventchange': {
    'code': require('!!raw-loader!./preventchange/tabset-preventchange'),
    'markup': require('!!raw-loader!./preventchange/tabset-preventchange.html')
  },
  'selectbyid': {
    'code': require('!!raw-loader!./selectbyid/tabset-selectbyid'),
    'markup': require('!!raw-loader!./selectbyid/tabset-selectbyid.html')
  },
  'justify': {
    'code': require('!!raw-loader!./justify/tabset-justify'),
    'markup': require('!!raw-loader!./justify/tabset-justify.html')
  },
  'orientation': {
    'code': require('!!raw-loader!./orientation/tabset-orientation'),
    'markup': require('!!raw-loader!./orientation/tabset-orientation.html')
  },
  'config': {
    'code': require('!!raw-loader!./config/tabset-config'),
    'markup': require('!!raw-loader!./config/tabset-config.html')
  }
};
