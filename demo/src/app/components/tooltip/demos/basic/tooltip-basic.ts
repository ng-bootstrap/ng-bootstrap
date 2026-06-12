import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap/tooltip';

@Component({
	selector: 'ngbd-tooltip-basic',
	imports: [NgbTooltip],
	templateUrl: './tooltip-basic.html',
	changeDetection: ChangeDetectionStrategy.Eager,
	host: { class: 'd-block' },
})
export class NgbdTooltipBasic {}
