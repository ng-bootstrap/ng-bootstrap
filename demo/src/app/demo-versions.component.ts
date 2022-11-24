import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe, NgFor } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { environment } from '../environments/environment';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { filter, map } from 'rxjs/operators';

interface Version {
	text: string;
	url: string;
}

@Component({
	selector: 'ngbd-demo-versions',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgFor, AsyncPipe, NgbDropdownModule],
	template: `
		<div class="nav-item" ngbDropdown>
			<a class="nav-link" ngbDropdownToggle id="demo-site-versions" role="button"> ng-bootstrap v{{ current }} </a>
			<div ngbDropdownMenu aria-labelledby="demo-site-versions" class="dropdown-menu dropdown-menu-end">
				<a
					ngbDropdownItem
					*ngFor="let version of versions$ | async"
					href="{{ version.url }}#{{ routerUrl$ | async }}"
					>{{ version.text }}</a
				>
			</div>
		</div>
	`,
})
export class NgbdDemoVersionsComponent {
	current = environment.version;

	routerUrl$ = inject(Router).events.pipe(
		filter((event) => event instanceof NavigationEnd),
		map((event: NavigationEnd) => event.url),
	);
	versions$: Promise<Version[]> = (window as any).NGB_DEMO_VERSIONS;
}
