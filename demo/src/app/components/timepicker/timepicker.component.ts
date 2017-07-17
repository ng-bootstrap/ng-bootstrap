import {Component} from '@angular/core';
import {DEMO_SNIPPETS} from './demos';

@Component({
  selector: 'ngbd-timepicker',
  template: `
    <ngbd-component-wrapper component="Timepicker">
      <ngbd-api-docs directive="NgbTimepicker"></ngbd-api-docs>
      <ngbd-api-docs-class type="NgbTimeStruct"></ngbd-api-docs-class>
      <ngbd-api-docs-config type="NgbTimepickerConfig"></ngbd-api-docs-config>
      <ngbd-example-box demoTitle="Timepicker" [snippets]="snippets" component="timepicker" demo="basic">
        <ngbd-timepicker-basic></ngbd-timepicker-basic>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Meridian" [snippets]="snippets" component="timepicker" demo="meridian">
        <ngbd-timepicker-meridian></ngbd-timepicker-meridian>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Seconds" [snippets]="snippets" component="timepicker" demo="seconds">
        <ngbd-timepicker-seconds></ngbd-timepicker-seconds>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Spinners" [snippets]="snippets" component="timepicker" demo="spinners">
        <ngbd-timepicker-spinners></ngbd-timepicker-spinners>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Custom steps" [snippets]="snippets" component="timepicker" demo="steps">
        <ngbd-timepicker-steps></ngbd-timepicker-steps>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Custom validation" [snippets]="snippets" component="timepicker" demo="validation">
        <ngbd-timepicker-validation></ngbd-timepicker-validation>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Global configuration of timepickers" [snippets]="snippets" component="timepicker" demo="config">
        <ngbd-timepicker-config></ngbd-timepicker-config>
      </ngbd-example-box>
    </ngbd-component-wrapper>
  `
})
export class NgbdTimepicker {
  snippets = DEMO_SNIPPETS;
}
