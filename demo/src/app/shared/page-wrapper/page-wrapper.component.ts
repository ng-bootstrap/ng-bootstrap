import {
	afterNextRender,
	ChangeDetectionStrategy,
	Component,
	computed,
	contentChildren,
	inject,
	input,
	signal,
} from '@angular/core';
import { PageHeaderComponent } from '../page-header.component';
import {
	NgbCollapseModule,
	NgbDropdownModule,
	NgbScrollSpyModule,
	NgbScrollSpyService,
} from '@ng-bootstrap/ng-bootstrap';
import { RouterLink } from '@angular/router';
import { SideNavComponent } from '../side-nav/side-nav.component';

@Component({
	selector: 'ngbd-page-wrapper',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgbCollapseModule, NgbDropdownModule, NgbScrollSpyModule, RouterLink, SideNavComponent],
	templateUrl: './page-wrapper.component.html',
})
export class NgbdPageWrapper {
	private _scrollSpy = inject(NgbScrollSpyService);

	pageTitle = input('');

	private _tableOfContents = contentChildren(PageHeaderComponent);
	tableOfContents = computed(() => this._tableOfContents() || []);
	private fragments = computed(() => this.tableOfContents().map(({ fragment }) => fragment()));

	sidebarCollapsed = signal(true);
	isLargeScreenOrLess = signal(false);

	constructor() {
		const largeScreenQL = matchMedia('(max-width: 1199.98px)');
		this.isLargeScreenOrLess.set(largeScreenQL.matches);
		// eslint-disable-next-line deprecation/deprecation
		largeScreenQL.addListener(({ matches }) => this.isLargeScreenOrLess.set(matches));

		afterNextRender(() => {
			this._scrollSpy.start({
				fragments: this.fragments(),
			});
		});
	}
}
