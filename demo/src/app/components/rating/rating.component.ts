import {Component} from '@angular/core';
import {ContentWrapper} from '../../shared';
import {NgbdApiDocs} from '../shared/api-docs';

@Component({
  selector: 'ngbd-rating',
  template: `
    <ngbd-content-wrapper component="Rating">
      <ngbd-api-docs directive="NgbRating"></ngbd-api-docs>
    </ngbd-content-wrapper>
  `,
  directives: [ContentWrapper, NgbdApiDocs]
})
export class NgbdRating {}
