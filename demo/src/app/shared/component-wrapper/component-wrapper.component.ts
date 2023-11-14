import { Component, inject, NgZone } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';

import { NgbdApiPage } from '../api-page/api-page.component';
import { DemoListComponent } from '../examples-page/demo-list.component';
import { LIB_VERSIONS } from '../../tokens';
import { SideNavComponent } from '../side-nav/side-nav.component';
import { AsyncPipe, NgComponentOutlet, TitleCasePipe } from '@angular/common';
import {
	NgbCollapseModule,
	NgbDropdownModule,
	NgbNavModule,
	NgbScrollSpyItem,
	NgbScrollSpyService,
} from '@ng-bootstrap/ng-bootstrap';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs/operators';

export type TableOfContents = { fragment: string; title: string }[];

@Component({
	standalone: true,
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
	templateUrl: 'component-wrapper.component.html',
})
export class ComponentWrapper {
	private scrollSpy = inject(NgbScrollSpyService);
	private route = inject(ActivatedRoute);

	componentName = this.route.snapshot.data.name;
	activeTab: string;
	headerComponentType = this.route.snapshot.data.header;
	bootstrapUrl = this.route.snapshot.data.bootstrap?.replace('%version%', inject(LIB_VERSIONS).bootstrap);
	childrenRouteConfig = this.route.routeConfig!.children!;

	isLargeScreenOrLess: boolean;
	isSmallScreenOrLess: boolean;

	sidebarCollapsed = true;

	tableOfContents: TableOfContents = [];

	constructor() {
		inject(Router)
			.events.pipe(
				takeUntilDestroyed(),
				filter((event) => event instanceof NavigationEnd),
				map(() => this.route.snapshot.firstChild!.url[0].path!),
			)
			.subscribe((url) => {
				this.activeTab = url;
			});

		// information extracted from https://getbootstrap.com/docs/4.1/layout/overview/
		// TODO: we should implements our own mediamatcher, according to bootstrap layout.
		const zone = inject(NgZone);
		const smallScreenQL = matchMedia('(max-width: 767.98px)');
		// eslint-disable-next-line deprecation/deprecation
		smallScreenQL.addListener((event) => zone.run(() => (this.isSmallScreenOrLess = event.matches)));
		this.isSmallScreenOrLess = smallScreenQL.matches;

		const largeScreenQL = matchMedia('(max-width: 1199.98px)');
		this.isLargeScreenOrLess = largeScreenQL.matches;
		// eslint-disable-next-line deprecation/deprecation
		largeScreenQL.addListener((event) => zone.run(() => (this.isLargeScreenOrLess = event.matches)));
	}

	onActivate(component: DemoListComponent | NgbdApiPage | any) {
		setTimeout(() => {
			const getLinks = (typeCollection: string[]) => {
				return typeCollection.map((item) => ({
					fragment: item,
					title: item,
				}));
			};
			this.tableOfContents = [];
			if (component instanceof DemoListComponent) {
				this.tableOfContents = component.demos.map((demo) => ({
					fragment: demo.fragment,
					title: demo.title,
				}));
			} else if (component instanceof NgbdApiPage) {
				let toc = getLinks(component.components);

				if (component.classes.length > 0) {
					const klasses = getLinks(component.classes);
					toc = toc.concat(toc.length > 0 ? [<any>{}, ...klasses] : klasses);
				}

				if (component.configs.length > 0) {
					const configs = getLinks(component.configs);
					toc = toc.concat(toc.length > 0 ? [<any>{}, ...configs] : configs);
				}

				this.tableOfContents = toc;
			} /* Overview */ else {
				// TODO: maybe we should also have an abstract class to test instanceof
				this.tableOfContents = Object.keys(component.overview).map((key: any) => ({
					fragment: key,
					title: component.overview[key],
				}));
			}

			this.scrollSpy.start({
				fragments: this.tableOfContents.map((item) => item.fragment),
			});
		}, 0);
	}

	onDeactivate() {
		this.scrollSpy.stop();
	}
}
