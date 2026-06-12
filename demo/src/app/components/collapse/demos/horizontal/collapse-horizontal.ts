import { Component } from '@angular/core';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap/collapse';

@Component({
	selector: 'ngbd-collapse-horizontal',
	imports: [NgbCollapse],
	templateUrl: './collapse-horizontal.html',
})
export class NgbdCollapseHorizontal {
	isCollapsed = false;
}
