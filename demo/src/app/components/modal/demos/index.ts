import {NgbdModalBasic} from './basic/modal-basic';
import {NgbdModalComponent, NgbdModalContent} from './component/modal-component';
import {NgbdModalCustomclass} from './customclass/modal-customclass';

export const DEMO_DIRECTIVES = [NgbdModalBasic, NgbdModalComponent, NgbdModalCustomclass];
export {NgbdModalContent} from './component/modal-component';

export const DEMO_SNIPPETS = {
  'basic': {
    'code': require('!!prismjs?lang=typescript!./basic/modal-basic'),
    'markup': require('!!prismjs?lang=markup!./basic/modal-basic.html')},
  'component': {
    'code': require('!!prismjs?lang=typescript!./component/modal-component'),
    'markup': require('!!prismjs?lang=markup!./component/modal-component.html')},
  'customclass': {
    'code': require('!!prismjs?lang=typescript!./customclass/modal-customclass'),
    'markup': require('!!prismjs?lang=markup!./customclass/modal-customclass.html')}
};
