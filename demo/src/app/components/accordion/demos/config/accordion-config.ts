import { Component } from '@angular/core';
import { NgbAccordionConfig, NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'ngbd-accordion-config',
    imports: [NgbAccordionModule],
    templateUrl: './accordion-config.html',
    providers: [NgbAccordionConfig]
})
export class NgbdAccordionConfig {
	constructor(config: NgbAccordionConfig) {
		// customize default values of accordions used by this component tree
		config.closeOthers = true;
	}
}
