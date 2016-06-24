import {Component} from '@angular/core';
import {NgbdApiDocs} from '../shared/api-docs';

@Component({
  selector: 'ngbd-buttons',
  template: `
    <ngbd-api-docs directive="NgbRadioGroup"></ngbd-api-docs>
    <ngbd-api-docs directive="NgbRadio"></ngbd-api-docs>
  `,
  directives: [NgbdApiDocs]
})
export class NgbdButtons {
}
