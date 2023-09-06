import { expect } from '@playwright/test';
import { getPage, setPage, test } from '../../../../baseTest';
import { sendKey } from '../../tools.po';
import {
	SELECTOR_MAX_LABEL_VERTICAL,
	SELECTOR_MIN_LABEL_VERTICAL,
	SELECTOR_SLIDER,
	SELECTOR_SLIDER_HANDLE,
	sliderHandleState,
	sliderProgressState,
} from '../slider.po';

test.use({ testURL: 'slider/vertical', testSelector: 'h3:text("Vertical slider with FormControl")' });
test.beforeEach(async ({ page }) => setPage(page));

const defaultExpectedHandleState: { [key: string]: string | null }[] = [
	{
		value: '30',
		min: '0',
		max: '100',
		text: '30',
		readonly: null,
		disabled: null,
		style: 'top: 70%;',
	},
	{
		value: '60',
		min: '0',
		max: '100',
		text: '60',
		readonly: null,
		disabled: null,
		style: 'top: 40%;',
	},
];

test.describe(`vertical slider with FormControl`, () => {
	test(`should initialize slider with default values`, async () => {
		expect(await sliderHandleState()).toEqual(defaultExpectedHandleState);

		expect((await sliderProgressState())[0]).toEqual('left: 0%; bottom: 30%; width: 100%; height: 30%;');
	});

	test(`should move the handle to correct tick on the slider click event`, async () => {
		const expectedState = { ...defaultExpectedHandleState[1] };
		expectedState.value = '80';
		expectedState.text = '80';
		expectedState.style = 'top: 20%;';

		const sliderLocator = getPage().locator(SELECTOR_SLIDER);
		const boundingBox = await sliderLocator.boundingBox();
		console.log(boundingBox!.y, boundingBox!.height, boundingBox!.y + boundingBox!.height);
		await sliderLocator.click({ position: { y: boundingBox!.height * 0.2, x: 1 } });

		expect((await sliderHandleState())[1]).toEqual(expectedState);
		expect((await sliderProgressState())[0]).toEqual('left: 0%; bottom: 30%; width: 100%; height: 50%;');
	});

	test(`should move handle on key strokes`, async () => {
		const expectedState = { ...defaultExpectedHandleState };
		expectedState[0].value = '0';
		expectedState[0].text = '0';
		expectedState[0].style = 'top: 100%;';

		const minLabelLocator = getPage().locator(SELECTOR_MIN_LABEL_VERTICAL);
		const maxLabelLocator = getPage().locator(SELECTOR_MAX_LABEL_VERTICAL);

		await (await getPage().locator(SELECTOR_SLIDER_HANDLE).all()).at(0)!.click();
		await sendKey('Home');

		expect((await sliderHandleState()).at(0)).toEqual(expectedState[0]);
		expect((await sliderHandleState()).at(1)).toEqual(expectedState[1]);
		expect((await sliderProgressState())[0]).toEqual('left: 0%; bottom: 0%; width: 100%; height: 60%;');

		expect(await minLabelLocator.isVisible()).toBe(false);
		expect(await maxLabelLocator.isVisible()).toBe(true);

		await sendKey('End');

		expectedState[0].text = '100';
		expectedState[0].value = '100';
		expectedState[0].style = 'top: 0%;';

		expect((await sliderHandleState()).at(0)).toEqual(expectedState[0]);
		expect((await sliderHandleState()).at(1)).toEqual(expectedState[1]);
		expect((await sliderProgressState())[0]).toEqual('left: 0%; bottom: 60%; width: 100%; height: 40%;');

		expect(await minLabelLocator.isVisible()).toBe(true);
		expect(await maxLabelLocator.isVisible()).toBe(false);
	});
});
