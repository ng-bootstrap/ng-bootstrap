import { expect } from '@playwright/test';
import { sendKey } from '../../tools.po';
import { clickOnDay, SELECTOR_DAY } from '../datepicker.po';
import { test, getPage, setPage } from '../../../../baseTest';

const expectActive = async (selector: string) => {
	await getPage().waitForSelector(selector + ' >> .active');
	await expect(getPage().locator(selector), `active date should be focused`).toBeFocused();
};

test.use({ testURL: 'datepicker/multiple', testSelector: 'h3:text("Datepicker multiple")' });
test.beforeEach(async ({ page }) => setPage(page));

test.describe('Datepicker multiple instances', () => {
	test('the instance tapped should gain focus', async () => {
		await clickOnDay(new Date(2016, 7, 1), '#dp1');
		await sendKey('ArrowDown');
		await expectActive(SELECTOR_DAY(new Date(2016, 7, 8), '#dp1'));

		await clickOnDay(new Date(2016, 7, 1), '#dp2');
		await sendKey('ArrowDown');
		await expectActive(SELECTOR_DAY(new Date(2016, 7, 8), '#dp2'));
	});
});
