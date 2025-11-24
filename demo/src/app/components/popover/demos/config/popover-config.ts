import { Component } from '@angular/core';
import { NgbPopoverConfig, NgbPopover } from '@ng-bootstrap/ng-bootstrap/popover';

@Component({
	selector: 'ngbd-popover-config',
	imports: [NgbPopover],
	templateUrl: './popover-config.html',
	providers: [NgbPopoverConfig],
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
