import { Key } from '../util/key';
import { createSlider, SliderState } from './slider';
import { NgbSliderConfig } from './slider-config';

function getStateValues(sliderState: SliderState) {
	return {
		_dirtyValue: sliderState._dirtyValue(),
		minValue: sliderState.minValue(),
		maxValue: sliderState.maxValue(),
		stepSize: sliderState.stepSize(),
		cleanValue: sliderState.cleanValue(),
		sortedCleanValue: sliderState.sortedCleanValue(),
		minLabelWidth: sliderState.minLabelWidth(),
		maxLabelWidth: sliderState.maxLabelWidth(),
		minValueLabelDisplay: sliderState.minValueLabelDisplay(),
		maxValueLabelDisplay: sliderState.maxValueLabelDisplay(),
		mixLabelDisplay: sliderState.mixLabelDisplay(),
		sliderDomRect: sliderState.sliderDomRect(),
		minLabelDomRect: sliderState.minLabelDomRect(),
		maxLabelDomRect: sliderState.maxLabelDomRect(),
		cleanValuePercent: sliderState.cleanValuePercent(),
		sortedCleanValuePercent: sliderState.sortedCleanValuePercent(),
		disabled: sliderState.disabled(),
		readonly: sliderState.readonly(),
		vertical: sliderState.vertical(),
	};
}

const defaultStateValues = {
	_dirtyValue: [30],
	minValue: 0,
	maxValue: 100,
	stepSize: 1,
	cleanValue: [30],
	sortedCleanValue: [30],
	minLabelWidth: 3,
	maxLabelWidth: 3,
	minValueLabelDisplay: 'visible',
	maxValueLabelDisplay: 'visible',
	mixLabelDisplay: 'hidden',
	sliderDomRect: new DOMRect(10, 0, 100, 4),
	minLabelDomRect: new DOMRect(10, 5, 3, 4),
	maxLabelDomRect: new DOMRect(100, 5, 3, 4),
	cleanValuePercent: [30],
	sortedCleanValuePercent: [30],
	disabled: false,
	readonly: false,
	vertical: false,
};

const initializeSliderWithRectangles = (config?: Partial<NgbSliderConfig>) => {
	const slider = createSlider(config);

	slider.state.sliderDomRect.set(new DOMRect(10, 0, 100, 4));
	slider.state.minLabelDomRect.set(new DOMRect(10, 5, 3, 4));
	slider.state.maxLabelDomRect.set(new DOMRect(100, 5, 3, 4));
	return slider;
};

const initializeSliderWithRectanglesVertical = (config?: Partial<NgbSliderConfig>) => {
	const slider = createSlider({ ...config, vertical: true });

	slider.state.sliderDomRect.set(new DOMRect(10, 0, 4, 100));
	slider.state.minLabelDomRect.set(new DOMRect(20, 0, 3, 4));
	slider.state.maxLabelDomRect.set(new DOMRect(20, 100, 3, 4));
	return slider;
};

