import {NgbdModalBasic} from './basic/modal-basic';
import {NgbdModalCustomClass} from './customclass/modal-customclass';

export const DEMO_DIRECTIVES = [NgbdModalBasic, NgbdModalCustomClass];

export const DEMO_SNIPPETS = {
  basic: {
    code: require('!!prismjs?lang=typescript!./basic/modal-basic'),
    markup: require('!!prismjs?lang=markup!./basic/modal-basic.html')
  },
  customclass: {
    code: require('!!prismjs?lang=typescript!./customclass/modal-customclass'),
    markup: require('!!prismjs?lang=markup!./customclass/modal-customclass.html')
  }
};

