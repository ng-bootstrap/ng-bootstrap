import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap/tooltip';

@Component({
	imports: [FormsModule, NgbTooltip],
	templateUrl: './tooltip-triggers.component.html',
})
export class TooltipTriggersComponent {
	autoClose: boolean | 'inside' | 'outside' = true;
}
