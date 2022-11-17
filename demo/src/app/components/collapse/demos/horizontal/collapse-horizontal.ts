import { Component } from '@angular/core';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-collapse-horizontal',
	standalone: true,
	imports: [NgbCollapseModule],
	templateUrl: './collapse-horizontal.html',
})
export class NgbdCollapseHorizontal {
	public isCollapsed = false;
}
