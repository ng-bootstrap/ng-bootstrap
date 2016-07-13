import {NgbdPagerAlign} from './align/pager-align';
import {NgbdPagerBasic} from './basic/pager-basic';

export const DEMO_DIRECTIVES = [NgbdPagerAlign, NgbdPagerBasic];

export const DEMO_SNIPPETS = {
  align: {
    code: require('!!prismjs?lang=typescript!./align/pager-align'),
    markup: require('!!prismjs?lang=markup!./align/pager-align.html')},
  basic: {
    code: require('!!prismjs?lang=typescript!./basic/pager-basic'),
    markup: require('!!prismjs?lang=markup!./basic/pager-basic.html')}
};
