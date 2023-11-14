import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	standalone: true,
	imports: [FormsModule, NgbModule],
	templateUrl: './dropdown-focus.component.html',
})
export class DropdownFocusComponent {
	container;
	withItems = true;
}
