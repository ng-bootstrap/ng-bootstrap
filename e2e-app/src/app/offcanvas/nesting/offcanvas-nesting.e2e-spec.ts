import { expect } from '@playwright/test';
import { test, getPage, setPage } from '../../../../baseTest';
import { sendKey } from '../../tools.po';
import { waitForOffcanvas } from '../offcanvas.po';

import {
	openOffcanvas,
	pressButton,
	SELECTOR_DATEPICKER,
	SELECTOR_DATEPICKER_BUTTON,
	SELECTOR_DROPDOWN_BUTTON,
	SELECTOR_DROPDOWN,
	SELECTOR_TYPEAHEAD_INPUT,
	SELECTOR_TYPEAHEAD_DROPDOWN,
} from './offcanvas-nesting.po';

import { SELECTOR_DAY } from '../../datepicker/datepicker.po';

test.use({ testURL: 'offcanvas/nesting', testSelector: 'h3:text("Offcanvas nesting tests")' });
test.beforeEach(async ({ page }) => setPage(page));

test.describe('Offcanvas nested components', () => {
	test.afterEach(async () => {
		await waitForOffcanvas('absent');
	});

	test('should close only datepicker, then offcanvas on ESC', async () => {
		await openOffcanvas();

		// open datepicker
		await pressButton(SELECTOR_DATEPICKER_BUTTON);
		await expect(getPage().locator(SELECTOR_DATEPICKER), `Datepicker should be opened`).toBeVisible();
		await expect(getPage().locator(SELECTOR_DAY(new Date(2018, 0, 1))), `01 JAN 2018 should be focused`).toBeFocused();

		// close datepicker
		await sendKey('Escape');
		await expect(getPage().locator(SELECTOR_DATEPICKER), `Datepicker should be closed`).toHaveCount(0);
		await expect(
			getPage().locator(SELECTOR_DATEPICKER_BUTTON),
			`Datepicker open button should be focused`,
		).toBeFocused();
		await waitForOffcanvas('present', `Offcanvas should stay opened`);

		await sendKey('Escape');
	});

	test('should close only dropdown, then offcanvas on ESC', async () => {
		await openOffcanvas();

		// open dropdown
		await pressButton(SELECTOR_DROPDOWN_BUTTON);
		await expect(getPage().locator(SELECTOR_DROPDOWN), `Dropdown should be opened`).toBeVisible();
		await expect(getPage().locator(SELECTOR_DROPDOWN_BUTTON), `Dropdown button should be focused`).toBeFocused();

		// close dropdown
		await sendKey('Escape');
		await expect(getPage().locator(SELECTOR_DROPDOWN), `Dropdown should be closed`).toHaveCount(0);
		await expect(getPage().locator(SELECTOR_DROPDOWN_BUTTON), `Dropdown open button should be focused`).toBeFocused();
		await waitForOffcanvas('present', `Offcanvas should stay opened`);

		await sendKey('Escape');
	});

	test('should close only typeahead, then offcanvas on ESC', async () => {
		await openOffcanvas();

		// open typeahead
		await getPage().click(SELECTOR_TYPEAHEAD_INPUT);
		await sendKey(' ');
		await expect(getPage().locator(SELECTOR_TYPEAHEAD_DROPDOWN), `Typeahead should be opened`).toBeVisible();
		await expect(getPage().locator(SELECTOR_TYPEAHEAD_INPUT), `Typeahead input should be focused`).toBeFocused();

		// close typeahead
		await sendKey('Escape');
		await expect(
			getPage().locator(SELECTOR_TYPEAHEAD_DROPDOWN),
			`Typeahead should be
                closed`,
		).toHaveCount(0);
		await expect(getPage().locator(SELECTOR_TYPEAHEAD_INPUT), `Typeahead input should be focused`).toBeFocused();
		await waitForOffcanvas('present', `Offcanvas should stay opened`);

		await sendKey('Escape');
	});
});
