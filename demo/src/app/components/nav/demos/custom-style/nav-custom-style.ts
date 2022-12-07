import { Component } from '@angular/core';
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-nav-custom-style',
	standalone: true,
	imports: [NgbNavModule, NgbDropdownModule],
	templateUrl: './nav-custom-style.html',
})
export class NgbdNavCustomStyle {}
