import { expect } from '@playwright/test';
import { getPage, setPage, test } from '../../../../baseTest';
import { sendKey } from '../../tools.po';
import {
	SELECTOR_MAX_LABEL,
	SELECTOR_MIN_LABEL,
	SELECTOR_SLIDER,
	SELECTOR_SLIDER_HANDLE,
	sliderHandleState,
	sliderProgressState,
} from '../slider.po';

test.use({ testURL: 'slider/range', testSelector: 'h3:text("Range slider with FormControl")' });
test.beforeEach(async ({ page }) => setPage(page));

const defaultExpectedHandleState: { [key: string]: string | null }[] = [
	{
		value: '30',
		min: '0',
		max: '100',
		text: '30',
		readonly: null,
		disabled: null,
		style: 'left: 30%;',
	},
	{
		value: '60',
		min: '0',
		max: '100',
		text: '60',
		readonly: null,
		disabled: null,
		style: 'left: 60%;',
	},
];

test.describe(`range slider with FormControl`, () => {
	test(`should initialize slider with default values`, async () => {
		expect(await sliderHandleState()).toEqual(defaultExpectedHandleState);

		expect((await sliderProgressState())[0]).toEqual('left: 30%; width: 30%;');
	});

	test(`should move the handle to correct tick on the slider click event`, async () => {
		const expectedState = { ...defaultExpectedHandleState[1] };
		expectedState.value = '81';
		expectedState.text = '81';
		expectedState.style = 'left: 81%;';

		const sliderLocator = getPage().locator(SELECTOR_SLIDER);
		const boundingBox = await sliderLocator.boundingBox();
		await sliderLocator.click({ position: { x: boundingBox!.x + boundingBox!.width * 0.8, y: 1 } });

		expect((await sliderHandleState())[1]).toEqual(expectedState);
		expect((await sliderProgressState())[0]).toEqual('left: 30%; width: 51%;');
	});

	test(`should interchange the handles on mouse drag event`, async () => {
		const expectedState = { ...defaultExpectedHandleState };
		expectedState[0].value = '76';
		expectedState[0].text = '76';
		expectedState[0].style = 'left: 76%;';

		const sliderHandleLocator = getPage().locator(SELECTOR_SLIDER_HANDLE);
		const sliderLocator = getPage().locator(SELECTOR_SLIDER);
		const boundingBox = await sliderLocator.boundingBox();
		await (await sliderHandleLocator.all()).at(0)!.dragTo(sliderLocator, {
			targetPosition: { x: boundingBox!.x + boundingBox!.width * 0.75, y: 1 },
		});

		expect((await sliderHandleState()).at(0)).toEqual(expectedState[0]);
		expect((await sliderHandleState()).at(1)).toEqual(expectedState[1]);
		expect((await sliderProgressState())[0]).toEqual('left: 60%; width: 16%;');
	});

	test(`should move handle on key strokes`, async () => {
		const expectedState = { ...defaultExpectedHandleState };
		expectedState[0].value = '0';
		expectedState[0].text = '0';
		expectedState[0].style = 'left: 0%;';

		const minLabelLocator = getPage().locator(SELECTOR_MIN_LABEL);
		const maxLabelLocator = getPage().locator(SELECTOR_MAX_LABEL);

		await (await getPage().locator(SELECTOR_SLIDER_HANDLE).all()).at(0)!.click();
		await sendKey('Home');

		expect((await sliderHandleState()).at(0)).toEqual(expectedState[0]);
		expect((await sliderHandleState()).at(1)).toEqual(expectedState[1]);
		expect((await sliderProgressState())[0]).toEqual('left: 0%; width: 60%;');

		expect(await minLabelLocator.isVisible()).toBe(false);
		expect(await maxLabelLocator.isVisible()).toBe(true);

		await sendKey('End');

		expectedState[0].text = '100';
		expectedState[0].value = '100';
		expectedState[0].style = 'left: 100%;';

		expect((await sliderHandleState()).at(0)).toEqual(expectedState[0]);
		expect((await sliderHandleState()).at(1)).toEqual(expectedState[1]);
		expect((await sliderProgressState())[0]).toEqual('left: 60%; width: 40%;');

		expect(await minLabelLocator.isVisible()).toBe(true);
		expect(await maxLabelLocator.isVisible()).toBe(false);
	});
});
