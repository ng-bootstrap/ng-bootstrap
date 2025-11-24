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
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap/collapse';
import { NgbDropdown, NgbDropdownToggle, NgbDropdownMenu } from '@ng-bootstrap/ng-bootstrap/dropdown';
import { NgbScrollSpyItem, NgbScrollSpyService } from '@ng-bootstrap/ng-bootstrap/scrollspy';
import { RouterLink } from '@angular/router';
import { SideNavComponent } from '../side-nav/side-nav.component';

@Component({
	selector: 'ngbd-page-wrapper',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		NgbCollapse,
		NgbDropdown,
		NgbDropdownToggle,
		NgbDropdownMenu,
		NgbScrollSpyItem,
		RouterLink,
		SideNavComponent,
	],
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
