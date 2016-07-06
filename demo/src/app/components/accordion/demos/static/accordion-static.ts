import { Component } from '@angular/core';

import { NgbAccordion, NgbPanel } from '@ng-bootstrap/accordion';

@Component({
  selector: 'ngbd-accordion-static',
  template: require('./accordion-static.html'),
  directives: [NgbAccordion, NgbPanel]
})
export class AccordionStaticComponent {
}
