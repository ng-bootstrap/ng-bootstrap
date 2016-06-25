import {Component} from '@angular/core';
import {NgbdApiDocs} from '../shared/api-docs';

@Component({
  selector: 'ngbd-progressbar',
  template: `
    <ngbd-api-docs directive="NgbProgressbar"></ngbd-api-docs>
  `,
  directives: [NgbdApiDocs]
})
export class NgbdProgressbar {}
