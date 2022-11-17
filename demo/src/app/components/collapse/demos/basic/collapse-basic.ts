import { Component } from '@angular/core';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-collapse-basic',
	standalone: true,
	imports: [NgbCollapseModule],
	templateUrl: './collapse-basic.html',
})
export class NgbdCollapseBasic {
	public isCollapsed = false;
}
