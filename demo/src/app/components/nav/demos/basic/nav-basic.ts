import { Component } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-nav-basic',
	standalone: true,
	imports: [NgbNavModule],
	templateUrl: './nav-basic.html',
})
export class NgbdNavBasic {
	active = 1;
}
