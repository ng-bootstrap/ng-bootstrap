import { expect } from '@playwright/test';
import { openDropdown } from '../dropdown.po';
import { getPage, setPage, test } from '../../../../baseTest';
import { sendKey } from '../../tools.po';

const SELECTOR_DROPDOWN = '[ngbDropdown]';
const SELECTOR_DROPDOWN_TOGGLE = '[ngbDropdownToggle]';
const SELECTOR_DROPDOWN_ITEM = (item: number) => `#item-${item}`;

const focusToggle = async () => {
	await getPage().focus(SELECTOR_DROPDOWN_TOGGLE);
	await expect(getPage().locator(SELECTOR_DROPDOWN_TOGGLE), `dropdown toggle should be focused`).toBeFocused();
};

test.use({ testURL: 'dropdown/shadow', testSelector: 'h3:text("Dropdown shadow")' });
test.beforeEach(async ({ page }) => setPage(page));

test.describe(`Dropdown shadow`, () => {
	test(`should focus dropdown items with 'ArrowUp' / 'ArrowDown'`, async () => {
		// Open
		await openDropdown('Dropdown should be opened', SELECTOR_DROPDOWN);
		await expect(getPage().locator(SELECTOR_DROPDOWN_TOGGLE), `Toggling element should be focused`).toBeFocused();

		// Down -> first
		await sendKey('ArrowDown');
		await expect(getPage().locator(SELECTOR_DROPDOWN_ITEM(1)), `first dropdown item should be focused`).toBeFocused();

		// Down -> second
		await sendKey('ArrowDown');
		await expect(getPage().locator(SELECTOR_DROPDOWN_ITEM(2)), `second dropdown item should be focused`).toBeFocused();

		// Down -> second
		await sendKey('ArrowDown');
		await expect(
			getPage().locator(SELECTOR_DROPDOWN_ITEM(2)),
			`second dropdown item should stay focused`,
		).toBeFocused();

		// Up -> first
		await sendKey('ArrowUp');
		await expect(getPage().locator(SELECTOR_DROPDOWN_ITEM(1)), `first dropdown item should be focused`).toBeFocused();

		// Up -> first
		await sendKey('ArrowUp');
		await expect(getPage().locator(SELECTOR_DROPDOWN_ITEM(1)), `first dropdown item should stay focused`).toBeFocused();
	});
});
