import { expect } from '@playwright/test';
import { test, getPage, setPage } from '../../../../baseTest';
import { sendKey } from '../../tools.po';
import { waitForModalCount } from '../modal.po';

import {
	openModal,
	pressButton,
	SELECTOR_DATEPICKER,
	SELECTOR_DATEPICKER_BUTTON,
	SELECTOR_DROPDOWN_BUTTON,
	SELECTOR_DROPDOWN,
	SELECTOR_TYPEAHEAD_INPUT,
	SELECTOR_TYPEAHEAD_DROPDOWN,
	setContainer,
	SELECTOR_DROPDOWN_ITEM,
	SELECTOR_CLOSE_BUTTON,
	SELECTOR_TYPEAHEAD_DROPDOWN_ITEM,
	SELECTOR_TOOLTIP_BUTTON,
	SELECTOR_TOOLTIP,
	SELECTOR_POPOVER_BUTTON,
	SELECTOR_POPOVER,
} from './modal-nesting.po';

import { SELECTOR_DAY } from '../../datepicker/datepicker.po';

test.use({ testURL: 'modal/nesting', testSelector: 'h3:text("Modal nesting tests")' });
test.beforeEach(async ({ page }) => setPage(page));

test.describe(`Modal nested components z-index`, () => {
	for (let container of ['null', 'body']) {
		test.beforeEach(async () => {
			await setContainer(container);
		});
		test.afterEach(async () => {
			await waitForModalCount(0);
		});

		test(`datepicker with container='${container}'`, async () => {
			await openModal();

			// opening
			await getPage().click(SELECTOR_DATEPICKER_BUTTON);
			await expect(getPage().locator(SELECTOR_DATEPICKER), `Datepicker should be opened`).toBeVisible();

			// closing
			await getPage().click(SELECTOR_DAY(new Date(2018, 0, 1)));
			await expect(getPage().locator(SELECTOR_DATEPICKER), `Datepicker should be closed`).toHaveCount(0);
			await waitForModalCount(1, `Modal should stay opened`);

			await getPage().click(SELECTOR_CLOSE_BUTTON);
		});

		test(`dropdown with container='${container}'`, async () => {
			await openModal();

			// opening
			await getPage().click(SELECTOR_DROPDOWN_BUTTON);
			await expect(getPage().locator(SELECTOR_DROPDOWN), `Dropdown should be opened`).toBeVisible();

			// closing
			await getPage().click(SELECTOR_DROPDOWN_ITEM);
			await expect(getPage().locator(SELECTOR_DROPDOWN), `Dropdown should be closed`).toHaveCount(0);
			await waitForModalCount(1, `Modal should stay opened`);

			await getPage().click(SELECTOR_CLOSE_BUTTON);
		});

		test(`typeahead with container='${container}'`, async () => {
			await openModal();

			// opening
			await getPage().click(SELECTOR_TYPEAHEAD_INPUT);
			await sendKey(' ');
			await expect(getPage().locator(SELECTOR_TYPEAHEAD_DROPDOWN), `Typeahead should be opened`).toBeVisible();

			// closing
			await getPage().click(SELECTOR_TYPEAHEAD_DROPDOWN_ITEM);
			await expect(
				getPage().locator(SELECTOR_TYPEAHEAD_DROPDOWN),
				`Typeahead should be
                closed`,
			).toHaveCount(0);
			await waitForModalCount(1, `Modal should stay opened`);

			await getPage().click(SELECTOR_CLOSE_BUTTON);
		});

		test(`tooltip with container='${container}'`, async () => {
			await openModal();

			// opening
			await getPage().click(SELECTOR_TOOLTIP_BUTTON);
			await expect(getPage().locator(SELECTOR_TOOLTIP), `Tooltip should be opened`).toBeVisible();

			// closing
			await getPage().click(SELECTOR_TOOLTIP);
			await expect(getPage().locator(SELECTOR_TOOLTIP), `Tooltip should be closed`).toHaveCount(0);
			await waitForModalCount(1, `Modal should stay opened`);

			await getPage().click(SELECTOR_CLOSE_BUTTON);
		});

		test(`popover with container='${container}'`, async () => {
			await openModal();

			// opening
			await getPage().click(SELECTOR_POPOVER_BUTTON);
			await expect(getPage().locator(SELECTOR_POPOVER), `Popover should be opened`).toBeVisible();

			// closing
			await getPage().click(SELECTOR_POPOVER);
			await expect(getPage().locator(SELECTOR_POPOVER), `Popover should be closed`).toHaveCount(0);
			await waitForModalCount(1, `Modal should stay opened`);

			await getPage().click(SELECTOR_CLOSE_BUTTON);
		});
	}
});

test.describe('Modal nested components', () => {
	test.afterEach(async () => {
		await waitForModalCount(0);
	});

	test('should close only datepicker, then modal on ESC', async () => {
		await openModal();

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
		await waitForModalCount(1, `Modal should stay opened`);

		await sendKey('Escape');
	});

	test('should close only dropdown, then modal on ESC', async () => {
		await openModal();

		// open dropdown
		await pressButton(SELECTOR_DROPDOWN_BUTTON);
		await expect(getPage().locator(SELECTOR_DROPDOWN), `Dropdown should be opened`).toBeVisible();
		await expect(getPage().locator(SELECTOR_DROPDOWN_BUTTON), `Dropdown button should be focused`).toBeFocused();

		// close dropdown
		await sendKey('Escape');
		await expect(getPage().locator(SELECTOR_DROPDOWN), `Dropdown should be closed`).toHaveCount(0);
		await expect(getPage().locator(SELECTOR_DROPDOWN_BUTTON), `Dropdown open button should be focused`).toBeFocused();
		await waitForModalCount(1, `Modal should stay opened`);

		await sendKey('Escape');
	});

	test('should close only typeahead, then modal on ESC', async () => {
		await openModal();

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
		await waitForModalCount(1, `Modal should stay opened`);

		await sendKey('Escape');
	});
});
