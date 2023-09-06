import { expect } from '@playwright/test';
import { getPage, setPage, test } from '../../../../baseTest';
import { sendKey } from '../../tools.po';
import {
	SELECTOR_MAX_LABEL,
	SELECTOR_MIN_LABEL,
	SELECTOR_SLIDER,
	SELECTOR_SLIDER_HANDLE,
	sliderHandleState,
} from '../slider.po';

test.use({ testURL: 'slider/basic', testSelector: 'h3:text("Basic slider with FormControl")' });
test.beforeEach(async ({ page }) => setPage(page));

const defaultExpectedState: { [key: string]: string | null } = {
	value: '50',
	min: '0',
	max: '100',
	text: '50',
	readonly: null,
	disabled: null,
	style: 'left: 50%;',
};

const SELECTOR_DISABLED_TOGGLE = 'input[id=disabled]';
const SELECTOR_READONLY_TOGGLE = 'input[id=readonly]';

test.describe(`basic slider with FormControl`, () => {
	test(`should initialize slider with default values`, async () => {
		expect((await sliderHandleState())[0]).toEqual(defaultExpectedState);
	});

	test(`should snap the handle to correct tick on the slider click event`, async () => {
		const expectedState = { ...defaultExpectedState };
		expectedState.value = '75';
		expectedState.text = '75';
		expectedState.style = 'left: 75%;';

		const sliderLocator = getPage().locator(SELECTOR_SLIDER);
		const boundingBox = await sliderLocator.boundingBox();
		await sliderLocator.click({ position: { x: boundingBox!.x + boundingBox!.width * 0.8, y: 1 } });

		expect((await sliderHandleState())[0]).toEqual(expectedState);
	});

	test(`should snap the handle on mouse drag event`, async () => {
		const expectedState = { ...defaultExpectedState };
		expectedState.value = '75';
		expectedState.text = '75';
		expectedState.style = 'left: 75%;';

		const sliderHandleLocator = getPage().locator(SELECTOR_SLIDER_HANDLE);
		const sliderLocator = getPage().locator(SELECTOR_SLIDER);
		const boundingBox = await sliderLocator.boundingBox();
		await sliderHandleLocator.dragTo(sliderLocator, {
			targetPosition: { x: boundingBox!.x + boundingBox!.width * 0.8, y: 1 },
		});

		expect((await sliderHandleState())[0]).toEqual(expectedState);
	});

	test(`should move handle on key strokes`, async () => {
		const expectedState = { ...defaultExpectedState };
		expectedState.value = '0';
		expectedState.text = '0';
		expectedState.style = 'left: 0%;';

		const minLabelLocator = getPage().locator(SELECTOR_MIN_LABEL);
		const maxLabelLocator = getPage().locator(SELECTOR_MAX_LABEL);

		await getPage().locator(SELECTOR_SLIDER_HANDLE).click();
		await sendKey('Home');

		expect((await sliderHandleState())[0]).toEqual(expectedState);

		expect(await minLabelLocator.isVisible()).toBe(false);
		expect(await maxLabelLocator.isVisible()).toBe(true);

		await sendKey('End');

		expectedState.text = '100';
		expectedState.value = '100';
		expectedState.style = 'left: 100%;';

		expect((await sliderHandleState())[0]).toEqual(expectedState);

		expect(await minLabelLocator.isVisible()).toBe(true);
		expect(await maxLabelLocator.isVisible()).toBe(false);
	});

	test(`should render slider disabled when passing the 'disabled' option`, async () => {
		const sliderHandleLocator = getPage().locator(SELECTOR_SLIDER_HANDLE);

		await expect(sliderHandleLocator).toBeEnabled();

		await getPage().locator(SELECTOR_DISABLED_TOGGLE).click();

		await expect(sliderHandleLocator).toBeDisabled();

		await getPage().locator(SELECTOR_DISABLED_TOGGLE).click();

		await expect(sliderHandleLocator).toBeEnabled();
	});

	test(`should ignore all the actions when passing the 'readonly' option`, async () => {
		const expectedState = { ...defaultExpectedState };
		expectedState.readonly = 'true';

		await getPage().locator(SELECTOR_READONLY_TOGGLE).click();

		const sliderHandleLocator = getPage().locator(SELECTOR_SLIDER_HANDLE);
		const sliderLocator = getPage().locator(SELECTOR_SLIDER);
		const boundingBox = await sliderLocator.boundingBox();
		await sliderLocator.click({ position: { x: boundingBox!.x + boundingBox!.width * 0.8, y: 1 } });

		expect((await sliderHandleState())[0]).toEqual(expectedState);

		await expect(sliderHandleLocator).toBeEnabled();

		await getPage().locator(SELECTOR_READONLY_TOGGLE).click();

		await sliderLocator.click({ position: { x: boundingBox!.x + boundingBox!.width * 0.8, y: 1 } });

		expectedState.value = '75';
		expectedState.text = '75';
		expectedState.style = 'left: 75%;';
		expectedState.readonly = null;

		expect((await sliderHandleState())[0]).toEqual(expectedState);
	});
});
