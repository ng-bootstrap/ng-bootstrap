import {Component} from '@angular/core';
import {NgbdApiDocs} from '../shared/api-docs';

@Component({
  selector: 'ngbd-dropdown',
  template: `
    <ngbd-api-docs directive="NgbDropdown"></ngbd-api-docs>
    <ngbd-api-docs directive="NgbDropdownToggle"></ngbd-api-docs>
  `,
  directives: [NgbdApiDocs]
})
export class NgbdDropdown {}
