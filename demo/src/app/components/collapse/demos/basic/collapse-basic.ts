import { Component, signal } from '@angular/core';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap/collapse';

@Component({
	selector: 'ngbd-collapse-basic',
	imports: [NgbCollapse],
	templateUrl: './collapse-basic.html',
})
export class NgbdCollapseBasic {
	readonly isCollapsed = signal(false);
}
