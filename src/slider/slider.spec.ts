import { Component, inject } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { createGenericTestComponent } from '../test/common';
import { Key } from '../util/key';
import { createSlider, NgbSlider, NgbSliderHandleDirective } from './slider';
import { NgbSliderConfig } from './slider-config';
import { SliderState } from './slider.model';

function createKeyDownEvent(key: number): KeyboardEvent {
	const event = { which: key, preventDefault: () => {}, stopPropagation: () => {} };
	spyOn(event, 'preventDefault');
	spyOn(event, 'stopPropagation');
	return event as KeyboardEvent;
}

const createTestComponent = (html: string) =>
	createGenericTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;

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
		progressLeft: sliderState.progressLeft(),
		progressBottom: sliderState.progressBottom(),
		progressHeight: sliderState.progressHeight(),
		mixLabelLeft: sliderState.mixLabelLeft(),
		mixLabelTop: sliderState.mixLabelTop(),
		handleTooltipLeft: sliderState.handleTooltipLeft(),
		handleTooltipTop: sliderState.handleTooltipTop(),
		internalChange: sliderState.internalChange(),
		sortedHandleDisplay: sliderState.sortedHandleDisplay(),
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
	progressLeft: [0],
	progressBottom: [0],
	progressHeight: [100],
	mixLabelLeft: 0,
	mixLabelTop: 0,
	handleTooltipLeft: [30],
	handleTooltipTop: [0],
	internalChange: false,
	sortedHandleDisplay: [{ id: 0, value: 30 }],
};

const defaultSliderInjector = (config?: Partial<NgbSliderConfig>) => {
	const conf = inject(NgbSliderConfig);
	const slider = createSlider(conf);
	slider.state.minValueDirty.set(config?.minValue ?? conf.minValue);
	slider.state.maxValueDirty.set(config?.maxValue ?? conf.maxValue);
	slider.state.stepSizeDirty.set(config?.stepSize ?? conf.stepSize);
	slider.state.readonly.set(config?.readonly ?? conf.readonly);
	slider.state.disabled.set(config?.disabled ?? conf.disabled);
	slider.state._dirtyValue.set(config?.sliderValues ?? conf.sliderValues);
	return slider;
};

const initializeSliderWithRectangles = (config?: Partial<NgbSliderConfig>) => {
	const slider = defaultSliderInjector(config);

	slider.state.sliderDomRect.set(new DOMRect(10, 0, 100, 4));
	slider.state.minLabelDomRect.set(new DOMRect(10, 5, 3, 4));
	slider.state.maxLabelDomRect.set(new DOMRect(100, 5, 3, 4));
	return slider;
};

const initializeSliderWithRectanglesVertical = (config?: Partial<NgbSliderConfig>) => {
	const slider = defaultSliderInjector(config);

	slider.state.vertical.set(true);
	slider.state.sliderDomRect.set(new DOMRect(10, 0, 4, 100));
	slider.state.minLabelDomRect.set(new DOMRect(20, 0, 3, 4));
	slider.state.maxLabelDomRect.set(new DOMRect(20, 100, 3, 4));
	return slider;
};

