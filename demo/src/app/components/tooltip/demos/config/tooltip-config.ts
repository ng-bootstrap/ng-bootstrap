import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgbTooltipConfig, NgbTooltip } from '@ng-bootstrap/ng-bootstrap/tooltip';

@Component({
	selector: 'ngbd-tooltip-config',
	imports: [NgbTooltip],
	templateUrl: './tooltip-config.html',
	changeDetection: ChangeDetectionStrategy.Eager,
	providers: [NgbTooltipConfig],
})
export class NgbdTooltipConfig {
	constructor(config: NgbTooltipConfig) {
		// customize default values of tooltips used by this component tree
		config.placement = 'end';
		config.triggers = 'click';
	}
}
