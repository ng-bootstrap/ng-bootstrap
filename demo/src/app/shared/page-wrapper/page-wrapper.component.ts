import { AfterViewInit, Component, ContentChildren, inject, Input, NgZone, QueryList } from '@angular/core';
import { PageHeaderComponent } from '../page-header.component';
import { TableOfContents } from '../component-wrapper/component-wrapper.component';
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
	imports: [NgbCollapseModule, NgbDropdownModule, NgbScrollSpyModule, RouterLink, SideNavComponent],
	templateUrl: './page-wrapper.component.html',
})
export class NgbdPageWrapper implements AfterViewInit {
	@Input() pageTitle: string;

	@ContentChildren(PageHeaderComponent) private _tableOfContents: QueryList<PageHeaderComponent>;

	sidebarCollapsed = true;
	isLargeScreenOrLess: boolean;

	private _scrollSpy = inject(NgbScrollSpyService);

	constructor(ngZone: NgZone) {
		const largeScreenQL = matchMedia('(max-width: 1199.98px)');
		this.isLargeScreenOrLess = largeScreenQL.matches;
		// eslint-disable-next-line deprecation/deprecation
		largeScreenQL.addListener((event) => ngZone.run(() => (this.isLargeScreenOrLess = event.matches)));
	}

	ngAfterViewInit() {
		this._scrollSpy.start({
			fragments: this.tableOfContents.map(({ fragment }) => fragment),
		});
	}

	get tableOfContents(): TableOfContents {
		return this._tableOfContents ? this._tableOfContents.toArray() : [];
	}
}
