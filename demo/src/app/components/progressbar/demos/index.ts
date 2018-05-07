import {NgbdProgressbarBasic} from './basic/progressbar-basic';
import {NgbdProgressbarShowvalue} from './showvalue/progressbar-showvalue';
import {NgbdProgressbarStriped} from './striped/progressbar-striped';
import {NgbdProgressbarConfig} from './config/progressbar-config';
import {NgbdProgressbarLabels} from './labels/progressbar-labels';
import { NgbdProgressbarHeight } from './height/progressbar-height';

export const DEMO_DIRECTIVES = [
  NgbdProgressbarBasic,
  NgbdProgressbarShowvalue,
  NgbdProgressbarStriped,
  NgbdProgressbarConfig,
  NgbdProgressbarLabels,
  NgbdProgressbarHeight
];

export const DEMO_SNIPPETS = {
  'basic': {
    'code': require('!!raw-loader!./basic/progressbar-basic'),
    'markup': require('!!raw-loader!./basic/progressbar-basic.html')},
  'showvalue': {
    'code': require('!!raw-loader!./showvalue/progressbar-showvalue'),
    'markup': require('!!raw-loader!./showvalue/progressbar-showvalue.html')},
  'striped': {
    'code': require('!!raw-loader!./striped/progressbar-striped'),
    'markup': require('!!raw-loader!./striped/progressbar-striped.html')},
  'labels': {
    'code': require('!!raw-loader!./labels/progressbar-labels'),
    'markup': require('!!raw-loader!./labels/progressbar-labels.html')},
  'height': {
    'code': require('!!raw-loader!./height/progressbar-height'),
    'markup': require('!!raw-loader!./height/progressbar-height.html')},
  'config': {
    'code': require('!!raw-loader!./config/progressbar-config'),
    'markup': require('!!raw-loader!./config/progressbar-config.html')}
};
