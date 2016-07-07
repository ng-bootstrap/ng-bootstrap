import {Component} from '@angular/core';
import {ContentWrapper} from '../../shared';
import {ExampleBoxComponent, NgbdApiDocs} from '../shared';
import {DEMO_DIRECTIVES, DEMO_SNIPPETS} from './demos';

@Component({
  selector: 'ngbd-accordion',
  template: `
    <ngbd-content-wrapper component="Accordion">
      <ngbd-api-docs directive="NgbAccordion"></ngbd-api-docs>
      <ngbd-api-docs directive="NgbPanel"></ngbd-api-docs>
      <ngbd-example-box demoTitle="Accordion" [htmlSnippet]="snippets.basic.markup" [tsSnippet]="snippets.basic.code">
        <ngbd-accordion-basic></ngbd-accordion-basic>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="One open panel at a time" [htmlSnippet]="snippets.static.markup" [tsSnippet]="snippets.static.code">
        <ngbd-accordion-static></ngbd-accordion-static>
      </ngbd-example-box>
    </ngbd-content-wrapper>
  `,
  directives: [ContentWrapper, NgbdApiDocs, DEMO_DIRECTIVES, ExampleBoxComponent]
})
export class NgbdAccordion {
   snippets = DEMO_SNIPPETS;
}
