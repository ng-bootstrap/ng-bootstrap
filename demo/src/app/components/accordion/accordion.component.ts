import { Component } from '@angular/core';

import { ExampleBoxComponent, NgbdApiDocs} from '../shared';
import { AccordionBasicComponent, basicHtmlContent, basicTsContent } from './demos';

@Component({
  selector: 'ngbd-accordion',
  template: `
    <ngbd-api-docs directive="NgbAccordion"></ngbd-api-docs> 
    <ngbd-api-docs directive="NgbPanel"></ngbd-api-docs> 
    <ngbd-example-box demoTitle="Basic demo" [htmlSnippet]="basicHtmlContent" [tsSnippet]="basicTsContent">
      <ngbd-accordion-basic></ngbd-accordion-basic>
    </ngbd-example-box>
  `,
  directives: [AccordionBasicComponent, NgbdApiDocs, ExampleBoxComponent]
})
export class NgbdAccordion {
  basicHtmlContent = basicHtmlContent;
  basicTsContent = basicTsContent;
}
