import { Component } from '@angular/core';
import { NgbTooltipConfig, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap/tooltip';

@Component({
	selector: 'ngbd-tooltip-config',
	imports: [NgbTooltipModule],
	templateUrl: './tooltip-config.html',
	providers: [NgbTooltipConfig],
})
export class NgbdTooltipConfig {
	constructor(config: NgbTooltipConfig) {
		// customize default values of tooltips used by this component tree
		config.placement = 'end';
		config.triggers = 'click';
	}
}
