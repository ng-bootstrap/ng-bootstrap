import {NgbdTooltipAutoclose} from './autoclose/tooltip-autoclose';
import {NgbdTooltipBasic} from './basic/tooltip-basic';
import {NgbdTooltipContainer} from './container/tooltip-container';
import {NgbdTooltipTplcontent} from './tplcontent/tooltip-tplcontent';
import {NgbdTooltipTplwithcontext} from './tplwithcontext/tooltip-tplwithcontext';
import {NgbdTooltipTriggers} from './triggers/tooltip-triggers';
import {NgbdTooltipConfig} from './config/tooltip-config';

export const DEMO_DIRECTIVES = [
  NgbdTooltipAutoclose,
  NgbdTooltipBasic,
  NgbdTooltipContainer,
  NgbdTooltipTplcontent,
  NgbdTooltipTriggers,
  NgbdTooltipConfig,
  NgbdTooltipTplwithcontext
];

export const DEMO_SNIPPETS = {
  'basic': {
    'code': require('!!raw-loader!./basic/tooltip-basic'),
    'markup': require('!!raw-loader!./basic/tooltip-basic.html')
  },
  'container': {
    'code': require('!!raw-loader!./container/tooltip-container'),
    'markup': require('!!raw-loader!./container/tooltip-container.html')
  },
  'tplcontent': {
    'code': require('!!raw-loader!./tplcontent/tooltip-tplcontent'),
    'markup': require('!!raw-loader!./tplcontent/tooltip-tplcontent.html')
  },
  'triggers': {
    'code': require('!!raw-loader!./triggers/tooltip-triggers'),
    'markup': require('!!raw-loader!./triggers/tooltip-triggers.html')
  },
  'autoclose': {
    'code': require('!!raw-loader!./autoclose/tooltip-autoclose'),
    'markup': require('!!raw-loader!./autoclose/tooltip-autoclose.html')
  },
  'tplwithcontext': {
    'code': require('!!raw-loader!./tplwithcontext/tooltip-tplwithcontext'),
    'markup': require('!!raw-loader!./tplwithcontext/tooltip-tplwithcontext.html')
  },
  'config': {
    'code': require('!!raw-loader!./config/tooltip-config'),
    'markup': require('!!raw-loader!./config/tooltip-config.html')
  }
};
