import {Component} from '@angular/core';
import {NgbAccordionConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-accordion-config',
  templateUrl: './accordion-config.html',
  providers: [NgbAccordionConfig] // add the NgbAccordionConfig to the component providers
})
export class NgbdAccordionConfig {
  constructor(config: NgbAccordionConfig) {
    // customize default values of accordions used by this component tree
    config.closeOthers = true;
    config.type = 'info';
  }
}
