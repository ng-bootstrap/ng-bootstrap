import {NgbdTooltipBasic} from './basic/tooltip-basic';
import {NgbdTooltipTplcontent} from './tplcontent/tooltip-tplcontent';
import {NgbdTooltipTriggers} from './triggers/tooltip-triggers';
import {NgbdTooltipConfig} from './config/tooltip-config';

export const DEMO_DIRECTIVES = [NgbdTooltipBasic, NgbdTooltipTplcontent, NgbdTooltipTriggers, NgbdTooltipConfig];

export const DEMO_SNIPPETS = {
  basic: {
    code: require('!!prismjs?lang=typescript!./basic/tooltip-basic'),
    markup: require('!!prismjs?lang=markup!./basic/tooltip-basic.html')
  },
  tplcontent: {
    code: require('!!prismjs?lang=typescript!./tplcontent/tooltip-tplcontent'),
    markup: require('!!prismjs?lang=markup!./tplcontent/tooltip-tplcontent.html')
  },
  triggers: {
    code: require('!!prismjs?lang=typescript!./triggers/tooltip-triggers'),
    markup: require('!!prismjs?lang=markup!./triggers/tooltip-triggers.html')
  },
  config: {
    code: require('!!prismjs?lang=typescript!./config/tooltip-config'),
    markup: require('!!prismjs?lang=markup!./config/tooltip-config.html')
  }
};
