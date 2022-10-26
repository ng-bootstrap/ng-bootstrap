import { Component } from '@angular/core';
import { NgbPopoverConfig, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-popover-config',
	standalone: true,
	imports: [NgbPopoverModule],
	templateUrl: './popover-config.html',
	providers: [NgbPopoverConfig], // add NgbPopoverConfig to the component providers
})
export class NgbdPopoverConfig {
	constructor(config: NgbPopoverConfig) {
		// customize default values of popovers used by this component tree
		config.placement = 'end';
		config.triggers = 'hover';

		// example of usage for popperOptions
		config.popperOptions = (options) => {
			for (const modifier of options.modifiers || []) {
				if (modifier.name === 'offset' && modifier.options) {
					modifier.options.offset = () => [30, 8];
				}
			}
			return options;
		};
	}
}
