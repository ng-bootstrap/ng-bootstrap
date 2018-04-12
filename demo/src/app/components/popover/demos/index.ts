import {NgbdPopoverBasic} from './basic/popover-basic';
import {NgbdPopoverTplcontent} from './tplcontent/popover-tplcontent';
import {NgbdPopoverTplwithcontext} from './tplwithcontext/popover-tplwithcontext';
import {NgbdPopoverTriggers} from './triggers/popover-triggers';
import {NgbdPopoverVisibility} from './visibility/popover-visibility';
import {NgbdPopoverContainer} from './container/popover-container';
import {NgbdPopoverCustomClass} from './custom-class/popover-custom-class';
import {NgbdPopoverConfig} from './config/popover-config';

export const DEMO_DIRECTIVES = [
  NgbdPopoverBasic,
  NgbdPopoverTplcontent,
  NgbdPopoverTplwithcontext,
  NgbdPopoverTriggers,
  NgbdPopoverVisibility,
  NgbdPopoverContainer,
  NgbdPopoverCustomClass,
  NgbdPopoverConfig
];

export const DEMO_SNIPPETS = {
  'basic': {
    'code': require('!!raw-loader!./basic/popover-basic'),
    'markup': require('!!raw-loader!./basic/popover-basic.html')
  },
  'tplcontent': {
    'code': require('!!raw-loader!./tplcontent/popover-tplcontent'),
    'markup': require('!!raw-loader!./tplcontent/popover-tplcontent.html')
  },
  'triggers': {
    'code': require('!!raw-loader!./triggers/popover-triggers'),
    'markup': require('!!raw-loader!./triggers/popover-triggers.html')
  },
  'tplwithcontext': {
    'code': require('!!raw-loader!./tplwithcontext/popover-tplwithcontext'),
    'markup': require('!!raw-loader!./tplwithcontext/popover-tplwithcontext.html')
  },
  'visibility': {
    'code': require('!!raw-loader!./visibility/popover-visibility'),
    'markup': require('!!raw-loader!./visibility/popover-visibility.html')
  },
  'container': {
    'code': require('!!raw-loader!./container/popover-container'),
    'markup': require('!!raw-loader!./container/popover-container.html')
  },
  'custom-class': {
    'code': require('!!raw-loader!./custom-class/popover-custom-class'),
    'markup': require('!!raw-loader!./custom-class/popover-custom-class.html')
  },
  'config': {
    'code': require('!!raw-loader!./config/popover-config'),
    'markup': require('!!raw-loader!./config/popover-config.html')
  }
};
