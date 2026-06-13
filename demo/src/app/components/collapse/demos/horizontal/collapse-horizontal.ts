import { Component, signal } from '@angular/core';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap/collapse';

@Component({
	selector: 'ngbd-collapse-horizontal',
	imports: [NgbCollapse],
	templateUrl: './collapse-horizontal.html',
})
export class NgbdCollapseHorizontal {
	readonly isCollapsed = signal(false);
}
