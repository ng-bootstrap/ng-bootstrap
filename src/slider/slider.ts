import { NgFor, NgIf } from '@angular/common';
import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	computed,
	Directive,
	ElementRef,
	EventEmitter,
	forwardRef,
	HostListener,
	inject,
	Input,
	OnDestroy,
	OnInit,
	Output,
	signal,
	Signal,
	ViewChild,
	ViewEncapsulation,
	WritableSignal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Key } from '../util/key';
import { NgbDefaultSliderConfig, NgbSliderConfig } from './slider-config';

/**
 * Types of the change that can happen to the slider value when the value is modified
 */
export enum SliderValueChangeType {
	COORDINATE = 'coordinate',
	KEY = 'key',
}

/**
 * A directive that is responsible for:
 * * the click and keyboard even capture and propagation
 * * positioning of the slider handle
 */
@Directive({
	selector: '[ngbSliderHandle]',
	standalone: true,
	host: {
		class: 'ngb-slider-handle',
		'[style.left.%]': 'sliderHandle',
	},
})
export class NgbSliderHandleDirective {
	private _elementRef = inject(ElementRef);

	/**
	 * Left offset of the handle element in %
	 */
	@Input() sliderHandle: number;

	/**
	 * An event containing the new value of slider handle coordinate
	 * emitted every time when the handle is moved with the mouse
	 */
	@Output() sliderCoordinateMove = new EventEmitter<number>();

	/**
	 * An event containing the key that was pressed on slider handle
	 * emited every time when a key stroke is captured
	 */
	@Output() sliderKeydown = new EventEmitter<number>();

	@HostListener('keydown', ['$event'])
	private onKeyDown(event: KeyboardEvent) {
		// eslint-disable-next-line deprecation/deprecation
		if (event.which !== Key.Tab) {
			event.preventDefault();
		}
		// eslint-disable-next-line deprecation/deprecation
		this.sliderKeydown.emit(event.which);
	}

	@HostListener('mousedown', ['$event'])
	private onMouseDown(event: MouseEvent) {
		this._elementRef.nativeElement.focus();
		event.preventDefault();
		const handleDrag = (e: MouseEvent) => this.elementDrag(e);
		document.addEventListener('mousemove', handleDrag);
		document.addEventListener('mouseup', () => document.removeEventListener('mousemove', handleDrag), { once: true });
	}

	private elementDrag(e: MouseEvent) {
		e.preventDefault();
		this.sliderCoordinateMove.emit(e.clientX);
	}
}

/**
 * NgbSlider component container that holds the markup of the element
 */
@Component({
	selector: 'ngb-slider',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NgbSlider), multi: true }],
	imports: [NgbSliderHandleDirective, NgIf, NgFor],
	host: {
		'(click)': 'sliderValueChange($event.clientX, _sliderValueChangeType.COORDINATE)',
		'(blur)': 'handleBlur()',
	},
	template: `
		<ng-container *ngFor="let repeat of [].constructor(_state._dirtyValue().length - 1 || 1); let i = index">
			<div
				#progress
				class="ngb-slider-progress"
				[attr.disabled]="_state.disabled() ? true : null"
				[style.left.%]="_state._dirtyValue().length === 1 ? 0 : _state.sortedCleanValuePercent()[i]"
				[style.width.%]="
					_state._dirtyValue().length === 1
						? _state.sortedCleanValuePercent()[i]
						: _state.sortedCleanValuePercent()[i + 1] - _state.sortedCleanValuePercent()[i]
				"
			></div>
		</ng-container>

		<div #minLabel class="ngb-slider-label ngb-slider-label-min" [style.visibility]="_state.minValueLabelDisplay()">
			{{ _state.minValue() }}
		</div>
		<div #maxLabel class="ngb-slider-label ngb-slider-label-max" [style.visibility]="_state.maxValueLabelDisplay()">
			{{ _state.maxValue() }}
		</div>
		<div
			class="ngb-slider-label ngb-slider-label-now"
			[style.visibility]="_state.mixLabelDisplay()"
			[style.left.%]="(_state.sortedCleanValuePercent()[0] + _state.sortedCleanValuePercent()?.[1]) / 2"
		>
			{{ _state.sortedCleanValue()[0] }} - {{ _state.sortedCleanValue()[1] }}</div
		>
		<ng-container *ngFor="let repeat of [].constructor(_state._dirtyValue().length); let i = index">
			<button
				ngbSliderHandle
				[sliderHandle]="_state.cleanValuePercent()[i]"
				(sliderCoordinateMove)="sliderValueChange($event, _sliderValueChangeType.COORDINATE, i)"
				(sliderKeydown)="sliderValueChange($event, _sliderValueChangeType.KEY, i)"
				role="slider"
				[attr.aria-valuemin]="_state.minValue()"
				[attr.aria-valuemax]="_state.maxValue()"
				[attr.aria-valuenow]="_state.cleanValue()[i]"
				[attr.aria-valuetext]="_state.cleanValue()[i]"
				[attr.aria-readonly]="_state.readonly() ? true : null"
				[attr.aria-disabled]="_state.disabled() ? true : null"
				[attr.disabled]="_state.disabled() ? true : null"
				>&nbsp;
			</button>
			<div
				class="ngb-slider-label ngb-slider-label-now"
				[style.left.%]="_state.cleanValuePercent()[i]"
				[style.visibility]="_state.mixLabelDisplay() === 'visible' ? 'hidden' : 'visible'"
			>
				{{ _state.cleanValue()[i] }}</div
			>
		</ng-container>
	`,
	styleUrls: ['./slider.scss'],
})
export class NgbSlider implements OnInit, ControlValueAccessor, AfterViewInit, OnDestroy {
	/**
	 * NgbSlider element reference
	 */
	private _elementRef = inject(ElementRef);