describe(`ngb-slider basic`, () => {
	it(`should create the default configuration for the model`, () => {
		TestBed.runInInjectionContext(() => {
			const slider = initializeSliderWithRectangles();
			expect(getStateValues(slider.state)).toEqual(defaultStateValues);
		});
	});

	it(`should create the configuration for the model based on the input`, () => {
		TestBed.runInInjectionContext(() => {
			const slider = initializeSliderWithRectangles({
				minValue: 100,
				maxValue: 200,
				stepSize: 25,
				sliderValues: [150],
			});

			const expectedStateValue = { ...defaultStateValues };
			expectedStateValue._dirtyValue = [150];
			expectedStateValue.minValue = 100;
			expectedStateValue.maxValue = 200;
			expectedStateValue.stepSize = 25;
			expectedStateValue.cleanValue = [150];
			expectedStateValue.cleanValuePercent = [50];
			expectedStateValue.sortedCleanValue = [150];
			expectedStateValue.sortedCleanValuePercent = [50];
			expectedStateValue.handleTooltipLeft = [50];
			expectedStateValue.sortedHandleDisplay = [{ id: 0, value: 150 }];

			expect(getStateValues(slider.state)).toEqual(expectedStateValue);
		});
	});

	it(`should set minValue as min between min, max initial values and maxValue as max accordingly`, () => {
		TestBed.runInInjectionContext(() => {
			const slider = initializeSliderWithRectangles({ minValue: 100, maxValue: 0 });
			expect(getStateValues(slider.state)).toEqual(defaultStateValues);
		});
	});

	it(`should set min as defaultMinValue and max as defaultMaxValue if provided values are the same`, () => {
		TestBed.runInInjectionContext(() => {
			const slider = initializeSliderWithRectangles({ minValue: 100, maxValue: 100 });
			expect(getStateValues(slider.state)).toEqual(defaultStateValues);
		});
	});

	it(`should set the step as 1 if the provided value is 0`, () => {
		TestBed.runInInjectionContext(() => {
			const slider = initializeSliderWithRectangles({ stepSize: 0 });
			expect(getStateValues(slider.state)).toEqual(defaultStateValues);
		});
	});

	it(`should snap the value to the valid step`, () => {
		TestBed.runInInjectionContext(() => {
			const slider = initializeSliderWithRectangles({ minValue: 0, maxValue: 100, stepSize: 25, sliderValues: [60] });
			const expectedStateValue = { ...defaultStateValues };
			expectedStateValue._dirtyValue = [60];
			expectedStateValue.stepSize = 25;
			expectedStateValue.cleanValue = [50];
			expectedStateValue.cleanValuePercent = [50];
			expectedStateValue.sortedCleanValue = [50];
			expectedStateValue.sortedCleanValuePercent = [50];
			expectedStateValue.handleTooltipLeft = [50];
			expectedStateValue.sortedHandleDisplay = [{ id: 0, value: 50 }];

			expect(getStateValues(slider.state)).toEqual(expectedStateValue);
		});
	});

	it(`should set handle to 0 and hide the min label when clicked outside the slider on the left side`, () => {
		TestBed.runInInjectionContext(() => {
			const slider = initializeSliderWithRectangles();
			slider.actions.adjustCoordinate(0);

			const expectedStateValue = { ...defaultStateValues };
			expectedStateValue._dirtyValue = [-10];
			expectedStateValue.cleanValue = [0];
			expectedStateValue.minValueLabelDisplay = 'hidden';
			expectedStateValue.cleanValuePercent = [0];
			expectedStateValue.sortedCleanValue = [0];
			expectedStateValue.sortedCleanValuePercent = [0];
			expectedStateValue.handleTooltipLeft = [0];
			expectedStateValue.sortedHandleDisplay = [{ id: 0, value: 0 }];

			expect(getStateValues(slider.state)).toEqual(expectedStateValue);
		});
	});

	it(`should set handle to 100 and hide the max label when clicked outside the slider on the right side`, () => {
		TestBed.runInInjectionContext(() => {
			const slider = initializeSliderWithRectangles();
			slider.actions.adjustCoordinate(120);

			const expectedStateValue = { ...defaultStateValues };
			expectedStateValue._dirtyValue = [110.00000000000001];
			expectedStateValue.cleanValue = [100];
			expectedStateValue.maxValueLabelDisplay = 'hidden';
			expectedStateValue.cleanValuePercent = [100];
			expectedStateValue.sortedCleanValue = [100];
			expectedStateValue.sortedCleanValuePercent = [100];
			expectedStateValue.handleTooltipLeft = [100];
			expectedStateValue.sortedHandleDisplay = [{ id: 0, value: 100 }];

			expect(getStateValues(slider.state)).toEqual(expectedStateValue);
		});
	});

	it(`should set handle to a proper percent when clicked inside the slider`, () => {
		TestBed.runInInjectionContext(() => {
			const slider = initializeSliderWithRectangles();
			slider.actions.adjustCoordinate(70);

			const expectedStateValue = { ...defaultStateValues };
			expectedStateValue._dirtyValue = [60];
			expectedStateValue.cleanValue = [60];
			expectedStateValue.cleanValuePercent = [60];
			expectedStateValue.sortedCleanValue = [60];
			expectedStateValue.sortedCleanValuePercent = [60];
			expectedStateValue.handleTooltipLeft = [60];
			expectedStateValue.sortedHandleDisplay = [{ id: 0, value: 60 }];

			expect(getStateValues(slider.state)).toEqual(expectedStateValue);
		});
	});

	it(`should not go below minimum on arrow left and down arrow key stroke`, () => {
		TestBed.runInInjectionContext(() => {
			const slider = initializeSliderWithRectangles({
				sliderValues: [0],
			});

			slider.actions.onKeydown(createKeyDownEvent(Key.ArrowDown), 0);

			const expectedStateValue = { ...defaultStateValues };
			expectedStateValue._dirtyValue = [-1];
			expectedStateValue.cleanValue = [0];
			expectedStateValue.cleanValuePercent = [0];
			expectedStateValue.sortedCleanValue = [0];
			expectedStateValue.sortedCleanValuePercent = [0];
			expectedStateValue.minValueLabelDisplay = 'hidden';
			expectedStateValue.handleTooltipLeft = [0];
			expectedStateValue.sortedHandleDisplay = [{ id: 0, value: 0 }];

			expect(getStateValues(slider.state)).toEqual(expectedStateValue);

			slider.actions.onKeydown(createKeyDownEvent(Key.ArrowLeft), 0);

			expect(getStateValues(slider.state)).toEqual(expectedStateValue);
		});
	});

	it(`should decrease the handle value on left and down arrow key stroke`, () => {
		TestBed.runInInjectionContext(() => {
			const slider = initializeSliderWithRectangles({
				sliderValues: [50],
			});

			slider.actions.onKeydown(createKeyDownEvent(Key.ArrowDown), 0);

			const expectedStateValue = { ...defaultStateValues };
			expectedStateValue._dirtyValue = [49];
			expectedStateValue.cleanValue = [49];
			expectedStateValue.cleanValuePercent = [49];
			expectedStateValue.sortedCleanValue = [49];
			expectedStateValue.sortedCleanValuePercent = [49];
			expectedStateValue.handleTooltipLeft = [49];
			expectedStateValue.sortedHandleDisplay = [{ id: 0, value: 49 }];

			expect(getStateValues(slider.state)).toEqual(expectedStateValue);

			slider.actions.onKeydown(createKeyDownEvent(Key.ArrowLeft), 0);

			expectedStateValue._dirtyValue = [48];
			expectedStateValue.cleanValue = [48];
			expectedStateValue.cleanValuePercent = [48];
			expectedStateValue.sortedCleanValue = [48];
			expectedStateValue.sortedCleanValuePercent = [48];
			expectedStateValue.handleTooltipLeft = [48];
			expectedStateValue.sortedHandleDisplay = [{ id: 0, value: 48 }];

			expect(getStateValues(slider.state)).toEqual(expectedStateValue);
		});
	});

	it(`should not go above maximum on arrow right and up arrow key stroke`, () => {
		TestBed.runInInjectionContext(() => {
			const slider = initializeSliderWithRectangles({
				sliderValues: [100],
			});

			slider.actions.onKeydown(createKeyDownEvent(Key.ArrowUp), 0);

			const expectedStateValue = { ...defaultStateValues };
			expectedStateValue._dirtyValue = [101];
			expectedStateValue.cleanValue = [100];
			expectedStateValue.cleanValuePercent = [100];
			expectedStateValue.sortedCleanValue = [100];
			expectedStateValue.sortedCleanValuePercent = [100];
			expectedStateValue.minLabelWidth = 3;
			expectedStateValue.maxLabelWidth = 3;
			expectedStateValue.maxValueLabelDisplay = 'hidden';
			expectedStateValue.handleTooltipLeft = [100];
			expectedStateValue.sortedHandleDisplay = [{ id: 0, value: 100 }];

			expect(getStateValues(slider.state)).toEqual(expectedStateValue);

			slider.actions.onKeydown(createKeyDownEvent(Key.ArrowRight), 0);

			expect(getStateValues(slider.state)).toEqual(expectedStateValue);
		});
	});

	it(`should increase the handle value on right and up arrow key stroke`, () => {
		TestBed.runInInjectionContext(() => {
			const slider = initializeSliderWithRectangles({
				sliderValues: [50],
			});

			slider.actions.onKeydown(createKeyDownEvent(Key.ArrowUp), 0);

			const expectedStateValue = { ...defaultStateValues };
			expectedStateValue._dirtyValue = [51];
			expectedStateValue.cleanValue = [51];
			expectedStateValue.cleanValuePercent = [51];
			expectedStateValue.sortedCleanValue = [51];
			expectedStateValue.sortedCleanValuePercent = [51];
			expectedStateValue.handleTooltipLeft = [51];
			expectedStateValue.sortedHandleDisplay = [{ id: 0, value: 51 }];

			expect(getStateValues(slider.state)).toEqual(expectedStateValue);

			slider.actions.onKeydown(createKeyDownEvent(Key.ArrowRight), 0);

			expectedStateValue._dirtyValue = [52];
			expectedStateValue.cleanValue = [52];
			expectedStateValue.cleanValuePercent = [52];
			expectedStateValue.sortedCleanValue = [52];
			expectedStateValue.sortedCleanValuePercent = [52];
			expectedStateValue.handleTooltipLeft = [52];
			expectedStateValue.sortedHandleDisplay = [{ id: 0, value: 52 }];

			expect(getStateValues(slider.state)).toEqual(expectedStateValue);
		});
	});

	it(`should jump to minimum slider value on home key stroke`, () => {
		TestBed.runInInjectionContext(() => {
			const slider = initializeSliderWithRectangles();

			slider.actions.onKeydown(createKeyDownEvent(Key.Home), 0);

			const expectedStateValue = { ...defaultStateValues };
			expectedStateValue._dirtyValue = [0];
			expectedStateValue.cleanValue = [0];
			expectedStateValue.cleanValuePercent = [0];
			expectedStateValue.sortedCleanValue = [0];
			expectedStateValue.sortedCleanValuePercent = [0];
			expectedStateValue.minValueLabelDisplay = 'hidden';
			expectedStateValue.handleTooltipLeft = [0];
			expectedStateValue.sortedHandleDisplay = [{ id: 0, value: 0 }];

			expect(getStateValues(slider.state)).toEqual(expectedStateValue);
		});
	});

	it(`should jump to maximum slider value on end key stroke`, () => {
		TestBed.runInInjectionContext(() => {
			const slider = initializeSliderWithRectangles();

			slider.actions.onKeydown(createKeyDownEvent(Key.End), 0);

			const expectedStateValue = { ...defaultStateValues };
			expectedStateValue._dirtyValue = [100];
			expectedStateValue.cleanValue = [100];
			expectedStateValue.cleanValuePercent = [100];
			expectedStateValue.sortedCleanValue = [100];
			expectedStateValue.sortedCleanValuePercent = [100];
			expectedStateValue.maxValueLabelDisplay = 'hidden';
			expectedStateValue.handleTooltipLeft = [100];
			expectedStateValue.sortedHandleDisplay = [{ id: 0, value: 100 }];

			expect(getStateValues(slider.state)).toEqual(expectedStateValue);
		});
	});

	it(`should not change handle with actions if the slider is disabled`, () => {
		TestBed.runInInjectionContext(() => {
			const slider = initializeSliderWithRectangles({ disabled: true });
			const expectedStateValue = { ...defaultStateValues };
			expectedStateValue.disabled = true;

			expect(getStateValues(slider.state)).toEqual(expectedStateValue);

			slider.actions.adjustCoordinate(0);

			expect(getStateValues(slider.state)).toEqual(expectedStateValue);

			slider.actions.onKeydown(createKeyDownEvent(Key.Home), 0);

			expect(getStateValues(slider.state)).toEqual(expectedStateValue);
		});
	});

	it(`should not change handle with actions if the slider is readonly`, () => {
		TestBed.runInInjectionContext(() => {
			const slider = initializeSliderWithRectangles({ readonly: true });
			const expectedStateValue = { ...defaultStateValues };
			expectedStateValue.readonly = true;

			expect(getStateValues(slider.state)).toEqual(expectedStateValue);

			slider.actions.adjustCoordinate(0);

			expect(getStateValues(slider.state)).toEqual(expectedStateValue);

			slider.actions.onKeydown(createKeyDownEvent(Key.Home), 0);

			expect(getStateValues(slider.state)).toEqual(expectedStateValue);
		});
	});
});

