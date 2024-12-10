import { Component } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'nav-focus-component',
	imports: [NgbModule],
	templateUrl: './nav-focus.component.html',
})
export class NavFocusComponent {
	active = 2;
	keyboard: boolean | 'changeWithArrows' = true;
}
