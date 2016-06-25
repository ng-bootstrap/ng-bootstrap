import {Component} from '@angular/core';
import {NgbdApiDocs} from '../shared/api-docs';

@Component({
  selector: 'ngbd-popover',
  template: `
    <ngbd-api-docs directive="NgbPopover"></ngbd-api-docs>
  `,
  directives: [NgbdApiDocs]
})
export class NgbdPopover {}
