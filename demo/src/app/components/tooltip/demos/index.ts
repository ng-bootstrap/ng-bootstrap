import {NgbdTooltipBasic} from './basic/tooltip-basic';
import {NgbdTooltipContainer} from './container/tooltip-container';
import {NgbdTooltipTplcontent} from './tplcontent/tooltip-tplcontent';
import {NgbdTooltipTplwithcontext} from './tplwithcontext/tooltip-tplwithcontext';
import {NgbdTooltipTriggers} from './triggers/tooltip-triggers';
import {NgbdTooltipConfig} from './config/tooltip-config';
import {NgbdTooltipAuto} from './auto/tooltip-auto';

export const DEMO_DIRECTIVES = [
  NgbdTooltipBasic,
  NgbdTooltipContainer,
  NgbdTooltipTplcontent,
  NgbdTooltipTriggers,
  NgbdTooltipConfig,
  NgbdTooltipAuto,
  NgbdTooltipTplwithcontext
];

export const DEMO_SNIPPETS = {
  'basic': {
    'code': require('!!prismjs-loader?lang=typescript!./basic/tooltip-basic'),
    'markup': require('!!prismjs-loader?lang=markup!./basic/tooltip-basic.html')
  },
  'container': {
    'code': require('!!prismjs-loader?lang=typescript!./container/tooltip-container'),
    'markup': require('!!prismjs-loader?lang=markup!./container/tooltip-container.html')
  },
  'tplcontent': {
    'code': require('!!prismjs-loader?lang=typescript!./tplcontent/tooltip-tplcontent'),
    'markup': require('!!prismjs-loader?lang=markup!./tplcontent/tooltip-tplcontent.html')
  },
  'triggers': {
    'code': require('!!prismjs-loader?lang=typescript!./triggers/tooltip-triggers'),
    'markup': require('!!prismjs-loader?lang=markup!./triggers/tooltip-triggers.html')
  },
  'tplwithcontext': {
    'code': require('!!prismjs-loader?lang=typescript!./tplwithcontext/tooltip-tplwithcontext'),
    'markup': require('!!prismjs-loader?lang=markup!./tplwithcontext/tooltip-tplwithcontext.html')
  },
  'config': {
    'code': require('!!prismjs-loader?lang=typescript!./config/tooltip-config'),
    'markup': require('!!prismjs-loader?lang=markup!./config/tooltip-config.html')
  },
  'auto': {
    'code': require('!!prismjs-loader?lang=typescript!./auto/tooltip-auto'),
    'markup': require('!!prismjs-loader?lang=markup!./auto/tooltip-auto.html')
  }
};
