import { Component } from '@angular/core';

import { NGB_ACCORDION_DIRECTIVES } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-accordion-static',
  template: require('./accordion-static.html'),
  directives: [NGB_ACCORDION_DIRECTIVES]
})
export class AccordionStaticComponent {
}
