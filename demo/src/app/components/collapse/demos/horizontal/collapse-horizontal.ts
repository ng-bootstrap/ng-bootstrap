import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap/collapse';

@Component({
	selector: 'ngbd-collapse-horizontal',
	imports: [NgbCollapse],
	changeDetection: ChangeDetectionStrategy.Eager,
	templateUrl: './collapse-horizontal.html',
})
export class NgbdCollapseHorizontal {
	isCollapsed = false;
}