describe(`ngb-slider basic`, () => {
	it(`should create the default configuration for the model`, () => {
		const slider = initializeSliderWithRectangles();

		expect(getStateValues(slider.state)).toEqual(defaultStateValues);
	});

	it(`should create the configuration for the model based on the input`, () => {
		const slider = initializeSliderWithRectangles({ minValue: 100, maxValue: 200, stepSize: 25, sliderValues: [150] });

		const expectedStateValue = { ...defaultStateValues };
		expectedStateValue._dirtyValue = [150];
		expectedStateValue.minValue = 100;
		expectedStateValue.maxValue = 200;
		expectedStateValue.stepSize = 25;
		expectedStateValue.cleanValue = [150];
		expectedStateValue.cleanValuePercent = [50];
		expectedStateValue.sortedCleanValue = [150];
		expectedStateValue.sortedCleanValuePercent = [50];

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
		const slider = initializeSliderWithRectangles({ minValue: 0, maxValue: 100, stepSize: 25, sliderValues: [60] });

		const expectedStateValue = { ...defaultStateValues };
		expectedStateValue._dirtyValue = [60];
		expectedStateValue.stepSize = 25;
		expectedStateValue.cleanValue = [50];
		expectedStateValue.cleanValuePercent = [50];
		expectedStateValue.sortedCleanValue = [50];
		expectedStateValue.sortedCleanValuePercent = [50];

		expect(getStateValues(slider.state)).toEqual(expectedStateValue);
	});

	it(`should set handle to 0 and hide the min label when clicked outside the slider on the left side`, () => {
		const slider = initializeSliderWithRectangles();

		slider.actions.adjustCoordinate(0);

		const expectedStateValue = { ...defaultStateValues };
		expectedStateValue._dirtyValue = [-10];
		expectedStateValue.cleanValue = [0];
		expectedStateValue.minValueLabelDisplay = 'hidden';
		expectedStateValue.cleanValuePercent = [0];
		expectedStateValue.sortedCleanValue = [0];
		expectedStateValue.sortedCleanValuePercent = [0];

		expect(getStateValues(slider.state)).toEqual(expectedStateValue);
	});

	it(`should set handle to 100 and hide the max label when clicked outside the slider on the right side`, () => {
		const slider = initializeSliderWithRectangles();

		slider.actions.adjustCoordinate(120);

		const expectedStateValue = { ...defaultStateValues };
		expectedStateValue._dirtyValue = [110.00000000000001];
		expectedStateValue.cleanValue = [100];
		expectedStateValue.maxValueLabelDisplay = 'hidden';
		expectedStateValue.cleanValuePercent = [100];
		expectedStateValue.sortedCleanValue = [100];
		expectedStateValue.sortedCleanValuePercent = [100];

		expect(getStateValues(slider.state)).toEqual(expectedStateValue);
	});

	it(`should set handle to a proper percent when clicked inside the slider`, () => {
		const slider = initializeSliderWithRectangles();

		slider.actions.adjustCoordinate(70);

		const expectedStateValue = { ...defaultStateValues };
		expectedStateValue._dirtyValue = [60];
		expectedStateValue.cleanValue = [60];
		expectedStateValue.cleanValuePercent = [60];
		expectedStateValue.sortedCleanValue = [60];
		expectedStateValue.sortedCleanValuePercent = [60];

		expect(getStateValues(slider.state)).toEqual(expectedStateValue);
	});

	it(`should not go below minimum on arrow left and down arrow key stroke`, () => {
		const slider = initializeSliderWithRectangles({
			sliderValues: [0],
		});

		slider.actions.onKeydown(Key.ArrowDown, 0);

		const expectedStateValue = { ...defaultStateValues };
		expectedStateValue._dirtyValue = [-1];
		expectedStateValue.cleanValue = [0];
		expectedStateValue.cleanValuePercent = [0];
		expectedStateValue.sortedCleanValue = [0];
		expectedStateValue.sortedCleanValuePercent = [0];
		expectedStateValue.minValueLabelDisplay = 'hidden';

		expect(getStateValues(slider.state)).toEqual(expectedStateValue);

		slider.actions.onKeydown(Key.ArrowLeft, 0);

		expect(getStateValues(slider.state)).toEqual(expectedStateValue);
	});

	it(`should decrease the handle value on left and down arrow key stroke`, () => {
		const slider = initializeSliderWithRectangles({
			sliderValues: [50],
		});

		slider.actions.onKeydown(Key.ArrowDown, 0);

		const expectedStateValue = { ...defaultStateValues };
		expectedStateValue._dirtyValue = [49];
		expectedStateValue.cleanValue = [49];
		expectedStateValue.cleanValuePercent = [49];
		expectedStateValue.sortedCleanValue = [49];
		expectedStateValue.sortedCleanValuePercent = [49];

		expect(getStateValues(slider.state)).toEqual(expectedStateValue);

		slider.actions.onKeydown(Key.ArrowLeft, 0);

		expectedStateValue._dirtyValue = [48];
		expectedStateValue.cleanValue = [48];
		expectedStateValue.cleanValuePercent = [48];
		expectedStateValue.sortedCleanValue = [48];
		expectedStateValue.sortedCleanValuePercent = [48];

		expect(getStateValues(slider.state)).toEqual(expectedStateValue);
	});

	it(`should not go above maximum on arrow right and up arrow key stroke`, () => {
		const slider = initializeSliderWithRectangles({
			sliderValues: [100],
		});

		slider.actions.onKeydown(Key.ArrowUp, 0);

		const expectedStateValue = { ...defaultStateValues };
		expectedStateValue._dirtyValue = [101];
		expectedStateValue.cleanValue = [100];
		expectedStateValue.cleanValuePercent = [100];
		expectedStateValue.sortedCleanValue = [100];
		expectedStateValue.sortedCleanValuePercent = [100];
		expectedStateValue.minLabelWidth = 3;
		expectedStateValue.maxLabelWidth = 3;
		expectedStateValue.maxValueLabelDisplay = 'hidden';

		expect(getStateValues(slider.state)).toEqual(expectedStateValue);

		slider.actions.onKeydown(Key.ArrowRight, 0);

		expect(getStateValues(slider.state)).toEqual(expectedStateValue);
	});

	it(`should increase the handle value on right and up arrow key stroke`, () => {
		const slider = initializeSliderWithRectangles({
			sliderValues: [50],
		});

		slider.actions.onKeydown(Key.ArrowUp, 0);

		const expectedStateValue = { ...defaultStateValues };
		expectedStateValue._dirtyValue = [51];
		expectedStateValue.cleanValue = [51];
		expectedStateValue.cleanValuePercent = [51];
		expectedStateValue.sortedCleanValue = [51];
		expectedStateValue.sortedCleanValuePercent = [51];

		expect(getStateValues(slider.state)).toEqual(expectedStateValue);

		slider.actions.onKeydown(Key.ArrowRight, 0);

		expectedStateValue._dirtyValue = [52];
		expectedStateValue.cleanValue = [52];
		expectedStateValue.cleanValuePercent = [52];
		expectedStateValue.sortedCleanValue = [52];
		expectedStateValue.sortedCleanValuePercent = [52];

		expect(getStateValues(slider.state)).toEqual(expectedStateValue);
	});

	it(`should jump to minimum slider value on home key stroke`, () => {
		const slider = initializeSliderWithRectangles();

		slider.actions.onKeydown(Key.Home, 0);

		const expectedStateValue = { ...defaultStateValues };
		expectedStateValue._dirtyValue = [0];
		expectedStateValue.cleanValue = [0];
		expectedStateValue.cleanValuePercent = [0];
		expectedStateValue.sortedCleanValue = [0];
		expectedStateValue.sortedCleanValuePercent = [0];
		expectedStateValue.minValueLabelDisplay = 'hidden';

		expect(getStateValues(slider.state)).toEqual(expectedStateValue);
	});

	it(`should jump to maximum slider value on end key stroke`, () => {
		const slider = initializeSliderWithRectangles();

		slider.actions.onKeydown(Key.End, 0);

		const expectedStateValue = { ...defaultStateValues };
		expectedStateValue._dirtyValue = [100];
		expectedStateValue.cleanValue = [100];
		expectedStateValue.cleanValuePercent = [100];
		expectedStateValue.sortedCleanValue = [100];
		expectedStateValue.sortedCleanValuePercent = [100];
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

		slider.actions.onKeydown(Key.Home, 0);

		expect(getStateValues(slider.state)).toEqual(expectedStateValue);
	});

	it(`should not change handle with actions if the slider is readonly`, () => {
		const slider = initializeSliderWithRectangles({ readonly: true });

		const expectedStateValue = { ...defaultStateValues };
		expectedStateValue.readonly = true;

		expect(getStateValues(slider.state)).toEqual(expectedStateValue);

		slider.actions.adjustCoordinate(0);

		expect(getStateValues(slider.state)).toEqual(expectedStateValue);

		slider.actions.onKeydown(Key.Home, 0);

		expect(getStateValues(slider.state)).toEqual(expectedStateValue);
	});
});

