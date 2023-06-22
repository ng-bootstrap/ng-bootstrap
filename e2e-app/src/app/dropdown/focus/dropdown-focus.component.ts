import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgIf } from '@angular/common';

@Component({
	standalone: true,
	imports: [FormsModule, NgbModule, NgIf],
	templateUrl: './dropdown-focus.component.html',
})
export class DropdownFocusComponent {
	container;
	withItems = true;
}
