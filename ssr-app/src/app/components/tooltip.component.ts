import { Component } from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'tooltip-component',
	imports: [NgbTooltipModule],
	template: ` <button type="button" class="btn btn-outline-secondary" ngbTooltip="Tooltip">Hover me</button> `,
})
export class TooltipComponent {}
