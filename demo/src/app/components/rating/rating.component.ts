import {Component} from '@angular/core';
import {NgbdApiDocs} from '../shared/api-docs';

@Component({
  selector: 'ngbd-rating',
  template: `
    <ngbd-api-docs directive="NgbRating"></ngbd-api-docs>
  `,
  directives: [NgbdApiDocs]
})
export class NgbdRating {}
