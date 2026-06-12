import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap/collapse';
import { COMPONENTS, DEPRECATED_COMPONENTS } from '../../components';

@Component({
	selector: 'ngbd-side-nav',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [RouterLink, NgbCollapse],
	templateUrl: './side-nav.component.html',
})
export class SideNavComponent {
	private router = inject(Router);

	components = COMPONENTS;
	deprecatedComponents = DEPRECATED_COMPONENTS;

	isActive(currentRoute: any[]): boolean {
		// TODO mig v22 - migrate to `isActive` method provided by '@angular/router'
		// eslint-disable-next-line @typescript-eslint/no-deprecated
		return this.router.isActive(this.router.createUrlTree(currentRoute), {
			paths: 'subset',
			queryParams: 'subset',
			fragment: 'ignored',
			matrixParams: 'ignored',
		});
	}
}
