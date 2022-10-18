import { expect } from '@playwright/test';
import { getBoundingBox } from '../../tools.po';
import { test, getPage, setPage } from '../../../../baseTest';
import { openDropdown } from '../dropdown.po';
import { waitForModalCount } from '../../modal/modal.po';

const removeFromDom = async () => await getPage().click('#isInDom-false');

const toggleContainer = async (container: null | 'body') => await getPage().click(`#container-${container || 'null'}`);

const togglePlacement = async (placement: 'top-start' | 'bottom-start' | 'top-end' | 'bottom-end') => {
	await getPage().click(`#placement-${placement}`);
};

test.use({ testURL: 'dropdown/position', testSelector: 'h3:text("Dropdown positioning")' });
test.beforeEach(async ({ page }) => setPage(page));

['#dropdown', '#dropdownWithTemplate'].forEach((selector) => {
	test.describe(`Dropdown Position for id ${selector}`, () => {
		const expectSamePositions = async (placement) => {
			// Setup start conditions
			await toggleContainer(null);
			await togglePlacement(placement);

			await getPage().waitForSelector(`${selector} >> ${selector}Menu`);
			const inlineBox = await getBoundingBox(`${selector} >> ${selector}Menu`);

			// Append to body
			await toggleContainer('body');
			await getPage().waitForSelector(`body > div > ${selector}Menu`);
			const bodyBox = await getBoundingBox(`body > div > ${selector}Menu`);

			for (const [key, value] of Object.entries(inlineBox)) {
				expect(
					bodyBox[key],
					`Position ${key} should give the same results when placed on ${placement}`,
				).toBeGreaterThanOrEqual(value - 1);
				expect(
					bodyBox[key],
					`Position '${key}' should give the same results when placed on ${placement}`,
				).toBeLessThanOrEqual(value + 1);
			}

			// Reset
			await toggleContainer(null);
		};

		test.afterEach(async () => {
			await waitForModalCount(0);
		});

		test(`should keep the same position when appended to widget or body`, async () => {
			await openDropdown('should open dropdown', selector);

			await expectSamePositions('bottom-start');
			await expectSamePositions('top-start');
			await expectSamePositions('bottom-end');
			await expectSamePositions('top-end');
		});

		test(`should be removed on destroy`, async () => {
			await openDropdown('should open dropdown', selector);

			await removeFromDom();
			await getPage().waitForSelector(`${selector}Menu`, { state: 'detached' });
		});

		test(`should have the body container added and removed`, async () => {
			await toggleContainer('body');
			await openDropdown('should open dropdown', selector, true);

			await togglePlacement('bottom-start');
			await getPage().waitForSelector(`body > div > ${selector}Menu`);

			await togglePlacement('top-start');
			await getPage().waitForSelector(`body > div > ${selector}Menu`);

			await toggleContainer(null);
			await getPage().waitForSelector(`body > div > ${selector}Menu`, { state: 'detached' });
		});
	});
});
