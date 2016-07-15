import {Component} from '@angular/core';
import {ContentWrapper} from '../../shared';
import {ExampleBoxComponent, NgbdApiDocs} from '../shared';
import {DEMO_DIRECTIVES, DEMO_SNIPPETS} from './demos';

@Component({
  selector: 'ngbd-timepicker',
  template: `
    <ngbd-content-wrapper component="Timepicker">
      <ngbd-api-docs directive="NgbTimepicker"></ngbd-api-docs>
      <ngbd-example-box demoTitle="Timepicker" [htmlSnippet]="snippets.basic.markup" [tsSnippet]="snippets.basic.code">
        <ngbd-timepicker-basic></ngbd-timepicker-basic>      
      </ngbd-example-box>
    </ngbd-content-wrapper>
  `,
  directives: [ContentWrapper, NgbdApiDocs, DEMO_DIRECTIVES, ExampleBoxComponent]
})
export class NgbdTimepicker {
  snippets = DEMO_SNIPPETS;
}
