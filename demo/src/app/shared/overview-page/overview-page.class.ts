import { NgbdComponentPage } from '../component-wrapper/component-page.class';

export class NgbdOverviewPage extends NgbdComponentPage {
	protected get overview() {
		return this.component.overview;
	}

	get menuItems() {
		// converting {[fragment]: title} object to an array of {fragment, title}[]
		return Object.entries(this.overview).map(([fragment, title]) => ({ fragment, title }));
	}
}
