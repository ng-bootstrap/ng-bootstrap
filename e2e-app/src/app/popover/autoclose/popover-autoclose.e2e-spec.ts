import { expect } from '@playwright/test';
import { sendKey } from '../../tools.po';
import { test, getPage, setPage } from '../../../../baseTest';

const SELECTOR_OPEN_STATUS = '#open-status';
const SELECTOR_POPOVER = 'ngb-popover-window';

const clickOutside = async () => await getPage().click('#outside-button');
const rightClickOutside = async () => await getPage().click('#outside-button', { button: 'right' });

const clickInside = async () => await getPage().click('div.popover-body');
const rightClickInside = async () => await getPage().click('div.popover-body', { button: 'right' });

const selectAutoClose = async (type: string) => {
	await getPage().click('#autoclose-dropdown');
	await getPage().click(`#autoclose-${type}`);
};

const expectPopoverToBeOpen = async (message: string) => {
	await getPage().waitForSelector(SELECTOR_POPOVER);
	await expect(getPage().locator(SELECTOR_OPEN_STATUS), message).toHaveText('open');
};

const expectPopoverToBeClosed = async (message: string) => {
	await getPage().waitForSelector(SELECTOR_POPOVER, { state: 'detached' });
	await expect(getPage().locator(SELECTOR_OPEN_STATUS), message).toHaveText('closed');
};

const openPopover = async (message: string) => {
	await getPage().click('button[ngbPopover]');
	await expectPopoverToBeOpen(message);
};

test.use({ testURL: 'popover/autoclose', testSelector: 'h3:text("Popover autoclose")' });
test.beforeEach(async ({ page }) => setPage(page));

test.describe('Popover Autoclose', () => {
	test(`should not close popover on right clicks`, async () => {
		await openPopover(`Opening popover for right clicks`);

		await rightClickInside();
		await expectPopoverToBeOpen(`Popover should stay visible when right-clicking inside`);

		await rightClickOutside();
		await expectPopoverToBeOpen(`Popover should stay visible when right-clicking outside`);
	});

	test(`should work when autoClose === true`, async () => {
		await selectAutoClose('true');

		// escape
		await openPopover(`Opening popover for escape`);
		await sendKey('Escape');
		await expectPopoverToBeClosed(`Popover should be closed on ESC`);

		// outside click
		await openPopover(`Opening popover for outside click`);
		await clickOutside();
		await expectPopoverToBeClosed(`Popover should be closed on outside click`);

		// inside click
		await openPopover(`Opening popover for inside click`);
		await clickInside();
		await expectPopoverToBeClosed(`Popover should be closed on inside click`);
	});

	test(`should work when autoClose === false`, async () => {
		await selectAutoClose('false');

		// escape
		await openPopover(`Opening popover for escape`);
		await sendKey('Escape');
		await expectPopoverToBeOpen(`Popover should NOT be closed on ESC`);

		// outside click
		await clickOutside();
		await expectPopoverToBeOpen(`Popover should NOT be closed on outside click`);

		// inside click
		await clickInside();
		await expectPopoverToBeOpen(`Popover should NOT be closed on inside click`);
	});

	test(`should work when autoClose === 'outside'`, async () => {
		await selectAutoClose('outside');

		// escape
		await openPopover(`Opening popover for escape`);
		await sendKey('Escape');
		await expectPopoverToBeClosed(`Popover should be closed on ESC`);

		// outside click
		await openPopover(`Opening popover for outside click`);
		await clickOutside();
		await expectPopoverToBeClosed(`Popover should be closed on outside click`);

		// inside click
		await openPopover(`Opening popover for inside click`);
		await clickInside();
		await expectPopoverToBeOpen(`Popover should NOT be closed on inside click`);
	});

	test(`should work when autoClose === 'inside'`, async () => {
		await selectAutoClose('inside');

		// escape
		await openPopover(`Opening popover for escape`);
		await sendKey('Escape');
		await expectPopoverToBeClosed(`Popover should be closed on ESC`);

		// outside click
		await openPopover(`Opening popover for outside click`);
		await clickOutside();
		await expectPopoverToBeOpen(`Popover should NOT be closed on outside click`);

		// inside click
		await clickInside();
		await expectPopoverToBeClosed(`Popover should be closed on inside click`);
	});
});
