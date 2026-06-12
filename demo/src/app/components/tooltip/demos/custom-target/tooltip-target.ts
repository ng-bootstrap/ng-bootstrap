import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap/tooltip';

@Component({
	selector: 'ngbd-tooltip-target',
	imports: [NgbTooltip],
	changeDetection: ChangeDetectionStrategy.Eager,
	templateUrl: './tooltip-target.html',
})
export class NgbdTooltipTarget {}
