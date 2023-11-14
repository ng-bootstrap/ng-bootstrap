import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { LIB_VERSIONS } from '../tokens';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { filter, map } from 'rxjs/operators';

interface Version {
	text: string;
	url: string;
}

@Component({
	selector: 'ngbd-version-picker',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [AsyncPipe, NgbDropdownModule],
	template: `
		<div class="nav-item" ngbDropdown>
			<a class="nav-link" ngbDropdownToggle id="demo-site-versions" role="button"> ng-bootstrap v{{ current }} </a>
			<div ngbDropdownMenu aria-labelledby="demo-site-versions" class="dropdown-menu dropdown-menu-end">
				@for (version of versions$ | async; track version) {
					<a ngbDropdownItem href="{{ version.url }}#{{ routerUrl$ | async }}">{{ version.text }}</a>
				}
			</div>
		</div>
	`,
})
export class VersionPickerComponent {
	current = inject(LIB_VERSIONS).ngBootstrap;
	versions$: Promise<Version[]> = (window as any).NGB_DEMO_VERSIONS;
	routerUrl$ = inject(Router).events.pipe(
		filter((event) => event instanceof NavigationEnd),
		map((event: NavigationEnd) => event.url),
	);
}
