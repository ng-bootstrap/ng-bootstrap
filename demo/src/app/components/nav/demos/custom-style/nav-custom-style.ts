import { Component } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap/dropdown';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap/nav';

@Component({
	selector: 'ngbd-nav-custom-style',
	imports: [NgbNavModule, NgbDropdownModule],
	templateUrl: './nav-custom-style.html',
})
export class NgbdNavCustomStyle {}
