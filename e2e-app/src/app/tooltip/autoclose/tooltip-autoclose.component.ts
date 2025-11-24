import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap/tooltip';
import {
	NgbDropdown,
	NgbDropdownMenu,
	NgbDropdownModule,
	NgbDropdownToggle,
} from '@ng-bootstrap/ng-bootstrap/dropdown';

@Component({
	imports: [FormsModule, NgbTooltip, NgbDropdown, NgbDropdownMenu, NgbDropdownModule, NgbDropdownToggle],
	templateUrl: './tooltip-autoclose.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipAutocloseComponent {
	autoClose: boolean | 'inside' | 'outside' = true;
}
