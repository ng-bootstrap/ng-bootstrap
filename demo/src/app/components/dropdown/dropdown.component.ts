import {Component} from '@angular/core';
import {ContentWrapper} from '../../shared';
import {NgbdApiDocs} from '../shared/api-docs';

@Component({
  selector: 'ngbd-dropdown',
  template: `
    <ngbd-content-wrapper component="Dropdown">
      <ngbd-api-docs directive="NgbDropdown"></ngbd-api-docs>
      <ngbd-api-docs directive="NgbDropdownToggle"></ngbd-api-docs>
    </ngbd-content-wrapper>
  `,
  directives: [ContentWrapper, NgbdApiDocs]
})
export class NgbdDropdown {}
