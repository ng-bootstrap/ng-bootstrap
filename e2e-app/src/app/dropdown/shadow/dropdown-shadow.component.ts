import { Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	imports: [FormsModule, NgbModule],
	templateUrl: './dropdown-shadow.component.html',
	encapsulation: ViewEncapsulation.ShadowDom,
})
export class DropdownShadowComponent {}