describe(`ngb-slider range`, () => {
	it(`should create the configuration for the model based on input`, () => {
		const slider = initializeSliderWithRectangles({ minValue: 0, maxValue: 100, stepSize: 1, sliderValues: [10, 50] });

		const expectedStateValue = { ...defaultStateValues };
		expectedStateValue._dirtyValue = [10, 50];
		expectedStateValue.cleanValue = [10, 50];
		expectedStateValue.cleanValuePercent = [10, 50];
		expectedStateValue.sortedCleanValue = [10, 50];
		expectedStateValue.sortedCleanValuePercent = [10, 50];

		expect(getStateValues(slider.state)).toEqual(expectedStateValue);
	});

	it(`should update the correct handle when clicking on the range`, () => {
		const slider = initializeSliderWithRectangles({ minValue: 0, maxValue: 100, stepSize: 1, sliderValues: [10, 50] });

		slider.actions.adjustCoordinate(0);

		const expectedStateValue = { ...defaultStateValues };
		expectedStateValue._dirtyValue = [-10, 50];
		expectedStateValue.cleanValue = [0, 50];
		expectedStateValue.cleanValuePercent = [0, 50];
		expectedStateValue.sortedCleanValue = [0, 50];
		expectedStateValue.sortedCleanValuePercent = [0, 50];
		expectedStateValue.minValueLabelDisplay = 'hidden';

		expect(getStateValues(slider.state)).toEqual(expectedStateValue);

		slider.actions.adjustCoordinate(34);

		expectedStateValue._dirtyValue = [24, 50];
		expectedStateValue.cleanValue = [24, 50];
		expectedStateValue.cleanValuePercent = [24, 50];
		expectedStateValue.sortedCleanValue = [24, 50];
		expectedStateValue.sortedCleanValuePercent = [24, 50];
		expectedStateValue.minValueLabelDisplay = 'visible';

		expect(getStateValues(slider.state)).toEqual(expectedStateValue);
	});

	it(`should update the correct handles when they are reversed`, () => {
		const slider = initializeSliderWithRectangles({ minValue: 0, maxValue: 100, stepSize: 1, sliderValues: [10, 50] });

		slider.actions.onKeydown(Key.End, 0);

		const expectedStateValue = { ...defaultStateValues };
		expectedStateValue._dirtyValue = [100, 50];
		expectedStateValue.cleanValue = [100, 50];
		expectedStateValue.cleanValuePercent = [100, 50];
		expectedStateValue.sortedCleanValue = [50, 100];
		expectedStateValue.sortedCleanValuePercent = [50, 100];
		expectedStateValue.maxValueLabelDisplay = 'hidden';

		expect(getStateValues(slider.state)).toEqual(expectedStateValue);

		slider.actions.adjustCoordinate(70);

		expectedStateValue._dirtyValue = [100, 60];
		expectedStateValue.cleanValue = [100, 60];
		expectedStateValue.cleanValuePercent = [100, 60];
		expectedStateValue.sortedCleanValue = [60, 100];
		expectedStateValue.sortedCleanValuePercent = [60, 100];
		expectedStateValue.maxValueLabelDisplay = 'hidden';

		expect(getStateValues(slider.state)).toEqual(expectedStateValue);
	});

	it(`should merge the handle labels when the handles are too close`, () => {
		const slider = initializeSliderWithRectangles({ minValue: 0, maxValue: 100, stepSize: 1, sliderValues: [45, 50] });

		const expectedStateValue = { ...defaultStateValues };
		expectedStateValue._dirtyValue = [45, 50];
		expectedStateValue.cleanValue = [45, 50];
		expectedStateValue.cleanValuePercent = [45, 50];
		expectedStateValue.sortedCleanValue = [45, 50];
		expectedStateValue.sortedCleanValuePercent = [45, 50];
		expectedStateValue.mixLabelDisplay = 'visible';

		expect(getStateValues(slider.state)).toEqual(expectedStateValue);

		slider.actions.adjustCoordinate(66);

		expectedStateValue._dirtyValue = [45, 56.00000000000001];
		expectedStateValue.cleanValue = [45, 56];
		expectedStateValue.cleanValuePercent = [45, 56];
		expectedStateValue.sortedCleanValue = [45, 56];
		expectedStateValue.sortedCleanValuePercent = [45, 56];
		expectedStateValue.mixLabelDisplay = 'hidden';

		expect(getStateValues(slider.state)).toEqual(expectedStateValue);
	});
});

describe(`ngb-slider vertical`, () => {
	it(`should calculate the clicked percent from the bottom to the top of the slider`, () => {
		const slider = initializeSliderWithRectanglesVertical();

		const expectedStateValue = { ...defaultStateValues };
		expectedStateValue.sliderDomRect = new DOMRect(10, 0, 4, 100);
		expectedStateValue.minLabelDomRect = new DOMRect(20, 0, 3, 4);
		expectedStateValue.maxLabelDomRect = new DOMRect(20, 100, 3, 4);
		expectedStateValue.vertical = true;

		expect(getStateValues(slider.state)).toEqual(expectedStateValue);

		slider.actions.adjustCoordinate(60);

		expectedStateValue._dirtyValue = [40];
		expectedStateValue.cleanValue = [40];
		expectedStateValue.sortedCleanValue = [40];
		expectedStateValue.cleanValuePercent = [40];
		expectedStateValue.sortedCleanValuePercent = [40];

		expect(getStateValues(slider.state)).toEqual(expectedStateValue);
	});
});
