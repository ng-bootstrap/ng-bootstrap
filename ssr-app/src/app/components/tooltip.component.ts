import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap/tooltip';

@Component({
	selector: 'tooltip-component',
	imports: [NgbTooltip],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: ` <button type="button" class="btn btn-outline-secondary" ngbTooltip="Tooltip">Hover me</button> `,
})
export class TooltipComponent {}