	private _sliderValueChangeType = SliderValueChangeType;

	private resizeObserver = new ResizeObserver(() => {
		this._state.sliderDomRect.set(this._elementRef.nativeElement.getBoundingClientRect());
		this._state.minLabelDomRect.set(this._minLabelRef?.nativeElement.getBoundingClientRect());
		this._state.maxLabelDomRect.set(this._maxLabelRef?.nativeElement.getBoundingClientRect());
	});

	/**
	 * Minimum label element reference
	 */
	@ViewChild('minLabel')
	private _minLabelRef: ElementRef;
	/**
	 * Maximum label element reference
	 */
	@ViewChild('maxLabel')
	private _maxLabelRef: ElementRef;

	private _minValue: number;
	private _maxValue: number;
	private _stepSize: number;
	private _sliderValues: number[];
	private _readonly: boolean;
	private _disabled = false;

	/**
	 * SliderWidget hold the state and actions applicable to the NgbSliderComponent
	 */
	private _widget: SliderWidget;
	/**
	 * SliderState stores current model state of the NgbSliderComponent
	 */
	private _state: SliderState;

	/**
	 * The minimum value that can be assigned to the slider.
	 */
	@Input()
	set minValue(value: number) {
		this._minValue = value;
		this._state?.minValue.set(value);
	}

	get minValue(): number {
		return this._minValue;
	}

	/**
	 * The maximum value that can be assigned to the slider
	 */
	@Input()
	set maxValue(value: number) {
		this._maxValue = value;
		this._state?.maxValue.set(value);
	}

	get maxValue(): number {
		return this._maxValue;
	}

	/**
	 * Unit value between slider steps
	 */
	@Input()
	set stepSize(value: number) {
		this._stepSize = value;
		this._state?.stepSize.set(value);
	}

	get stepSize(): number {
		return this._stepSize;
	}

	/**
	 * Current slider value
	 */
	@Input()
	set sliderValues(value: number[]) {
		this._sliderValues = value;
	}

	get sliderValues(): number[] {
		return this._sliderValues;
	}

	/**
	 * If `true` slider value cannot be changed but the slider is still focusable
	 */
	@Input()
	set readonly(value: boolean) {
		this._readonly = value;
		this._state?.readonly.set(value);
	}

	get readonly(): boolean {
		return this._readonly;
	}

	/**
	 * If `true` slider value cannot be changed and the slider cannot be focused
	 */
	@Input()
	set disabled(value: boolean) {
		this._disabled = value;
		this._state?.disabled.set(value);
	}

	get disabled(): boolean {
		return this._disabled;
	}

	/**
	 * An event containing the new slider value
	 * emitted every time when the value is changed
	 */
	@Output()
	sliderValuesChange = new EventEmitter<number[]>(true);

	/**
	 * Control value accessor methods
	 */
	onChange = (_: any) => {};

	onTouched = () => {};

	registerOnChange(fn: (value: any) => any): void {
		this.onChange = fn;
		// workaround to update the value of the form when the Input value does not correspond to a real step of the slider
		if (this._state._dirtyValue().some((dh, index) => dh != this._state.cleanValue()[index])) {
			this.emitControlValues();
		}
	}

	registerOnTouched(fn: () => any): void {
		this.onTouched = fn;
	}

