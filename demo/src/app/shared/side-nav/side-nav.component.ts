import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
	private router = inject(Router);

	components = COMPONENTS;
	deprecatedComponents = DEPRECATED_COMPONENTS;

	isActive(currentRoute: any[]): boolean {
		return this.router.isActive(this.router.createUrlTree(currentRoute), {
			paths: 'subset',
			queryParams: 'subset',
			fragment: 'ignored',
			matrixParams: 'ignored',
		});
	}
}
