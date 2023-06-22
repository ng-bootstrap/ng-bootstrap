import { Component } from '@angular/core';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'collapse-component',
	standalone: true,
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
