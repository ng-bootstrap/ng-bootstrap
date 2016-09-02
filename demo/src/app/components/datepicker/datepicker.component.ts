import {Component} from '@angular/core';
import {DEMO_SNIPPETS} from './demos';

@Component({
  selector: 'ngbd-datepicker',
  template: `
    <ngbd-content-wrapper component="Datepicker">
      <ngbd-api-docs directive="NgbDatepicker"></ngbd-api-docs>
      <ngbd-api-docs-class type="DayTemplateContext"></ngbd-api-docs-class>
      <ngbd-example-box demoTitle="Basic datepicker" [htmlSnippet]="snippets.basic.markup" [tsSnippet]="snippets.basic.code">
        <ngbd-datepicker-basic></ngbd-datepicker-basic>
      </ngbd-example-box>
    </ngbd-content-wrapper>
  `
})
export class NgbdDatepicker {
   snippets = DEMO_SNIPPETS;
}
