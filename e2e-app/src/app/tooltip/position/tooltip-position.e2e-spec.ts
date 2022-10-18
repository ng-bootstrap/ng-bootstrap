import { expect } from '@playwright/test';
import { getBoundingBox } from '../../tools.po';
import { test, getPage, setPage } from '../../../../baseTest';
import { SELECTOR_TOOLTIP } from '../tooltip.po';

const selectPosition = async (position: string) => await getPage().click(`#flex-${position}`);

test.use({ testURL: 'tooltip/position', testSelector: 'h3:text("Tooltip positioning")' });
test.beforeEach(async ({ page }) => setPage(page));

test.describe('Tooltip Position', () => {
	const expectTooltipsPosition = async (type: string, expectedPlacement: string, excludedPlacements: string[] = []) => {
		const SELECTOR_BUTTON = `#btn-${type}`;
		await getPage().click(SELECTOR_BUTTON);

		const btnBox = await getBoundingBox(SELECTOR_BUTTON);
		const tooltipBox = await getBoundingBox(SELECTOR_TOOLTIP);

		const [primary, secondary] = expectedPlacement.split('-');
		const classNames = await getPage().getAttribute(SELECTOR_TOOLTIP, 'class');
		expect(classNames, 'Missing primary class').toContain(`bs-tooltip-${primary}`);
		if (secondary) {
			expect(classNames, 'Missing secondary class').toContain(`bs-tooltip-${primary}-${secondary}`);
		}

		excludedPlacements.forEach((placement) => {
			expect(classNames, 'Unexpected class').not.toContain(`bs-tooltip-${placement}`);
		});

		let yDiff = 0,
			xDiff = 0;

		if (primary === 'top') {
			yDiff = tooltipBox.y + tooltipBox.height - btnBox.y;
			if (secondary === 'start') {
				xDiff = tooltipBox.x - btnBox.x;
			} else if (secondary === 'end') {
				xDiff = tooltipBox.x + tooltipBox.width - (btnBox.x + btnBox.width);
			} else {
				xDiff = tooltipBox.x + tooltipBox.width / 2 - (btnBox.x + btnBox.width / 2);
			}
		}

		if (primary === 'start') {
			yDiff = tooltipBox.y + tooltipBox.height / 2 - (btnBox.y + btnBox.height / 2);
			xDiff = tooltipBox.x + tooltipBox.width - btnBox.x;
		}

		if (primary === 'end') {
			yDiff = tooltipBox.y + tooltipBox.height / 2 - (btnBox.y + btnBox.height / 2);
			xDiff = tooltipBox.x - (btnBox.x + btnBox.width);
		}

		expect(
			Math.abs(yDiff),
			`Tooltip top positionning for expected placement '${expectedPlacement}'`,
		).toBeLessThanOrEqual(1);
		expect(
			Math.abs(xDiff),
			`Tooltip left positionning for expected placement '${expectedPlacement}'`,
		).toBeLessThanOrEqual(1);

		// Close the tooltip
		await getPage().click(SELECTOR_BUTTON);
	};

	test(`should be well positioned on the left edge`, async () => {
		await selectPosition('start');
		await expectTooltipsPosition('normal', 'end');
		await expectTooltipsPosition('innerHtml', 'top-start');
		await expectTooltipsPosition('body-off', 'end');
		await expectTooltipsPosition('fixed', 'top-start');
	});

	test(`should be well positioned on the center`, async () => {
		await selectPosition('center');
		await expectTooltipsPosition('normal', 'top');
		await expectTooltipsPosition('innerHtml', 'top');
		await expectTooltipsPosition('body-off', 'top');
		await expectTooltipsPosition('fixed', 'top');
	});

	test(`should be well positioned on the right edge`, async () => {
		await selectPosition('end');
		await expectTooltipsPosition('normal', 'start');
		await expectTooltipsPosition('innerHtml', 'top-end');
		await expectTooltipsPosition('body-off', 'start');
		await expectTooltipsPosition('fixed', 'top-end');
	});

	test(`should be positioned at the first placement by default`, async () => {
		await selectPosition('start');
		await expectTooltipsPosition('default', 'start', ['start-bottom']);
	});
});
