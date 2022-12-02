import { Component } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-nav-vertical',
	standalone: true,
	imports: [NgbNavModule, NgbNavModule],
	templateUrl: './nav-vertical.html',
})
export class NgbdNavVertical {
	active = 'top';
}
