import { Component } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap/tooltip';

@Component({
	selector: 'tooltip-component',
	imports: [NgbTooltip],
	template: ` <button type="button" class="btn btn-outline-secondary" ngbTooltip="Tooltip">Hover me</button> `,
})
export class TooltipComponent {}
