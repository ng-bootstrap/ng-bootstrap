import { Component, inject } from '@angular/core';
import { NgbTooltipConfig, NgbTooltip } from '@ng-bootstrap/ng-bootstrap/tooltip';

@Component({
	selector: 'ngbd-tooltip-config',
	imports: [NgbTooltip],
	templateUrl: './tooltip-config.html',
	providers: [NgbTooltipConfig],
})
export class NgbdTooltipConfig {
	constructor() {
		// customize default values of tooltips used by this component tree
		const config = inject(NgbTooltipConfig);
		config.placement = 'end';
		config.triggers = 'click';
	}
}
