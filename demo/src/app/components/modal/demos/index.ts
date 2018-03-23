import {NgbdModalBasic} from './basic/modal-basic';
import {NgbdModalComponent, NgbdModalContent} from './component/modal-component';
import {NgbdModalCustomclass} from './customclass/modal-customclass';
import {NgbdModalDraggable} from './draggable/modal-draggable';

export const DEMO_DIRECTIVES = [NgbdModalBasic, NgbdModalComponent, NgbdModalCustomclass, NgbdModalDraggable];
export {NgbdModalContent} from './component/modal-component';

export const DEMO_SNIPPETS = {
  'basic': {
    'code': require('!!prismjs-loader?lang=typescript!./basic/modal-basic'),
    'markup': require('!!prismjs-loader?lang=markup!./basic/modal-basic.html')},
  'component': {
    'code': require('!!prismjs-loader?lang=typescript!./component/modal-component'),
    'markup': require('!!prismjs-loader?lang=markup!./component/modal-component.html')},
  'customclass': {
    'code': require('!!prismjs-loader?lang=typescript!./customclass/modal-customclass'),
    'markup': require('!!prismjs-loader?lang=markup!./customclass/modal-customclass.html')},
  'draggable': {
    'code': require('!!prismjs-loader?lang=typescript!./draggable/modal-draggable'),
    'markup': require('!!prismjs-loader?lang=markup!./draggable/modal-draggable.html')}
};
