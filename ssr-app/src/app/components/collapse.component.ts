import { Component } from '@angular/core';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap/collapse';

@Component({
	selector: 'collapse-component',
	imports: [NgbCollapse],
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
