import {Component} from '@angular/core';
import {ContentWrapper} from '../../shared';
import {NgbdApiDocs} from '../shared/api-docs';

@Component({
  selector: 'ngbd-tabs',
  template: `
    <ngbd-content-wrapper component="Tabs">
      <ngbd-api-docs directive="NgbTabset"></ngbd-api-docs>
      <ngbd-api-docs directive="NgbTab"></ngbd-api-docs>
      <ngbd-api-docs directive="NgbTabTitle"></ngbd-api-docs>
      <ngbd-api-docs directive="NgbTabContent"></ngbd-api-docs>
    </ngbd-content-wrapper>
  `,
  directives: [ContentWrapper, NgbdApiDocs]
})
export class NgbdTabs {
}
