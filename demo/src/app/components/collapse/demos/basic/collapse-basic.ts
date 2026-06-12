import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap/collapse';

@Component({
	selector: 'ngbd-collapse-basic',
	imports: [NgbCollapse],
	changeDetection: ChangeDetectionStrategy.Eager,
	templateUrl: './collapse-basic.html',
})
export class NgbdCollapseBasic {
	isCollapsed = false;
}
