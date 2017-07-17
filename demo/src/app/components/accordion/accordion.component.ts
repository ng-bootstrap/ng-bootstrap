import {Component} from '@angular/core';
import {DEMO_SNIPPETS} from './demos';

@Component({
  selector: 'ngbd-accordion',
  template: `
    <ngbd-component-wrapper component="Accordion">
      <ngbd-api-docs directive="NgbAccordion"></ngbd-api-docs>
      <ngbd-api-docs directive="NgbPanel"></ngbd-api-docs>
      <ngbd-api-docs directive="NgbPanelTitle"></ngbd-api-docs>
      <ngbd-api-docs directive="NgbPanelContent"></ngbd-api-docs>
      <ngbd-api-docs-class type="NgbPanelChangeEvent"></ngbd-api-docs-class>
      <ngbd-api-docs-config type="NgbAccordionConfig"></ngbd-api-docs-config>
      <ngbd-example-box demoTitle="Accordion" [snippets]="snippets" component="accordion" demo="basic">
        <ngbd-accordion-basic></ngbd-accordion-basic>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="One open panel at a time" [snippets]="snippets" component="accordion" demo="static">
        <ngbd-accordion-static></ngbd-accordion-static>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Toggle panels" [snippets]="snippets" component="accordion" demo="toggle">
        <ngbd-accordion-toggle></ngbd-accordion-toggle>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Prevent panel toggle" [snippets]="snippets" component="accordion" demo="preventchange">
        <ngbd-accordion-preventchange></ngbd-accordion-preventchange>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Global configuration of accordions" [snippets]="snippets" component="accordion" demo="config">
        <ngbd-accordion-config></ngbd-accordion-config>
      </ngbd-example-box>
    </ngbd-component-wrapper>
  `
})
export class NgbdAccordion {
  snippets = DEMO_SNIPPETS;
}
