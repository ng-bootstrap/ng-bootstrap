import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap/tooltip';

@Component({
	selector: 'ngbd-tooltip-triggers',
	imports: [NgbTooltip],
	changeDetection: ChangeDetectionStrategy.Eager,
	templateUrl: './tooltip-triggers.html',
})
export class NgbdTooltipTriggers {}