	writeValue(value: any): void {
		if (value instanceof Array) {
			this._state._dirtyValue.set(value);
		} else {
			this._state._dirtyValue.set([value]);
		}
	}

	setDisabledState(isDisabled: boolean) {
		this._disabled = isDisabled;
		this._state.disabled.set(isDisabled);
	}

	ngOnInit() {
		this._widget = createSlider({
			minValue: this.minValue,
			maxValue: this.maxValue,
			stepSize: this.stepSize,
			sliderValues: this.sliderValues,
			readonly: this.readonly,
			disabled: this.disabled,
		});
		this._state = this._widget.state;

		// handle the case of the invalid value entered by the user
		this.emitControlValues();
	}

	ngAfterViewInit() {
		this.resizeObserver.observe(this._elementRef.nativeElement);
	}

	ngOnDestroy() {
		this.resizeObserver.unobserve(this._elementRef.nativeElement);
	}

	handleBlur() {
		this.onTouched();
	}

	/**
	 * Method that holds all the necessary emits to update the input value of the slider
	 */
	emitControlValues() {
		this.onChange(this._state.sortedCleanValue());
		this.sliderValuesChange.emit(this.sliderValues);
		this.onTouched();
	}

	/**
	 * Wrapper method to process the model changes and call the value setter
	 * @param value new clicked coordinate or the numberic number of a pressed key
	 * @param changeType type of the provided value: COORDINATE or KEY
	 */
	sliderValueChange(value: number, changeType: SliderValueChangeType, handleNumber?: number) {
		switch (changeType) {
			case SliderValueChangeType.COORDINATE:
				this._widget.actions.adjustCoordinate(value, handleNumber);
				break;
			case SliderValueChangeType.KEY:
				this._widget.actions.onKeydown(value, handleNumber!);
				break;
			default:
				break;
		}
		if (this._state._dirtyValue().some((sch, index) => sch != this._state.cleanValue()[index])) {
			this.sliderValues = this._state.sortedCleanValue();
			this.emitControlValues();
		}
	}
}

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

	minValue: WritableSignal<number>;
	maxValue: WritableSignal<number>;
	stepSize: WritableSignal<number>;
	readonly: WritableSignal<boolean>;
	disabled: WritableSignal<boolean>;
	minLabelDomRect: WritableSignal<DOMRect>;
	maxLabelDomRect: WritableSignal<DOMRect>;
	sliderDomRect: WritableSignal<DOMRect>;
}

/**
 * Holds the available actions that can be applied to the slider
 */
export interface SliderActions {
	adjustCoordinate(coordinate: number, handleNumber?: number): void;
	onKeydown(key: number, handleNumber: number): void;
}

/**
 * Wrapper interface that holds everything that corresponds to the slider
 */
export interface SliderWidget {
	actions: SliderActions;
	state: SliderState;
}

/**
 * Method to populate the slider widget based on the input configuration
 * @param config input configuration
 * @returns populated SliderWidget object
 */
