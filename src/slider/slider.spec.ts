import { Key } from '../util/key';
import { createSlider, SliderState } from './slider';
import { NgbSliderConfig } from './slider-config';

function getStateValues(sliderState: SliderState) {
	return {
		_dirtyValue: sliderState._dirtyValue(),
		minValue: sliderState.minValue(),
		maxValue: sliderState.maxValue(),
		stepSize: sliderState.stepSize(),
		handleValue: sliderState.handleValue(),
		minLabelWidth: sliderState.minLabelWidth(),
		maxLabelWidth: sliderState.maxLabelWidth(),
		minValueLabelDisplay: sliderState.minValueLabelDisplay(),
		maxValueLabelDisplay: sliderState.maxValueLabelDisplay(),
		sliderDomRect: sliderState.sliderDomRect(),
		minLabelDomRect: sliderState.minLabelDomRect(),
		maxLabelDomRect: sliderState.maxLabelDomRect(),
		handleValuePercent: sliderState.handleValuePercent(),
		disabled: sliderState.disabled(),
		readonly: sliderState.readonly(),
	};
}

const defaultStateValues = {
	_dirtyValue: 30,
	minValue: 0,
	maxValue: 100,
	stepSize: 1,
	handleValue: 30,
	minLabelWidth: 3,
	maxLabelWidth: 3,
	minValueLabelDisplay: 'visible',
	maxValueLabelDisplay: 'visible',
	sliderDomRect: new DOMRect(10, 0, 100, 4),
	minLabelDomRect: new DOMRect(10, 5, 3, 4),
	maxLabelDomRect: new DOMRect(100, 5, 3, 4),
	handleValuePercent: 30,
	disabled: false,
	readonly: false,
};

const initializeSliderWithRectangles = (config?: Partial<NgbSliderConfig>) => {
	const slider = createSlider(config);

	slider.state.sliderDomRect.set(new DOMRect(10, 0, 100, 4));
	slider.state.minLabelDomRect.set(new DOMRect(10, 5, 3, 4));
	slider.state.maxLabelDomRect.set(new DOMRect(100, 5, 3, 4));
	return slider;
};

