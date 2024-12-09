import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    imports: [FormsModule, NgbModule],
    templateUrl: './tooltip-triggers.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TooltipTriggersComponent {
	autoClose: boolean | 'inside' | 'outside' = true;
}
