import { expect } from '@playwright/test';
import { focusElement, sendKey } from '../../tools.po';
import { test, getPage, setPage } from '../../../../baseTest';
import { SELECTOR_TYPEAHEAD, SELECTOR_TYPEAHEAD_ACTIVE_ITEM, SELECTOR_TYPEAHEAD_ITEMS } from '../typeahead.po';

test.use({ testURL: 'typeahead/scroll', testSelector: 'h3:text("Typeahead scroll")' });
test.beforeEach(async ({ page }) => setPage(page));

test.describe('Typeahead', () => {
	const waitForTypeaheadFocused = async () =>
		await expect(getPage().locator(SELECTOR_TYPEAHEAD), `Typeahead should be focused`).toBeFocused();

	const waitForDropdownOpen = async (suggestions = 10) => {
		await expect(
			getPage().locator(SELECTOR_TYPEAHEAD_ITEMS),
			`Wrong number of suggestions (expected ${suggestions})`,
		).toHaveCount(suggestions);
	};

	test(`should scroll active element into view when navigating with keyboard`, async () => {
		await focusElement(SELECTOR_TYPEAHEAD);
		await waitForTypeaheadFocused();

		await getPage().locator(SELECTOR_TYPEAHEAD).press('a');
		await waitForDropdownOpen();

		for (let i = 0; i < 6; i++) {
			await sendKey('ArrowDown');
		}

		const activeElement = await getPage().locator(SELECTOR_TYPEAHEAD_ACTIVE_ITEM);

		await expect(activeElement).toBeInViewport({ ratio: 1 });
		await expect(activeElement).toBeVisible();
	});
});