export function createSlider(config?: Partial<NgbSliderConfig>): SliderWidget {
	const _dirtyValue = signal(config?.sliderValues ?? [...NgbDefaultSliderConfig.sliderValues]);

	// validation in case of equal min and max values
	let min = config?.minValue ?? NgbDefaultSliderConfig.minValue;
	let max = config?.maxValue ?? NgbDefaultSliderConfig.maxValue;
	if (min === max) {
		min = NgbDefaultSliderConfig.minValue;
		max = NgbDefaultSliderConfig.maxValue;
	}
	const minValue = signal(Math.min(min, max));
	const maxValue = signal(Math.max(min, max));

	const stepSize = signal(config?.stepSize || NgbDefaultSliderConfig.stepSize);
	const readonly = signal(config?.readonly ?? NgbDefaultSliderConfig.readonly);
	const disabled = signal(config?.disabled ?? NgbDefaultSliderConfig.disabled);

	const sliderDomRect: WritableSignal<DOMRect> = signal(new DOMRect());
	const minLabelDomRect: WritableSignal<DOMRect> = signal(new DOMRect());
	const maxLabelDomRect: WritableSignal<DOMRect> = signal(new DOMRect());

	const valueCompute = (value: number) => {
		if (value >= maxValue()) {
			return maxValue();
		} else if (value <= minValue()) {
			return minValue();
		}
		const indexMin = Math.floor(value / stepSize());
		return value % stepSize() < stepSize() / 2 ? indexMin * stepSize() : (indexMin + 1) * stepSize();
	};

	const cleanValue = computed(() => {
		return _dirtyValue().map((dh) => {
			return valueCompute(dh);
		});
	});

	const sortedCleanValue = computed(() => [...cleanValue()].sort((a, b) => a - b));

	const percentCompute = (value: number) => {
		return ((value - minValue()) * 100) / (maxValue() - minValue());
	};

	const cleanValuePercent = computed(() => {
		return cleanValue().map((ch) => {
			return percentCompute(ch);
		});
	});

	const sortedCleanValuePercent = computed(() => [...cleanValuePercent()].sort((a, b) => a - b));

	const minLabelWidth = computed(() => (minLabelDomRect?.().width / sliderDomRect?.().width) * 100);
	const maxLabelWidth = computed(() => (maxLabelDomRect?.().width / sliderDomRect?.().width) * 100);

	const minValueLabelDisplay = computed(() =>
		cleanValuePercent().some((handle) => handle < minLabelWidth() + 1) ? 'hidden' : 'visible',
	);
	const maxValueLabelDisplay = computed(() =>
		cleanValuePercent().some((handle) => handle > 100 - maxLabelWidth() - 1) ? 'hidden' : 'visible',
	);

	// TODO: do not show labels over handles if there are more than 2 handles
	const mixLabelDisplay = computed(() => {
		return _dirtyValue().length === 2 && Math.abs(cleanValuePercent()[0] - cleanValuePercent()[1]!) <= 10
			? 'visible'
			: 'hidden';
	});

	const _isInteractable = computed(() => !disabled() && !readonly());

	const getClosestSliderHandle = (clickedPercent: number) => {
		if (_dirtyValue().length === 1) {
			return 0;
		}
		const closestBigger = sortedCleanValue().find((sch) => sch > clickedPercent * 100);
		const closestBiggerIndex = closestBigger
			? sortedCleanValue().indexOf(closestBigger!)
			: sortedCleanValue().length - 1;
		const midPoint =
			sortedCleanValue()[closestBiggerIndex - 1] +
			(sortedCleanValue()[closestBiggerIndex] - sortedCleanValue()[closestBiggerIndex - 1]) / 2;
		let closestValue: number;
		if (clickedPercent * 100 <= midPoint) {
			closestValue = sortedCleanValue()[closestBiggerIndex - 1];
		} else {
			closestValue = sortedCleanValue()[closestBiggerIndex];
		}
		return cleanValue().indexOf(closestValue);
	};

	return {
		state: {
			minValue,
			maxValue,
			stepSize,
			readonly,
			disabled,
			minLabelWidth,
			maxLabelWidth,
			minValueLabelDisplay,
			maxValueLabelDisplay,
			sliderDomRect,
			minLabelDomRect,
			maxLabelDomRect,
			mixLabelDisplay,
			_dirtyValue,
			cleanValue,
			cleanValuePercent,
			sortedCleanValue,
			sortedCleanValuePercent,
		},
		actions: {
			adjustCoordinate(clickedCoordinate: number, handleNumber?: number) {
				if (_isInteractable()) {
					const clickedPercent = (clickedCoordinate - sliderDomRect().left) / sliderDomRect().width;
					let derivedHandleIndex = handleNumber ?? getClosestSliderHandle(clickedPercent);
					const newValue = clickedPercent * (maxValue() - minValue()) + minValue();
					_dirtyValue.update((dh) => {
						dh[derivedHandleIndex] = newValue;
						return dh;
					});
				}
			},
			onKeydown(key: number, handleIndex: number) {
				if (_isInteractable()) {
					switch (key) {
						case Key.ArrowDown:
						case Key.ArrowLeft:
							_dirtyValue.update((value) => {
								value[handleIndex] = cleanValue()[handleIndex] - stepSize();
								return value;
							});
							break;
						case Key.ArrowUp:
						case Key.ArrowRight:
							_dirtyValue.update((value) => {
								value[handleIndex] = cleanValue()[handleIndex] + stepSize();
								return value;
							});
							break;
						case Key.Home:
							_dirtyValue.update((value) => {
								value[handleIndex] = minValue();
								return value;
							});
							break;
						case Key.End:
							_dirtyValue.update((value) => {
								value[handleIndex] = maxValue();
								return value;
							});
							break;
						case Key.PageUp:
							// TODO it is optional in accessibility guidelines, so define the skip value for steps and write unit test
							break;
						case Key.PageDown:
							// TODO it is optional in accessibility guidelines, so define the skip value for steps and write unit test
							break;
					}
				}
			},
		},
	};
}
