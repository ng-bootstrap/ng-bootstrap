import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    imports: [FormsModule, NgbModule],
    templateUrl: './dropdown-autoclose.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropdownAutoCloseComponent {
	autoClose: boolean | 'inside' | 'outside' = true;
	container: null | 'body';
}
