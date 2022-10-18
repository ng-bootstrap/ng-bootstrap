import { expect } from '@playwright/test';
import { sendKey } from '../../tools.po';
import { test, getPage, setPage } from '../../../../baseTest';
import {
	getTypeaheadValue,
	SELECTOR_TYPEAHEAD,
	SELECTOR_TYPEAHEAD_ITEMS,
	SELECTOR_TYPEAHEAD_WINDOW,
} from '../typeahead.po';

const SELECTOR_OUTSIDE_BUTTON = '#outside-button';
const SELECTOR_OPEN_STATUS = '#open-status';

const clickOutside = async () => await getPage().click(SELECTOR_OUTSIDE_BUTTON);
const rightClickOutside = async () => await getPage().click(SELECTOR_OUTSIDE_BUTTON, { button: 'right' });

const showHint = async (hint: boolean) => {
	await getPage().click('#hint-dropdown');
	await getPage().click(`#hint-${hint}`);
};

const expectTypeaheadToBeOpen = async (message: string) => {
	await getPage().waitForSelector(SELECTOR_TYPEAHEAD_WINDOW);
	await expect(getPage().locator(SELECTOR_OPEN_STATUS), message).toHaveText('open');
};

const expectTypeaheadToBeClosed = async (message: string) => {
	await getPage().waitForSelector(SELECTOR_TYPEAHEAD_WINDOW, { state: 'detached' });
	await expect(getPage().locator(SELECTOR_OPEN_STATUS), message).toHaveText('closed');
};

const setTypeaheadValue = async (text: string) => {
	await getPage().type(SELECTOR_TYPEAHEAD, text);
	await expectTypeaheadToBeOpen(`Typed ${text}, should be open`);
};

const openTypeahead = async () => {
	await setTypeaheadValue('o');
	const items = await getPage().$$(SELECTOR_TYPEAHEAD_ITEMS);
	expect(items.length).toBe(2);
};

test.describe('Typeahead Autoclose', () => {
	test.use({ testURL: 'typeahead/autoclose', testSelector: 'h3:text("Typeahead autoclose")' });
	test.beforeEach(async ({ page }) => setPage(page));

	test(`should not close typeahead on right clicks`, async () => {
		await openTypeahead();

		await getPage().click(SELECTOR_TYPEAHEAD, { button: 'right' });
		await expectTypeaheadToBeOpen(`Dropdown should stay visible when right-clicking on the input`);

		await getPage().click(`${SELECTOR_TYPEAHEAD_ITEMS}:first-child`, { button: 'right' });
		await expectTypeaheadToBeOpen(`Dropdown should stay visible when right-clicking inside`);

		await rightClickOutside();
		await expectTypeaheadToBeOpen(`Dropdown should stay visible when right-clicking outside`);
	});

	test(`should close typeahead on outside click and lose focus`, async () => {
		await openTypeahead();

		await clickOutside();
		await expectTypeaheadToBeClosed(`Dropdown should become hidden`);
		await expect(getPage().locator(SELECTOR_OUTSIDE_BUTTON), `Clicked button should be focused`).toBeFocused();
	});

	test(`should close typeahead on outside click and lose focus (with hint)`, async () => {
		await showHint(true);
		await openTypeahead();
		expect(await getTypeaheadValue(), `Hint should be shown`).toBe('one');

		await clickOutside();
		await expectTypeaheadToBeClosed(`Dropdown should become hidden`);
		await expect(getPage().locator(SELECTOR_OUTSIDE_BUTTON), `Clicked button should be focused`).toBeFocused();
		expect(await getTypeaheadValue(), `Hint should have been removed`).toBe('o');
	});

	test(`should not close typeahead on input click and stay focused`, async () => {
		await openTypeahead();

		await getPage().click(SELECTOR_TYPEAHEAD);
		await expectTypeaheadToBeOpen(`Dropdown should stay visible`);
		await expect(getPage().locator(SELECTOR_TYPEAHEAD), `Typeahead input should stay focused`).toBeFocused();
	});

	test(`should close typeahead on item click and stay focused`, async () => {
		await openTypeahead();

		await getPage().click(`${SELECTOR_TYPEAHEAD_ITEMS}:first-child`);
		await expectTypeaheadToBeClosed(`Dropdown should become hidden`);
		await expect(getPage().locator(SELECTOR_TYPEAHEAD), `Typeahead input should stay focused`).toBeFocused();
	});

	test(`should close typeahead on Escape and stay focused`, async () => {
		await openTypeahead();

		await sendKey('Escape');
		await expectTypeaheadToBeClosed(`Dropdown should become hidden`);
		await expect(getPage().locator(SELECTOR_TYPEAHEAD), `Typeahead input should stay focused`).toBeFocused();
	});

	test(`should close typeahead on Escape and stay focused (with hint)`, async () => {
		await showHint(true);
		await openTypeahead();
		expect(await getTypeaheadValue(), `Hint should be shown`).toBe('one');

		await sendKey('Escape');
		await expectTypeaheadToBeClosed(`Dropdown should become hidden`);
		await expect(getPage().locator(SELECTOR_TYPEAHEAD), `Typeahead input should stay focused`).toBeFocused();
		expect(await getTypeaheadValue(), `Hint should have been removed`).toBe('o');
	});
});
