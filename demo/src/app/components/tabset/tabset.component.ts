import {Component} from '@angular/core';
import {NgbdApiDocs} from '../shared/api-docs';

@Component({
  selector: 'ngbd-tabs',
  template: `
    <ngbd-api-docs directive="NgbTabset"></ngbd-api-docs>
    <ngbd-api-docs directive="NgbTab"></ngbd-api-docs>
    <ngbd-api-docs directive="NgbTabTitle"></ngbd-api-docs>
    <ngbd-api-docs directive="NgbTabContent"></ngbd-api-docs>
  `,
  directives: [NgbdApiDocs]
})
export class NgbdTabs {
}