describe(`ngb-slider range`, () => {
	it(`should create the configuration for the model based on input`, () => {
		TestBed.runInInjectionContext(() => {
			const slider = initializeSliderWithRectangles({
				minValue: 0,
				maxValue: 100,
				stepSize: 1,
				sliderValues: [10, 50],
			});

			const expectedStateValue = { ...defaultStateValues };
			expectedStateValue._dirtyValue = [10, 50];
			expectedStateValue.cleanValue = [10, 50];
			expectedStateValue.cleanValuePercent = [10, 50];
			expectedStateValue.sortedCleanValue = [10, 50];
			expectedStateValue.sortedCleanValuePercent = [10, 50];
			expectedStateValue.progressLeft = [10, 50];
			expectedStateValue.progressBottom = [0, 0];
			expectedStateValue.progressHeight = [100, 100];
			expectedStateValue.mixLabelLeft = 30;
			expectedStateValue.handleTooltipLeft = [10, 50];
			expectedStateValue.handleTooltipTop = [0, 0];
			expectedStateValue.sortedHandleDisplay = [
				{ id: 0, value: 10 },
				{ id: 1, value: 50 },
			];

			expect(getStateValues(slider.state)).toEqual(expectedStateValue);
		});
	});

	it(`should update the correct handle when clicking on the range`, () => {
		TestBed.runInInjectionContext(() => {
			const slider = initializeSliderWithRectangles({
				minValue: 0,
				maxValue: 100,
				stepSize: 1,
				sliderValues: [10, 50],
			});

			slider.actions.adjustCoordinate(0);

			const expectedStateValue = { ...defaultStateValues };
			expectedStateValue._dirtyValue = [-10, 50];
			expectedStateValue.cleanValue = [0, 50];
			expectedStateValue.cleanValuePercent = [0, 50];
			expectedStateValue.sortedCleanValue = [0, 50];
			expectedStateValue.sortedCleanValuePercent = [0, 50];
			expectedStateValue.minValueLabelDisplay = 'hidden';
			expectedStateValue.progressLeft = [0, 50];
			expectedStateValue.progressBottom = [0, 0];
			expectedStateValue.progressHeight = [100, 100];
			expectedStateValue.mixLabelLeft = 25;
			expectedStateValue.handleTooltipLeft = [0, 50];
			expectedStateValue.handleTooltipTop = [0, 0];
			expectedStateValue.sortedHandleDisplay = [
				{ id: 0, value: 0 },
				{ id: 1, value: 50 },
			];

			expect(getStateValues(slider.state)).toEqual(expectedStateValue);

			slider.actions.adjustCoordinate(34);

			expectedStateValue._dirtyValue = [24, 50];
			expectedStateValue.cleanValue = [24, 50];
			expectedStateValue.cleanValuePercent = [24, 50];
			expectedStateValue.sortedCleanValue = [24, 50];
			expectedStateValue.sortedCleanValuePercent = [24, 50];
			expectedStateValue.minValueLabelDisplay = 'visible';
			expectedStateValue.progressLeft = [24, 50];
			expectedStateValue.progressBottom = [0, 0];
			expectedStateValue.progressHeight = [100, 100];
			expectedStateValue.mixLabelLeft = 37;
			expectedStateValue.handleTooltipLeft = [24, 50];
			expectedStateValue.handleTooltipTop = [0, 0];
			expectedStateValue.sortedHandleDisplay = [
				{ id: 0, value: 24 },
				{ id: 1, value: 50 },
			];

			expect(getStateValues(slider.state)).toEqual(expectedStateValue);
		});
	});

	it(`should update the correct handles when they are reversed`, () => {
		TestBed.runInInjectionContext(() => {
			const slider = initializeSliderWithRectangles({
				minValue: 0,
				maxValue: 100,
				stepSize: 1,
				sliderValues: [10, 50],
			});
			slider.actions.onKeydown(createKeyDownEvent(Key.End), 0);

			const expectedStateValue = { ...defaultStateValues };
			expectedStateValue._dirtyValue = [100, 50];
			expectedStateValue.cleanValue = [100, 50];
			expectedStateValue.cleanValuePercent = [100, 50];
			expectedStateValue.sortedCleanValue = [50, 100];
			expectedStateValue.sortedCleanValuePercent = [50, 100];
			expectedStateValue.maxValueLabelDisplay = 'hidden';
			expectedStateValue.progressLeft = [50, 100];
			expectedStateValue.progressBottom = [0, 0];
			expectedStateValue.progressHeight = [100, 100];
			expectedStateValue.mixLabelLeft = 75;
			expectedStateValue.handleTooltipLeft = [100, 50];
			expectedStateValue.handleTooltipTop = [0, 0];
			expectedStateValue.sortedHandleDisplay = [
				{ id: 1, value: 50 },
				{ id: 0, value: 100 },
			];

			expect(getStateValues(slider.state)).toEqual(expectedStateValue);

			slider.actions.adjustCoordinate(70);

			expectedStateValue._dirtyValue = [100, 60];
			expectedStateValue.cleanValue = [100, 60];
			expectedStateValue.cleanValuePercent = [100, 60];
			expectedStateValue.sortedCleanValue = [60, 100];
			expectedStateValue.sortedCleanValuePercent = [60, 100];
			expectedStateValue.maxValueLabelDisplay = 'hidden';
			expectedStateValue.progressLeft = [60, 100];
			expectedStateValue.progressBottom = [0, 0];
			expectedStateValue.progressHeight = [100, 100];
			expectedStateValue.mixLabelLeft = 80;
			expectedStateValue.handleTooltipLeft = [100, 60];
			expectedStateValue.handleTooltipTop = [0, 0];
			expectedStateValue.sortedHandleDisplay = [
				{ id: 1, value: 60 },
				{ id: 0, value: 100 },
			];

			expect(getStateValues(slider.state)).toEqual(expectedStateValue);
		});
	});

	it(`should merge the handle labels when the handles are too close`, () => {
		TestBed.runInInjectionContext(() => {
			const slider = initializeSliderWithRectangles({
				minValue: 0,
				maxValue: 100,
				stepSize: 1,
				sliderValues: [45, 50],
			});

			const expectedStateValue = { ...defaultStateValues };
			expectedStateValue._dirtyValue = [45, 50];
			expectedStateValue.cleanValue = [45, 50];
			expectedStateValue.cleanValuePercent = [45, 50];
			expectedStateValue.sortedCleanValue = [45, 50];
			expectedStateValue.sortedCleanValuePercent = [45, 50];
			expectedStateValue.mixLabelDisplay = 'visible';
			expectedStateValue.progressLeft = [45, 50];
			expectedStateValue.progressBottom = [0, 0];
			expectedStateValue.progressHeight = [100, 100];
			expectedStateValue.mixLabelLeft = 47.5;
			expectedStateValue.handleTooltipLeft = [45, 50];
			expectedStateValue.handleTooltipTop = [0, 0];
			expectedStateValue.sortedHandleDisplay = [
				{ id: 0, value: 45 },
				{ id: 1, value: 50 },
			];

			expect(getStateValues(slider.state)).toEqual(expectedStateValue);

			slider.actions.adjustCoordinate(66);

			expectedStateValue._dirtyValue = [45, 56.00000000000001];
			expectedStateValue.cleanValue = [45, 56];
			expectedStateValue.cleanValuePercent = [45, 56];
			expectedStateValue.sortedCleanValue = [45, 56];
			expectedStateValue.sortedCleanValuePercent = [45, 56];
			expectedStateValue.mixLabelDisplay = 'hidden';
			expectedStateValue.progressLeft = [45, 56];
			expectedStateValue.progressBottom = [0, 0];
			expectedStateValue.progressHeight = [100, 100];
			expectedStateValue.mixLabelLeft = 50.5;
			expectedStateValue.handleTooltipLeft = [45, 56];
			expectedStateValue.handleTooltipTop = [0, 0];
			expectedStateValue.sortedHandleDisplay = [
				{ id: 0, value: 45 },
				{ id: 1, value: 56 },
			];

			expect(getStateValues(slider.state)).toEqual(expectedStateValue);
		});
	});
});

