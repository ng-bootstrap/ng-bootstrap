import {Component} from '@angular/core';
import {NgbdApiDocs} from '../shared/api-docs';

@Component({
  selector: 'ngbd-pager',
  template: `
    <ngbd-api-docs directive="NgbPager"></ngbd-api-docs>
  `,
  directives: [NgbdApiDocs]
})
export class NgbdPager {}
