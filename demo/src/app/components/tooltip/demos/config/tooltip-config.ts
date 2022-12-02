import { Component } from '@angular/core';
import { NgbTooltipConfig, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-tooltip-config',
	standalone: true,
	imports: [NgbTooltipModule],
	templateUrl: './tooltip-config.html',
	providers: [NgbTooltipConfig], // add NgbTooltipConfig to the component providers
})
export class NgbdTooltipConfig {
	constructor(config: NgbTooltipConfig) {
		// customize default values of tooltips used by this component tree
		config.placement = 'end';
		config.triggers = 'click';
	}
}