describe(`ngb-slider vertical`, () => {
	it(`should calculate the clicked percent from the bottom to the top of the slider`, () => {
		TestBed.runInInjectionContext(() => {
			const slider = initializeSliderWithRectanglesVertical();

			const expectedStateValue = { ...defaultStateValues };
			expectedStateValue.sliderDomRect = new DOMRect(10, 0, 4, 100);
			expectedStateValue.minLabelDomRect = new DOMRect(20, 0, 3, 4);
			expectedStateValue.maxLabelDomRect = new DOMRect(20, 100, 3, 4);
			expectedStateValue.progressHeight = [30];
			expectedStateValue.handleTooltipLeft = [0];
			expectedStateValue.handleTooltipTop = [70];
			expectedStateValue.vertical = true;

			expect(getStateValues(slider.state)).toEqual(expectedStateValue);

			slider.actions.adjustCoordinate(60);

			expectedStateValue._dirtyValue = [40];
			expectedStateValue.cleanValue = [40];
			expectedStateValue.sortedCleanValue = [40];
			expectedStateValue.cleanValuePercent = [40];
			expectedStateValue.sortedCleanValuePercent = [40];
			expectedStateValue.progressHeight = [40];
			expectedStateValue.handleTooltipLeft = [0];
			expectedStateValue.handleTooltipTop = [60];
			expectedStateValue.sortedHandleDisplay = [{ id: 0, value: 40 }];

			expect(getStateValues(slider.state)).toEqual(expectedStateValue);
		});
	});
});

