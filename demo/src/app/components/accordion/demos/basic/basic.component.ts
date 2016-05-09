import { Component } from '@angular/core';

import { NgbAccordion, NgbPanel } from '@ng-bootstrap/accordion';

@Component({
  selector: 'ngbd-accordion-basic',
  template: require('./basic.component.html'),
  directives: [NgbAccordion, NgbPanel]
})
export class AccordionBasicComponent {
  firstDisabled = false;
  isOpen = false;

  groups = [
    {
      heading: 'Dynamic 1',
      content: 'I am dynamic!'
    },
    {
      heading: 'Dynamic 2',
      content: 'Dynamic as well'
    }
  ];

  removeDynamic() {
    this.groups.pop();
  }
}
