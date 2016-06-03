import {Component} from '@angular/core';
import {ContentWrapper} from '../../shared';
import {NgbdApiDocs} from '../shared/api-docs';

@Component({
  selector: 'ngbd-tooltip',
  template: `
    <ngbd-content-wrapper component="Tooltip">
      <ngbd-api-docs directive="NgbTooltip"></ngbd-api-docs>
    </ngbd-content-wrapper>  
  `,
  directives: [ContentWrapper, NgbdApiDocs]
})
export class NgbdTooltip {}
