import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { NgFor } from '@angular/common';
import { COMPONENTS, DEPRECATED_COMPONENTS } from '../../components';

@Component({
	selector: 'ngbd-side-nav',
	standalone: true,
	imports: [RouterLink, NgbCollapseModule, NgFor],
	templateUrl: './side-nav.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideNavComponent {
	components = COMPONENTS;
	deprecatedComponents = DEPRECATED_COMPONENTS;

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
