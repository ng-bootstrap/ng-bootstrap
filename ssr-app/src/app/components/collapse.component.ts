import { Component } from '@angular/core';
import { NgbCollapseModule } from '@bugsplat/ng-bootstrap';

@Component({
	selector: 'collapse-component',
	imports: [NgbCollapseModule],
	template: `
		<div [ngbCollapse]="isCollapsed">
			<div class="card">
				<div class="card-body">This is not collapsed</div>
			</div>
		</div>
	`,
})
export class CollapseComponent {
	isCollapsed = false;
}
