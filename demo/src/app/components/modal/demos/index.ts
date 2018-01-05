import {NgbdModalBasic} from './basic/modal-basic';
import {NgbdModalComponent, NgbdModalContent} from './component/modal-component';
import {NgbdModalOptions} from './options/modal-options';

export const DEMO_DIRECTIVES = [NgbdModalBasic, NgbdModalComponent, NgbdModalOptions];
export {NgbdModalContent} from './component/modal-component';

export const DEMO_SNIPPETS = {
  'basic': {
    'code': require('!!prismjs-loader?lang=typescript!./basic/modal-basic'),
    'markup': require('!!prismjs-loader?lang=markup!./basic/modal-basic.html')},
  'component': {
    'code': require('!!prismjs-loader?lang=typescript!./component/modal-component'),
    'markup': require('!!prismjs-loader?lang=markup!./component/modal-component.html')},
  'options': {
    'code': require('!!prismjs-loader?lang=typescript!./options/modal-options'),
    'markup': require('!!prismjs-loader?lang=markup!./options/modal-options.html')}
};
