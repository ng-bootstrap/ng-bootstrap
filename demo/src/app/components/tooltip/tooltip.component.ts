import {Component} from '@angular/core';
import {NgbdApiDocs} from '../shared/api-docs';

@Component({
  selector: 'ngbd-tooltip',
  template: `
    <ngbd-api-docs directive="NgbTooltip"></ngbd-api-docs>
  `,
  directives: [NgbdApiDocs]
})
export class NgbdTooltip {}
