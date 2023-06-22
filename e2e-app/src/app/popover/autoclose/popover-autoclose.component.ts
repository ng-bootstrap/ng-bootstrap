import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	standalone: true,
	imports: [FormsModule, NgbModule],
	templateUrl: './popover-autoclose.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopoverAutocloseComponent {
	autoClose: boolean | 'inside' | 'outside' = true;
}
