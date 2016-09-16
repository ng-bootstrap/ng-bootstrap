import {Component} from '@angular/core';
import {DEMO_SNIPPETS} from './demos';

@Component({
  selector: 'ngbd-datepicker',
  template: `
    <ngbd-content-wrapper component="Datepicker">
      <ngbd-api-docs directive="NgbDatepicker"></ngbd-api-docs>
      <ngbd-api-docs directive="NgbInputDatepicker"></ngbd-api-docs>
      <ngbd-api-docs-class type="NgbDateStruct"></ngbd-api-docs-class>
      <ngbd-api-docs-class type="DayTemplateContext"></ngbd-api-docs-class>
      <ngbd-api-docs-class type="NgbDatepickerI18n"></ngbd-api-docs-class>
      <ngbd-api-docs-config type="NgbDatepickerConfig"></ngbd-api-docs-config>
      <ngbd-example-box demoTitle="Basic datepicker" [htmlSnippet]="snippets.basic.markup" [tsSnippet]="snippets.basic.code">
        <ngbd-datepicker-basic></ngbd-datepicker-basic>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Datepicker in a popup" [htmlSnippet]="snippets.popup.markup" [tsSnippet]="snippets.popup.code">
        <ngbd-datepicker-popup></ngbd-datepicker-popup>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Disabled datepicker" [htmlSnippet]="snippets.disabled.markup" [tsSnippet]="snippets.disabled.code">
        <ngbd-datepicker-disabled></ngbd-datepicker-disabled>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Internationalization of datepickers" 
                        [htmlSnippet]="snippets.i18n.markup" 
                        [tsSnippet]="snippets.i18n.code">
        <ngbd-datepicker-i18n></ngbd-datepicker-i18n>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Global configuration of datepickers" 
                        [htmlSnippet]="snippets.config.markup" 
                        [tsSnippet]="snippets.config.code">
        <ngbd-datepicker-config></ngbd-datepicker-config>
      </ngbd-example-box>
    </ngbd-content-wrapper>
  `
})
export class NgbdDatepicker {
   snippets = DEMO_SNIPPETS;
}
