import {Component} from '@angular/core';
import {ContentWrapper} from '../../shared';
import {NgbdApiDocs} from '../shared/api-docs';

@Component({
  selector: 'ngbd-pager',
  template: `
    <ngbd-content-wrapper component="Pager">
      <ngbd-api-docs directive="NgbPager"></ngbd-api-docs>
    </ngbd-content-wrapper>
  `,
  directives: [ContentWrapper, NgbdApiDocs]
})
export class NgbdPager {}