describe(`ngb-slider form handling`, () => {
	it(`should work with reactive form`, fakeAsync(() => {
		const html = `
	  <ngb-slider [formControl]="formControl"></ngb-slider>
`;

		const fixture = createTestComponent(html);
		const element = fixture.debugElement.query(By.directive(NgbSlider));

		element.componentInstance.widget.state.sliderDomRect.set(new DOMRect(10, 0, 100, 4));
		element.componentInstance.widget.state.minLabelDomRect.set(new DOMRect(10, 5, 3, 4));
		element.componentInstance.widget.state.maxLabelDomRect.set(new DOMRect(100, 5, 3, 4));

		fixture.detectChanges();
		tick();

		expect(element.nativeElement).toHaveCssClass('ng-valid');
		expect(element.nativeElement).toHaveCssClass('ng-untouched');
		expect(element.nativeElement).toHaveCssClass('ng-pristine');

		element.componentInstance.widget.actions.adjustCoordinate(70);

		fixture.detectChanges();
		tick();
		fixture.detectChanges();

		expect(fixture.componentInstance.formControl.value).toEqual([60]);

		expect(element.nativeElement).toHaveCssClass('ng-valid');
		expect(element.nativeElement).toHaveCssClass('ng-touched');
		expect(element.nativeElement).toHaveCssClass('ng-dirty');
	}));

	it(`should mark control as touched on blur`, fakeAsync(() => {
		const html = `
	  <ngb-slider [formControl]="formControl"></ngb-slider>
`;

		const fixture = createTestComponent(html);
		const element = fixture.debugElement.query(By.directive(NgbSlider));

		expect(element.nativeElement).toHaveCssClass('ng-untouched');

		element.triggerEventHandler('blur', {});
		fixture.detectChanges();
		expect(element.nativeElement).toHaveCssClass('ng-touched');
	}));

	it(`should disable widget when control is disabled`, fakeAsync(() => {
		const html = `
	  <ngb-slider [formControl]="formControl"></ngb-slider>
`;

		const fixture = createTestComponent(html);
		const handle = fixture.debugElement.query(By.directive(NgbSliderHandleDirective));
		fixture.detectChanges();
		tick();

		expect(handle.nativeElement.getAttribute('aria-disabled')).toBe(null);

		fixture.componentInstance.formControl.disable();
		fixture.detectChanges();
		tick();

		expect(handle.nativeElement.getAttribute('aria-disabled')).toBe('true');
	}));
});

@Component({
	selector: 'test-cmp',
	standalone: true,
	imports: [NgbSlider, FormsModule, ReactiveFormsModule],
	template: '',
})
class TestComponent {
	formControl = new FormControl([20]);
	minValue = 0;
	maxValue = 100;
	stepSize = 1;
	sliderValues = [30];
	readonly = false;
	disabled = false;
	vertical = false;
}
