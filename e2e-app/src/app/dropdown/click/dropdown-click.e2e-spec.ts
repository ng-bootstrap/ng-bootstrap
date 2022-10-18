import { expect } from '@playwright/test';
import { sendKey } from '../../tools.po';
import { test, getPage, setPage } from '../../../../baseTest';
import { isDropdownOpened } from '../dropdown.po';

const SELECTOR_DROPDOWN_TOGGLE = '[ngbDropdownToggle]';
const SELECTOR_DROPDOWN_ITEM = '[ngbDropdownItem]';

const focusDropdownItem = async (index: number) => {
	await getPage().press(SELECTOR_DROPDOWN_TOGGLE, 'ArrowDown');
	await expect(getPage().locator(SELECTOR_DROPDOWN_TOGGLE), `dropdown should be focused`).toBeFocused();
	for (let i = 0; i <= index; ++i) {
		await sendKey('ArrowDown');
	}
	await expect(
		getPage().locator(`${SELECTOR_DROPDOWN_ITEM}:nth-child(${index + 1})`),
		`Item should be focused`,
	).toBeFocused();
};

test.use({ testURL: 'dropdown/click', testSelector: 'h3:text("Dropdown click")' });
test.beforeEach(async ({ page }) => setPage(page));

test.describe(`Dropdown user (click) handler`, () => {
	test(`should call user (click) handler on 'Enter'`, async () => {
		await focusDropdownItem(0);

		await sendKey('Enter');
		expect(await isDropdownOpened(), `Dropdown should be hidden on Enter`).toBeFalsy();
		await getPage().waitForSelector('#enter-click');
		await getPage().waitForSelector('#enter-key');
	});

	test(`should call user (click) handler on 'Space'`, async () => {
		await focusDropdownItem(1);

		await sendKey(' ');
		expect(await isDropdownOpened(), `Dropdown should be hidden on Space`).toBeFalsy();
		await getPage().waitForSelector('#space-click');
		await getPage().waitForSelector('#space-key');
	});
});
