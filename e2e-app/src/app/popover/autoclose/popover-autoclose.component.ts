import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap/popover';
import {
	NgbDropdown,
	NgbDropdownMenu,
	NgbDropdownModule,
	NgbDropdownToggle,
} from '@ng-bootstrap/ng-bootstrap/dropdown';

@Component({
	imports: [FormsModule, NgbPopover, NgbDropdown, NgbDropdownMenu, NgbDropdownModule, NgbDropdownToggle],
	templateUrl: './popover-autoclose.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopoverAutocloseComponent {
	autoClose: boolean | 'inside' | 'outside' = true;
}
