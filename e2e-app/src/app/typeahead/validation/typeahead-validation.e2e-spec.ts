import { expect } from '@playwright/test';
import { SELECTOR_TYPEAHEAD, SELECTOR_TYPEAHEAD_ITEMS } from '../typeahead.po';
import { test, getPage, setPage } from '../../../../baseTest';

test.use({ testURL: 'typeahead/validation', testSelector: 'h3:text("Typeahead validation")' });
test.beforeEach(async ({ page }) => setPage(page));

test.describe('Typeahead', () => {
	test(`should stay valid on item click`, async () => {
		await getPage().click(SELECTOR_TYPEAHEAD);
		expect(await getPage().getAttribute(SELECTOR_TYPEAHEAD, 'class'), `The input shouldn't be touched`).toContain(
			'ng-untouched',
		);

		await getPage().click(`${SELECTOR_TYPEAHEAD_ITEMS}:first-child`);
		expect(await getPage().getAttribute(SELECTOR_TYPEAHEAD, 'class'), `The input shouldn't be touched`).toContain(
			'ng-untouched',
		);

		await getPage().click('#first');
		expect(await getPage().getAttribute(SELECTOR_TYPEAHEAD, 'class'), `The input shouldn't be touched`).toContain(
			'ng-touched',
		);
	});
});