describe(`ngb-slider`, () => {
	it(`should create the default configuration for the model`, () => {
		const slider = initializeSliderWithRectangles();

		expect(getStateValues(slider.state)).toEqual(defaultStateValues);
	});

	it(`should create the configuration for the model based on the input`, () => {
		const slider = initializeSliderWithRectangles({ minValue: 100, maxValue: 200, stepSize: 25, value: 150 });

		const expectedStateValue = { ...defaultStateValues };
		expectedStateValue._dirtyValue = 150;
		expectedStateValue.minValue = 100;
		expectedStateValue.maxValue = 200;
		expectedStateValue.stepSize = 25;
		expectedStateValue.handleValue = 150;
		expectedStateValue.handleValuePercent = 50;

		expect(getStateValues(slider.state)).toEqual(expectedStateValue);
	});

	it(`should set minValue as min between min, max initial values and maxValue as max accordingly`, () => {
		const slider = initializeSliderWithRectangles({ minValue: 100, maxValue: 0 });

		expect(getStateValues(slider.state)).toEqual(defaultStateValues);
	});

	it(`should set min as defaultMinValue and max as defaultMaxValue if provided values are the same`, () => {
		const slider = initializeSliderWithRectangles({ minValue: 100, maxValue: 100 });

		expect(getStateValues(slider.state)).toEqual(defaultStateValues);
	});

	it(`should set the step as 1 if the provided value is 0`, () => {
		const slider = initializeSliderWithRectangles({ stepSize: 0 });

		expect(getStateValues(slider.state)).toEqual(defaultStateValues);
	});

	it(`should snap the value to the valid step`, () => {
		const slider = initializeSliderWithRectangles({ minValue: 0, maxValue: 100, stepSize: 25, value: 60 });

		const expectedStateValue = { ...defaultStateValues };
		expectedStateValue._dirtyValue = 60;
		expectedStateValue.stepSize = 25;
		expectedStateValue.handleValue = 50;
		expectedStateValue.handleValuePercent = 50;

		expect(getStateValues(slider.state)).toEqual(expectedStateValue);
	});

	it(`should set handle to 0 and hide the min label when clicked outside the slider on the left side`, () => {
		const slider = initializeSliderWithRectangles();

		slider.actions.adjustCoordinate(0);

		const expectedStateValue = { ...defaultStateValues };
		expectedStateValue._dirtyValue = -10;
		expectedStateValue.handleValue = 0;
		expectedStateValue.minValueLabelDisplay = 'hidden';
		expectedStateValue.handleValuePercent = 0;

		expect(getStateValues(slider.state)).toEqual(expectedStateValue);
	});

	it(`should set handle to 100 and hide the max label when clicked outside the slider on the right side`, () => {
		const slider = initializeSliderWithRectangles();

		slider.actions.adjustCoordinate(120);

		const expectedStateValue = { ...defaultStateValues };
		expectedStateValue._dirtyValue = 110.00000000000001;
		expectedStateValue.handleValue = 100;
		expectedStateValue.maxValueLabelDisplay = 'hidden';
		expectedStateValue.handleValuePercent = 100;

		expect(getStateValues(slider.state)).toEqual(expectedStateValue);
	});

	it(`should set handle to a proper percent when clicked inside the slider`, () => {
		const slider = initializeSliderWithRectangles();

		slider.actions.adjustCoordinate(70);

		const expectedStateValue = { ...defaultStateValues };
		expectedStateValue._dirtyValue = 60;
		expectedStateValue.handleValue = 60;
		expectedStateValue.handleValuePercent = 60;

		expect(getStateValues(slider.state)).toEqual(expectedStateValue);
	});

	it(`should not go below minimum on arrow left and down arrow key stroke`, () => {
		const slider = initializeSliderWithRectangles({
			value: 0,
		});

		slider.actions.onKeydown(Key.ArrowDown);

		const expectedStateValue = { ...defaultStateValues };
		expectedStateValue._dirtyValue = -1;
		expectedStateValue.handleValue = 0;
		expectedStateValue.handleValuePercent = 0;
		expectedStateValue.minValueLabelDisplay = 'hidden';

		expect(getStateValues(slider.state)).toEqual(expectedStateValue);

		slider.actions.onKeydown(Key.ArrowLeft);

		expect(getStateValues(slider.state)).toEqual(expectedStateValue);
	});

	it(`should decrease the handle value on left and down arrow key stroke`, () => {
		const slider = initializeSliderWithRectangles({
			value: 50,
		});

		slider.actions.onKeydown(Key.ArrowDown);

		const expectedStateValue = { ...defaultStateValues };
		expectedStateValue._dirtyValue = 49;
		expectedStateValue.handleValue = 49;
		expectedStateValue.handleValuePercent = 49;

		expect(getStateValues(slider.state)).toEqual(expectedStateValue);

		slider.actions.onKeydown(Key.ArrowLeft);

		expectedStateValue._dirtyValue = 48;
		expectedStateValue.handleValue = 48;
		expectedStateValue.handleValuePercent = 48;

		expect(getStateValues(slider.state)).toEqual(expectedStateValue);
	});

	it(`should not go above maximum on arrow right and up arrow key stroke`, () => {
		const slider = initializeSliderWithRectangles({
			value: 100,
		});

		slider.actions.onKeydown(Key.ArrowUp);

		const expectedStateValue = { ...defaultStateValues };
		expectedStateValue._dirtyValue = 101;
		expectedStateValue.handleValue = 100;
		expectedStateValue.handleValuePercent = 100;
		expectedStateValue.minLabelWidth = 3;
		expectedStateValue.maxLabelWidth = 3;
		expectedStateValue.maxValueLabelDisplay = 'hidden';

		expect(getStateValues(slider.state)).toEqual(expectedStateValue);

		slider.actions.onKeydown(Key.ArrowRight);

		expect(getStateValues(slider.state)).toEqual(expectedStateValue);
	});

	it(`should increase the handle value on right and up arrow key stroke`, () => {
		const slider = initializeSliderWithRectangles({
			value: 50,
		});

		slider.actions.onKeydown(Key.ArrowUp);

		const expectedStateValue = { ...defaultStateValues };
		expectedStateValue._dirtyValue = 51;
		expectedStateValue.handleValue = 51;
		expectedStateValue.handleValuePercent = 51;

		expect(getStateValues(slider.state)).toEqual(expectedStateValue);

		slider.actions.onKeydown(Key.ArrowRight);

		expectedStateValue._dirtyValue = 52;
		expectedStateValue.handleValue = 52;
		expectedStateValue.handleValuePercent = 52;

		expect(getStateValues(slider.state)).toEqual(expectedStateValue);
	});

	it(`should jump to minimum slider value on home key stroke`, () => {
		const slider = initializeSliderWithRectangles();

		slider.actions.onKeydown(Key.Home);

		const expectedStateValue = { ...defaultStateValues };
		expectedStateValue._dirtyValue = 0;
		expectedStateValue.handleValue = 0;
		expectedStateValue.handleValuePercent = 0;
		expectedStateValue.minValueLabelDisplay = 'hidden';

		expect(getStateValues(slider.state)).toEqual(expectedStateValue);
	});

	it(`should jump to maximum slider value on end key stroke`, () => {
		const slider = initializeSliderWithRectangles();

		slider.actions.onKeydown(Key.End);

		const expectedStateValue = { ...defaultStateValues };
		expectedStateValue._dirtyValue = 100;
		expectedStateValue.handleValue = 100;
		expectedStateValue.handleValuePercent = 100;
		expectedStateValue.maxValueLabelDisplay = 'hidden';

		expect(getStateValues(slider.state)).toEqual(expectedStateValue);
	});

	it(`should not change handle with actions if the slider is disabled`, () => {
		const slider = initializeSliderWithRectangles({ disabled: true });

		const expectedStateValue = { ...defaultStateValues };
		expectedStateValue.disabled = true;

		expect(getStateValues(slider.state)).toEqual(expectedStateValue);

		slider.actions.adjustCoordinate(0);

		expect(getStateValues(slider.state)).toEqual(expectedStateValue);

		slider.actions.onKeydown(Key.Home);

		expect(getStateValues(slider.state)).toEqual(expectedStateValue);
	});

	it(`should not change handle with actions if the slider is readonly`, () => {
		const slider = initializeSliderWithRectangles({ readonly: true });

		const expectedStateValue = { ...defaultStateValues };
		expectedStateValue.readonly = true;

		expect(getStateValues(slider.state)).toEqual(expectedStateValue);

		slider.actions.adjustCoordinate(0);

		expect(getStateValues(slider.state)).toEqual(expectedStateValue);

		slider.actions.onKeydown(Key.Home);

		expect(getStateValues(slider.state)).toEqual(expectedStateValue);
	});
});
