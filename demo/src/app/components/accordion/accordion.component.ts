import { Component } from '@angular/core';

import { NgbTabContent, NgbTab, NgbTabset } from '../../../../../src/tabset/tabset';
import { InstructionsItemComponent } from '../shared';
import { AccordionBasicComponent, basicHtmlContent, basicTsContent } from './demos';

const accordionDocs = require('./demos/ngb-accordion.json');
const panelDocs = require('./demos/ngb-panel.json');

@Component({
  selector: 'ngbd-accordion',
  template: require('./accordion.component.html'),
  directives: [InstructionsItemComponent, NgbTab, NgbTabset, NgbTabContent, AccordionBasicComponent]
})
export class AccordionComponent {
  accordionDocs = accordionDocs;
  panelDocs = panelDocs;
  basicHtmlContent = basicHtmlContent;
  basicTsContent = basicTsContent;
}
