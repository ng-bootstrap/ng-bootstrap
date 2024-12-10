import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	imports: [FormsModule, NgbModule],
	templateUrl: './tooltip-autoclose.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipAutocloseComponent {
	autoClose: boolean | 'inside' | 'outside' = true;
}
