import { expect } from '@playwright/test';
import { isDropdownOpened, openDropdown } from '../dropdown.po';
import { test, getPage, setPage } from '../../../../baseTest';
import { sendKey } from '../../tools.po';

const SELECTOR_DROPDOWN = '[ngbDropdown]';
const SELECTOR_DROPDOWN_TOGGLE = '[ngbDropdownToggle]';
const SELECTOR_DROPDOWN_ITEM = (item: number) => `#item-${item}`;

const focusToggle = async () => {
	await getPage().focus(SELECTOR_DROPDOWN_TOGGLE);
	await expect(getPage().locator(SELECTOR_DROPDOWN_TOGGLE), `dropdown toggle should be focused`).toBeFocused();
};

const selectContainer = async (container: string) => await getPage().click(`#container-${container}`);
const selectWithItems = async (withItems: boolean) => await getPage().click(`#items-${withItems}`);

test.use({ testURL: 'dropdown/focus', testSelector: 'h3:text("Dropdown focus")' });
test.beforeEach(async ({ page }) => setPage(page));

test.describe(`Dropdown focus`, () => {
	const containers = ['inline', 'body'];
	containers.forEach((container) => {
		test.describe(`with container = ${container}`, () => {
			test.beforeEach(async () => {
				await selectContainer(container);
				await selectWithItems(true);
			});

			test(`should not be present on the page initially`, async () => {
				expect(await isDropdownOpened(), `Dropdown should be closed initially`).toBeFalsy();
			});

			test(`should open dropdown with 'Space' and focus toggling element`, async () => {
				await focusToggle();
				await sendKey(' ');
				await expect(getPage().locator(SELECTOR_DROPDOWN_TOGGLE), `Toggling element should be focused`).toBeFocused();
				expect(await isDropdownOpened(), `Dropdown should be opened on 'Space' press`).toBeTruthy();
			});

			test(`should open dropdown with 'Enter' and focus toggling element`, async () => {
				await focusToggle();
				await sendKey('Enter');
				await expect(getPage().locator(SELECTOR_DROPDOWN_TOGGLE), `Toggling element should be focused`).toBeFocused();
				expect(await isDropdownOpened(), `Dropdown should be opened on 'Enter' press`).toBeTruthy();
			});

			test(`should open dropdown with 'ArrowDown' and focus toggling element`, async () => {
				await focusToggle();
				await sendKey('ArrowDown');
				await expect(getPage().locator(SELECTOR_DROPDOWN_TOGGLE), `Toggling element should be focused`).toBeFocused();
				expect(await isDropdownOpened(), `Dropdown should be opened on 'ArrowDown' press`).toBeTruthy();
			});

			test(`should open dropdown with 'ArrowUp' and focus toggling element`, async () => {
				await focusToggle();
				await sendKey('ArrowUp');
				await expect(getPage().locator(SELECTOR_DROPDOWN_TOGGLE), `Toggling element should be focused`).toBeFocused();
				expect(await isDropdownOpened(), `Dropdown should be opened on 'ArrowUp' press`).toBeTruthy();
			});

			test(`should focus dropdown items with 'ArrowUp' / 'ArrowDown'`, async () => {
				// Open
				await openDropdown('Dropdown should be opened', SELECTOR_DROPDOWN, container === 'body');
				await expect(getPage().locator(SELECTOR_DROPDOWN_TOGGLE), `Toggling element should be focused`).toBeFocused();

				// Down -> first
				await sendKey('ArrowDown');
				await expect(
					getPage().locator(SELECTOR_DROPDOWN_ITEM(1)),
					`first dropdown item should be focused`,
				).toBeFocused();

				// Down -> second
				await sendKey('ArrowDown');
				await expect(
					getPage().locator(SELECTOR_DROPDOWN_ITEM(2)),
					`second dropdown item should be focused`,
				).toBeFocused();

				// Down -> second
				await sendKey('ArrowDown');
				await expect(
					getPage().locator(SELECTOR_DROPDOWN_ITEM(2)),
					`second dropdown item should stay focused`,
				).toBeFocused();

				// Up -> first
				await sendKey('ArrowUp');
				await expect(
					getPage().locator(SELECTOR_DROPDOWN_ITEM(1)),
					`first dropdown item should be focused`,
				).toBeFocused();

				// Up -> first
				await sendKey('ArrowUp');
				await expect(
					getPage().locator(SELECTOR_DROPDOWN_ITEM(1)),
					`first dropdown item should stay focused`,
				).toBeFocused();
			});

			test(`should focus dropdown first and last items with 'Home' / 'End'`, async () => {
				// Open
				await openDropdown('Dropdown should be opened', SELECTOR_DROPDOWN, container === 'body');
				await expect(getPage().locator(SELECTOR_DROPDOWN_TOGGLE), `Toggling element should be focused`).toBeFocused();

				// End -> last
				await sendKey('End');
				await expect(
					getPage().locator(SELECTOR_DROPDOWN_ITEM(2)),
					`last dropdown item should be focused`,
				).toBeFocused();

				// Home -> first
				await sendKey('Home');
				await expect(
					getPage().locator(SELECTOR_DROPDOWN_ITEM(1)),
					`first dropdown item should be focused`,
				).toBeFocused();
			});

			test(`should close dropdown with 'Escape' and focus toggling element (toggle was focused)`, async () => {
				await openDropdown('Dropdown should be opened', SELECTOR_DROPDOWN, container === 'body');
				await expect(getPage().locator(SELECTOR_DROPDOWN_TOGGLE), `Toggling element should be focused`).toBeFocused();

				await sendKey('Escape');
				expect(await isDropdownOpened(), `Dropdown should be closed on 'Escape' press`).toBeFalsy();
				await expect(getPage().locator(SELECTOR_DROPDOWN_TOGGLE), `Toggling element should be focused`).toBeFocused();
			});

			test(`should close dropdown with 'Escape' and focus toggling element (item was focused)`, async () => {
				await openDropdown('Dropdown should be opened', SELECTOR_DROPDOWN, container === 'body');
				await expect(getPage().locator(SELECTOR_DROPDOWN_TOGGLE), `Toggling element should be focused`).toBeFocused();

				await sendKey('ArrowDown');
				await expect(
					getPage().locator(SELECTOR_DROPDOWN_ITEM(1)),
					`first dropdown item should be focused`,
				).toBeFocused();

				await sendKey('Escape');
				expect(await isDropdownOpened(), `Dropdown should be closed on 'Escape' press`).toBeFalsy();
				await expect(getPage().locator(SELECTOR_DROPDOWN_TOGGLE), `Toggling element should be focused`).toBeFocused();
			});

			test(`should focus dropdown first item with Tab when dropdown is opened (toggle was focused)`, async ({
				browserName,
			}) => {
				test.skip(browserName === 'webkit');
				await openDropdown('Dropdown should be opened', SELECTOR_DROPDOWN, container === 'body');
				await expect(getPage().locator(SELECTOR_DROPDOWN_TOGGLE), `Toggling element should be focused`).toBeFocused();

				// Tab -> first
				await sendKey('Tab');
				await expect(
					getPage().locator(SELECTOR_DROPDOWN_ITEM(1)),
					`first dropdown item should be focused`,
				).toBeFocused();
			});

			test(`should close dropdown with 'Tab' when focus is moved to another element`, async () => {
				await openDropdown('Dropdown should be opened', SELECTOR_DROPDOWN, container === 'body');
				await expect(getPage().locator(SELECTOR_DROPDOWN_TOGGLE), `Toggling element should be focused`).toBeFocused();

				// Down -> first
				await sendKey('ArrowDown');
				await expect(
					getPage().locator(SELECTOR_DROPDOWN_ITEM(1)),
					`first dropdown item should be focused`,
				).toBeFocused();

				// Home -> last
				await sendKey('End');
				await expect(
					getPage().locator(SELECTOR_DROPDOWN_ITEM(2)),
					`second dropdown item should be focused`,
				).toBeFocused();

				// Tab -> another element
				await sendKey('Tab');
				expect(await isDropdownOpened(), `Dropdown should be closed`).toBeFalsy();
			});
		});
	});

	test.describe(`without ngbDropdownItems`, () => {
		test.beforeEach(async () => {
			await selectContainer('inline');
			await selectWithItems(false);
		});

		test(`should open dropdown with 'ArrowDown' and focus toggling element`, async () => {
			await focusToggle();
			await sendKey('ArrowDown');
			await expect(getPage().locator(SELECTOR_DROPDOWN_TOGGLE), `Toggling element should be focused`).toBeFocused();
			expect(await isDropdownOpened(), `Dropdown should be opened on 'ArrowDown' press`).toBeTruthy();
		});

		test(`should open dropdown with 'ArrowUp' and focus toggling element`, async () => {
			await focusToggle();
			await sendKey('ArrowUp');
			await expect(getPage().locator(SELECTOR_DROPDOWN_TOGGLE), `Toggling element should be focused`).toBeFocused();
			expect(await isDropdownOpened(), `Dropdown should be opened on 'ArrowUp' press`).toBeTruthy();
		});
	});
});
