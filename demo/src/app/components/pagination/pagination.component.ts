import {Component} from '@angular/core';
import {NgbdApiDocs} from '../shared/api-docs';

@Component({
  selector: 'ngbd-pagination',
  template: `
    <ngbd-api-docs directive="NgbPagination"></ngbd-api-docs>
  `,
  directives: [NgbdApiDocs]
})
export class NgbdPagination {}
