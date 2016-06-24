import {Component} from '@angular/core';
import {ContentWrapper} from '../../shared';
import {NgbdApiDocs} from '../shared/api-docs';

@Component({
  selector: 'ngbd-progressbar',
  template: `
    <ngbd-content-wrapper component="Progressbar">
      <ngbd-api-docs directive="NgbProgressbar"></ngbd-api-docs>
    </ngbd-content-wrapper>
  `,
  directives: [ContentWrapper, NgbdApiDocs]
})
export class NgbdProgressbar {}
