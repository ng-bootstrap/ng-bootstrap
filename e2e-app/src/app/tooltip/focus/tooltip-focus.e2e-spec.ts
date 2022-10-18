import { test, setPage } from '../../../../baseTest';
import { focusElement } from '../../tools.po';
import { expectTooltipToBeClosed, expectTooltipToBeOpen } from '../tooltip.po';

test.use({ testURL: 'tooltip/focus', testSelector: 'h3:text("Tooltip focus")' });
test.beforeEach(async ({ page }) => setPage(page));

test.describe('Tooltip Focus', () => {
	test(`should work when triggers === 'focus'`, async () => {
		// focusin to show
		await focusElement('#btn-tooltip');
		await expectTooltipToBeOpen(`Tooltip should be visible when tooltip button gains focus`);

		// focusout to hide
		await focusElement('#btn-after');
		await expectTooltipToBeClosed(`Tooltip should not be visible when tooltip button looses focus`);
	});
});
