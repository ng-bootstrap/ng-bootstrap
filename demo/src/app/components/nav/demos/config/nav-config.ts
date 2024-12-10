import { Component } from '@angular/core';
import { NgbNavConfig, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-nav-config',
	imports: [NgbNavModule],
	templateUrl: './nav-config.html',
	providers: [NgbNavConfig],
})
export class NgbdNavConfig {
	constructor(config: NgbNavConfig) {
		// customize default values of navs used by this component tree
		config.destroyOnHide = false;
		config.roles = false;
	}
}
