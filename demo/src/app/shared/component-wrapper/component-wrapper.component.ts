import { ChangeDetectionStrategy, Component, computed, inject, signal, Signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { COMPONENT_DATA, LIB_VERSIONS, MenuItem } from '../../tokens';
import { SideNavComponent } from '../side-nav/side-nav.component';
import { AsyncPipe, NgComponentOutlet, TitleCasePipe } from '@angular/common';
import {
	NgbCollapseModule,
	NgbDropdownModule,
	NgbNavModule,
	NgbScrollSpyItem,
	NgbScrollSpyService,
} from '@ng-bootstrap/ng-bootstrap';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs/operators';
import { NgbdComponentPage } from './component-page.class';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        SideNavComponent,
        TitleCasePipe,
        NgbNavModule,
        NgbCollapseModule,
        NgbDropdownModule,
        RouterLink,
        AsyncPipe,
        NgComponentOutlet,
        RouterOutlet,
        NgbScrollSpyItem,
    ],
    templateUrl: 'component-wrapper.component.html'
})
export class ComponentWrapper {
	private scrollSpy = inject(NgbScrollSpyService);
	private route = inject(ActivatedRoute);
	component = inject(COMPONENT_DATA);
	bootstrapUrl = this.component.bootstrapUrl?.replace('%version%', inject(LIB_VERSIONS).bootstrap);

	activeTab: Signal<string | undefined>;
	childrenRouteConfig = this.route.routeConfig!.children!;

	isLargeScreenOrLess = signal(false);
	isSmallScreenOrLess = signal(false);
	sidebarCollapsed = signal(true);
	menuItems = signal<MenuItem[]>([]);
	fragments = computed(() => this.menuItems().map(({ fragment }) => fragment));

	constructor() {
		const router = inject(Router);
		this.activeTab = toSignal(
			router.events.pipe(
				takeUntilDestroyed(),
				filter((event) => event instanceof NavigationEnd),
				map(() => this.route.snapshot.firstChild!.url[0].path!),
			),
		);

		// information extracted from https://getbootstrap.com/docs/4.1/layout/overview/
		// TODO: we should implements our own mediamatcher, according to bootstrap layout.
		const smallScreenQL = matchMedia('(max-width: 767.98px)');
		// eslint-disable-next-line deprecation/deprecation
		smallScreenQL.addListener(({ matches }) => this.isSmallScreenOrLess.set(matches));
		this.isSmallScreenOrLess.set(smallScreenQL.matches);

		const largeScreenQL = matchMedia('(max-width: 1199.98px)');
		this.isLargeScreenOrLess.set(largeScreenQL.matches);
		// eslint-disable-next-line deprecation/deprecation
		largeScreenQL.addListener(({ matches }) => this.isLargeScreenOrLess.set(matches));
	}

	onActivate(component: NgbdComponentPage) {
		this.menuItems.set(component.menuItems);

		setTimeout(() => {
			this.scrollSpy.start({
				fragments: this.fragments(),
			});
		});
	}

	onDeactivate() {
		this.scrollSpy.stop();
	}
}
