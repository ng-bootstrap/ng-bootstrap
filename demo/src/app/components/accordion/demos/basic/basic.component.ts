import { Component } from '@angular/core';

import { NGB_ACCORDION_DIRECTIVES } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-accordion-basic',
  template: require('./basic.component.html'),
  directives: [NGB_ACCORDION_DIRECTIVES]
})
export class AccordionBasicComponent {
}
