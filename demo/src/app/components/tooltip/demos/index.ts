import {NgbdTooltipBasic} from './basic/tooltip-basic';
import {NgbdTooltipTplcontent} from './tplcontent/tooltip-tplcontent';
import {NgbdTooltipTriggers} from './triggers/tooltip-triggers';

export const DEMO_DIRECTIVES = [NgbdTooltipBasic, NgbdTooltipTplcontent, NgbdTooltipTriggers];

export const DEMO_SNIPPETS = {
  basic: {
    code: require('!!prismjs?lang=typescript!./basic/tooltip-basic'),
    markup: require('!!prismjs?lang=markup!./basic/tooltip-basic.html')},
  tplcontent: {
    code: require('!!prismjs?lang=typescript!./tplcontent/tooltip-tplcontent'),
    markup: require('!!prismjs?lang=markup!./tplcontent/tooltip-tplcontent.html')},
  triggers: {
    code: require('!!prismjs?lang=typescript!./triggers/tooltip-triggers'),
    markup: require('!!prismjs?lang=markup!./triggers/tooltip-triggers.html')}
};
