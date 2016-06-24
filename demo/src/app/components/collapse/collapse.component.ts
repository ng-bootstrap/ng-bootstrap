import {Component} from '@angular/core';
import {ContentWrapper} from '../../shared';
import {NgbdApiDocs} from '../shared/api-docs';

@Component({
  selector: 'ngbd-collapse',
  template: `
    <ngbd-content-wrapper component="Collapse">
      <ngbd-api-docs directive="NgbCollapse"></ngbd-api-docs>    
    </ngbd-content-wrapper>
  `,
  directives: [ContentWrapper, NgbdApiDocs]
})
export class NgbdCollapse {}
