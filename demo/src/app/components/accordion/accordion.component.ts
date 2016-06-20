import { Component } from '@angular/core';

import { ComponentDocsComponent, ExampleBoxComponent } from '../shared';
import { AccordionBasicComponent, basicHtmlContent, basicTsContent } from './demos';

const docs = require('../../../docs.json');

@Component({
  selector: 'ngbd-accordion',
  template: require('./accordion.component.html'),
  directives: [AccordionBasicComponent, ComponentDocsComponent, ExampleBoxComponent]
})
export class AccordionComponent {
  accordionDocs = docs.NgbAccordion;
  panelDocs = docs.NgbPanel;
  basicHtmlContent = basicHtmlContent;
  basicTsContent = basicTsContent;
}
