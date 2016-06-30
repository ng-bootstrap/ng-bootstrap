import {Component} from '@angular/core';
import {ContentWrapper} from '../../shared';
import {ExampleBoxComponent, NgbdApiDocs} from '../shared';
import {NgbdButtonsCheckbox, checkboxHtmlContent, checkboxTsContent} from './demos';
import {NgbdButtonsRadio, radioHtmlContent, radioTsContent} from './demos';

@Component({
  selector: 'ngbd-buttons',
  template: require('./buttons.component.html'),
  directives: [ContentWrapper, ExampleBoxComponent, NgbdApiDocs, NgbdButtonsCheckbox, NgbdButtonsRadio]
})
export class NgbdButtons {
  checkboxHtmlContent = checkboxHtmlContent;
  checkboxTsContent = checkboxTsContent;
  radioHtmlContent = radioHtmlContent;
  radioTsContent = radioTsContent;
}
