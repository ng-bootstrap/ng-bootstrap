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
      <ngbd-example-box demoTitle="Meridian" [htmlSnippet]="snippets.meridian.markup" [tsSnippet]="snippets.meridian.code">
        <ngbd-timepicker-meridian></ngbd-timepicker-meridian>      
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Seconds" [htmlSnippet]="snippets.seconds.markup" [tsSnippet]="snippets.seconds.code">
        <ngbd-timepicker-seconds></ngbd-timepicker-seconds>      
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Custom steps" [htmlSnippet]="snippets.steps.markup" [tsSnippet]="snippets.steps.code">
        <ngbd-timepicker-steps></ngbd-timepicker-steps>      
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Custom validation" [htmlSnippet]="snippets.validation.markup" [tsSnippet]="snippets.validation.code">
        <ngbd-timepicker-validation></ngbd-timepicker-validation>      
      </ngbd-example-box>      
    </ngbd-content-wrapper>
  `,
  directives: [ContentWrapper, NgbdApiDocs, DEMO_DIRECTIVES, ExampleBoxComponent]
})
export class NgbdTimepicker {
  snippets = DEMO_SNIPPETS;
}
