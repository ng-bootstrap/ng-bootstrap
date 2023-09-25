import { Signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Holds all the required values to draw and manage the slider
 */
export interface SliderState {
	minLabelWidth: Signal<number>;
	maxLabelWidth: Signal<number>;
	minValueLabelDisplay: Signal<string>;
	maxValueLabelDisplay: Signal<string>;
	mixLabelDisplay: Signal<string>;

	_dirtyValue: WritableSignal<number[]>;
	cleanValue: Signal<number[]>;
	cleanValuePercent: Signal<number[]>;
	sortedCleanValue: Signal<number[]>;
	sortedCleanValuePercent: Signal<number[]>;

	progressLeft: Signal<number[]>;
	progressBottom: Signal<number[]>;
	progressWidth: Signal<number[]>;
	progressHeight: Signal<number[]>;
	mixLabelLeft: Signal<number>;
	mixLabelTop: Signal<number>;
	handleTooltipLeft: Signal<number[]>;
	handleTooltipTop: Signal<number[]>;
	minValue: Signal<number>;
	maxValue: Signal<number>;
	stepSize: Signal<number>;


	minValueDirty: WritableSignal<number>;
	maxValueDirty: WritableSignal<number>;
	stepSizeDirty: WritableSignal<number>;
	readonly: WritableSignal<boolean>;
	disabled: WritableSignal<boolean>;
	vertical: WritableSignal<boolean>;
	minLabelDomRect: WritableSignal<DOMRect>;
	maxLabelDomRect: WritableSignal<DOMRect>;
	sliderDomRect: WritableSignal<DOMRect>;

	internalChange: WritableSignal<boolean>;
	sortedHandleDisplay: Signal<{ value: number; id: number }[]>;
}

/**
 * Holds the available actions that can be applied to the slider
 */
export interface SliderActions {
	adjustCoordinate(coordinate: number, handleNumber?: number): void;
	onKeydown(event: KeyboardEvent, handleNumber: number): void;
}

/**
 * Wrapper interface that holds everything that corresponds to the slider
 */
export interface SliderWidget {
	actions: SliderActions;
	state: SliderState;
	events: {
		onValueChange$: Observable<number[]>;
	}; // TODO add better type
}
