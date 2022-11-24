import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { NgFor } from '@angular/common';
import { COMPONENT_LIST, DEPRECATED_COMPONENT_LIST } from '../component-list';

@Component({
	selector: 'ngbd-side-nav',
	standalone: true,
	imports: [RouterLink, NgbCollapseModule, NgFor],
	templateUrl: './side-nav.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideNavComponent {
	components = COMPONENT_LIST;
	deprecatedComponents = DEPRECATED_COMPONENT_LIST;

	constructor(private router: Router) {}

	isActive(currentRoute: any[]): boolean {
		return this.router.isActive(this.router.createUrlTree(currentRoute), {
			paths: 'subset',
			queryParams: 'subset',
			fragment: 'ignored',
			matrixParams: 'ignored',
		});
	}
}
