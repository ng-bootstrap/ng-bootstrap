import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap/tooltip';

@Component({
	imports: [FormsModule, NgbTooltip],
	changeDetection: ChangeDetectionStrategy.Eager,
	templateUrl: './tooltip-focus.component.html',
})
export class TooltipFocusComponent {}
