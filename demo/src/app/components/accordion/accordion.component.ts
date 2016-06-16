import { Component } from '@angular/core';

import { ComponentDocsComponent, ExampleBoxComponent } from '../shared';
import { AccordionBasicComponent, basicHtmlContent, basicTsContent } from './demos';

const accordionDocs = require('./demos/ngb-accordion.json');
const panelDocs = require('./demos/ngb-panel.json');

@Component({
  selector: 'ngbd-accordion',
  template: require('./accordion.component.html'),
  directives: [AccordionBasicComponent, ComponentDocsComponent, ExampleBoxComponent]
})
export class AccordionComponent {
  accordionDocs = accordionDocs;
  panelDocs = panelDocs;
  basicHtmlContent = basicHtmlContent;
  basicTsContent = basicTsContent;
}
