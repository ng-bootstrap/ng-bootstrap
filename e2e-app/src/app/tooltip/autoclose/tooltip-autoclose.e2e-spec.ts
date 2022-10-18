import { sendKey } from '../../tools.po';
import { test, getPage, setPage } from '../../../../baseTest';
import { expectTooltipToBeClosed, expectTooltipToBeOpen } from '../tooltip.po';

const clickOutside = async () => await getPage().click('#outside-button');
const rightClickOutside = async () => await getPage().click('#outside-button', { button: 'right' });

const clickInside = async () => await getPage().click('div.tooltip-inner');
const rightClickInside = async () => await getPage().click('div.tooltip-inner', { button: 'right' });

const selectAutoClose = async (type: string) => {
	await getPage().click('#autoclose-dropdown');
	await getPage().click(`#autoclose-${type}`);
};

const openTooltip = async (message: string) => {
	await getPage().click('button[ngbTooltip]');
	await expectTooltipToBeOpen(message);
};

test.use({ testURL: 'tooltip/autoclose', testSelector: 'h3:text("Tooltip autoclose")' });
test.beforeEach(async ({ page }) => setPage(page));

test.describe('Tooltip Autoclose', () => {
	test(`should not close tooltip on right clicks`, async () => {
		await openTooltip(`Opening tooltip for right clicks`);

		await rightClickInside();
		await expectTooltipToBeOpen(`Tooltip should stay visible when right-clicking inside`);

		await rightClickOutside();
		await expectTooltipToBeOpen(`Tooltip should stay visible when right-clicking outside`);
	});

	test(`should work when autoClose === true`, async () => {
		await selectAutoClose('true');

		// escape
		await openTooltip(`Opening tooltip for escape`);
		await sendKey('Escape');
		await expectTooltipToBeClosed(`Tooltip should be closed on ESC`);

		// outside click
		await openTooltip(`Opening tooltip for outside click`);
		await clickOutside();
		await expectTooltipToBeClosed(`Tooltip should be closed on outside click`);

		// inside click
		await openTooltip(`Opening tooltip for inside click`);
		await clickInside();
		await expectTooltipToBeClosed(`Tooltip should be closed on date selection`);
	});

	test(`should work when autoClose === false`, async () => {
		await selectAutoClose('false');

		// escape
		await openTooltip(`Opening tooltip for escape`);
		await sendKey('Escape');
		await expectTooltipToBeOpen(`Tooltip should NOT be closed on ESC`);

		// outside click
		await clickOutside();
		await expectTooltipToBeOpen(`Tooltip should NOT be closed on outside click`);

		// inside click
		await clickInside();
		await expectTooltipToBeOpen(`Tooltip should NOT be closed on date selection`);
	});

	test(`should work when autoClose === 'outside'`, async () => {
		await selectAutoClose('outside');

		// escape
		await openTooltip(`Opening tooltip for escape`);
		await sendKey('Escape');
		await expectTooltipToBeClosed(`Tooltip should be closed on ESC`);

		// outside click
		await openTooltip(`Opening tooltip for outside click`);
		await clickOutside();
		await expectTooltipToBeClosed(`Tooltip should be closed on outside click`);

		// date selection
		await openTooltip(`Opening tooltip for date selection`);
		await clickInside();
		await expectTooltipToBeOpen(`Tooltip should NOT be closed on date selection`);
	});

	test(`should work when autoClose === 'inside'`, async () => {
		await selectAutoClose('inside');

		// escape
		await openTooltip(`Opening tooltip for escape`);
		await sendKey('Escape');
		await expectTooltipToBeClosed(`Tooltip should be closed on ESC`);

		// outside click
		await openTooltip(`Opening tooltip for outside click`);
		await clickOutside();
		await expectTooltipToBeOpen(`Tooltip should NOT be closed on outside click`);

		// date selection
		await clickInside();
		await expectTooltipToBeClosed(`Tooltip should be closed on date selection`);
	});
});
