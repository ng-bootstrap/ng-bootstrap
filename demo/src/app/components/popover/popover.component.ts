import {Component} from '@angular/core';
import {NgbdApiDocs} from '../shared/api-docs';
import {ContentWrapper} from '../../shared';

@Component({
  selector: 'ngbd-popover',
  template: `
    <ngbd-content-wrapper component="Popover">
      <ngbd-api-docs directive="NgbPopover"></ngbd-api-docs>
    </ngbd-content-wrapper>
  `,
  directives: [NgbdApiDocs, ContentWrapper]
})
export class NgbdPopover {}
