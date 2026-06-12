import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap/tooltip';

@Component({
	selector: 'ngbd-tooltip-delay',
	imports: [NgbTooltip],
	changeDetection: ChangeDetectionStrategy.Eager,
	templateUrl: './tooltip-delay.html',
})
export class NgbdTooltipDelay {}
