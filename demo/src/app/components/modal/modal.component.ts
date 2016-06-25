import {Component} from '@angular/core';
import {NgbdApiDocs} from '../shared/api-docs';

@Component({
  selector: 'ngbd-modal',
  template: `
    <ngbd-api-docs directive="NgbModal"></ngbd-api-docs>
  `,
  directives: [NgbdApiDocs]
})
export class NgbdModal {}
