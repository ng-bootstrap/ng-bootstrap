import { getPage, setPage, test } from '../../../../baseTest';
import { expectTooltipToBeClosed, expectTooltipToBeOpen } from '../tooltip.po';
import { sendKey } from '../../tools.po';

const hoverOutside = async () => await getPage().hover('#outside-button');
const clickOutside = async () => await getPage().click('#outside-button');
const clickTriggeringElement = async () => await getPage().click('#trigger');

const openTooltip = async (message: string) => {
	await getPage().hover('button[ngbTooltip]');
	await expectTooltipToBeOpen(message);
};

test.use({ testURL: 'tooltip/triggers', testSelector: 'h3:text("Tooltip triggers")' });
test.beforeEach(async ({ page }) => setPage(page));

test.describe('Tooltip Triggers', () => {
	test(`open close tooltip with hover`, async () => {
		await openTooltip(`Opening tooltip with hover`);

		await hoverOutside();
		await expectTooltipToBeClosed(`Tooltip close when hover outside`);
	});

	test(`should not close tooltip on mouseout after triggering element click`, async () => {
		await openTooltip(`Opening tooltip with hover`);

		await clickTriggeringElement();
		await expectTooltipToBeOpen(`Tooltip should stay visible when clicking on the triggering element`);

		await hoverOutside();
		await expectTooltipToBeOpen(`Tooltip should not close after hovering the outside element`);

		await clickOutside();
		await expectTooltipToBeClosed(`Tooltip should close after clicking the outside element`);
	});

	test(`should close tooltip on blur`, async ({ browserName }) => {
		test.skip(browserName === 'webkit');

		await getPage().click('#before');

		await sendKey('Tab');
		await expectTooltipToBeOpen(`Tooltip should have been opened with focus`);

		await sendKey('Tab');
		await expectTooltipToBeClosed(`Tooltip should close after focusing outside the element`);
	});

	test(`should not close tooltip on blur after triggering element click`, async ({ browserName }) => {
		test.skip(browserName === 'webkit');

		await getPage().click('#before');

		await sendKey('Tab');
		await expectTooltipToBeOpen(`Tooltip should have been opened with focus`);

		await clickTriggeringElement();
		await expectTooltipToBeOpen(`Tooltip should stay visible when clicking on the triggering element`);

		await sendKey('Tab');
		await expectTooltipToBeOpen(`Tooltip should not close after focusing outside the element`);

		await hoverOutside();
		await expectTooltipToBeClosed(`Tooltip should close after hovering the outside element`);
	});
});
