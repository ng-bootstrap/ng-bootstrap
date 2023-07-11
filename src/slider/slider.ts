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
	imports: [NgbSliderHandleDirective],
	host: {
		'(click)': 'sliderValueChange($event.clientX, _sliderValueChangeType.COORDINATE)',
		role: 'slider',
		'[attr.aria-valuemin]': '_state.minValue()',
		'[attr.aria-valuemax]': '_state.maxValue()',
		'[attr.aria-valuenow]': '_state.handleValue()',
		'[attr.aria-valuetext]': '_state.handleValue()',
		'[attr.aria-readonly]': '_state.readonly() ? true : null',
		'[attr.aria-disabled]': '_state.disabled() ? true : null',
		'[attr.disabled]': '_state.disabled() ? true : null',
		'(blur)': 'handleBlur()',
	},
	template: `
		<div
			#progress
			class="ngb-slider-progress"
			[attr.disabled]="_state.disabled() ? true : null"
			[style.width.%]="_state.handleValuePercent()"
		></div>
		<div #minLabel class="ngb-slider-label ngb-slider-label-min" [style.visibility]="_state.minValueLabelDisplay()">
			{{ _state.minValue() }}
		</div>
		<div #maxLabel class="ngb-slider-label ngb-slider-label-max" [style.visibility]="_state.maxValueLabelDisplay()">
			{{ _state.maxValue() }}
		</div>
		<div class="ngb-slider-label ngb-slider-label-now" [style.left.%]="_state.handleValuePercent()">
			{{ _state.handleValue() }}</div
		>
		<button
			ngbSliderHandle
			[sliderHandle]="_state.handleValuePercent()"
			[attr.disabled]="_state.disabled() ? true : null"
			(sliderCoordinateMove)="sliderValueChange($event, _sliderValueChangeType.COORDINATE)"
			(sliderKeydown)="sliderValueChange($event, _sliderValueChangeType.KEY)"
			>&nbsp;
		</button>
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
	private _value: number;
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
	set value(value: number) {
		this._value = value;
	}

	get value(): number {
		return this._value;
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
	valueChange = new EventEmitter<number>(true);

	/**
	 * Control value accessor methods
	 */
	onChange = (_: any) => {};

	onTouched = () => {};

	registerOnChange(fn: (value: any) => any): void {
		this.onChange = fn;
		// workaround to update the value of the form when the Input value does not correspond to a real step of the slider
		if (this._state._dirtyValue() !== this._state.handleValue()) {
			this.emitControlValues();
		}
	}

	registerOnTouched(fn: () => any): void {
		this.onTouched = fn;
	}

	writeValue(value: number): void {
		this._state._dirtyValue.set(value);
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
			value: this.value,
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
		this.onChange(this._state.handleValue());
		this.valueChange.emit(this._state.handleValue());
		this.onTouched();
	}

	/**
	 * Wrapper method to process the model changes and call the value setter
	 * @param value new clicked coordinate or the numberic number of a pressed key
	 * @param changeType type of the provided value: COORDINATE or KEY
	 */
	sliderValueChange(value: number, changeType: SliderValueChangeType) {
		switch (changeType) {
			case SliderValueChangeType.COORDINATE:
				this._widget.actions.adjustCoordinate(value);
				break;
			case SliderValueChangeType.KEY:
				this._widget.actions.onKeydown(value);
				break;
			default:
				break;
		}
		if (this.value !== this._widget?.state.handleValue()) {
			this.value = this._widget?.state.handleValue();
			this.emitControlValues();
		}
	}
}

/**
 * Holds all the required values to draw and manage the slider
 */
export interface SliderState {
	handleValue: Signal<number>;
	minLabelWidth: Signal<number>;
	maxLabelWidth: Signal<number>;
	minValueLabelDisplay: Signal<string>;
	maxValueLabelDisplay: Signal<string>;
	handleValuePercent: Signal<number>;

	_dirtyValue: WritableSignal<number>;
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
	adjustCoordinate(coordinate: number): void;
	onKeydown(key: number): void;
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
	const _dirtyValue = signal(config?.value ?? NgbDefaultSliderConfig.value);

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

	const handleValue = computed(() => {
		if (_dirtyValue() >= maxValue()) {
			return maxValue();
		} else if (_dirtyValue() <= minValue()) {
			return minValue();
		}
		const indexMin = Math.floor(_dirtyValue() / stepSize());
		return _dirtyValue() % stepSize() < stepSize() / 2 ? indexMin * stepSize() : (indexMin + 1) * stepSize();
	});

	const handleValuePercent = computed(() => {
		return ((handleValue() - minValue()) * 100) / (maxValue() - minValue());
	});

	const minLabelWidth = computed(() => (minLabelDomRect?.().width / sliderDomRect?.().width) * 100);
	const maxLabelWidth = computed(() => (maxLabelDomRect?.().width / sliderDomRect?.().width) * 100);

	const minValueLabelDisplay = computed(() => (handleValuePercent?.() < minLabelWidth() + 1 ? 'hidden' : 'visible'));
	const maxValueLabelDisplay = computed(() =>
		handleValuePercent?.() > 100 - maxLabelWidth() - 1 ? 'hidden' : 'visible',
	);

	const _isInteractable = computed(() => !disabled() && !readonly());

	return {
		state: {
			_dirtyValue,
			minValue,
			maxValue,
			stepSize,
			readonly,
			disabled,
			handleValue,
			minLabelWidth,
			maxLabelWidth,
			minValueLabelDisplay,
			maxValueLabelDisplay,
			sliderDomRect,
			minLabelDomRect,
			maxLabelDomRect,
			handleValuePercent,
		},
		actions: {
			adjustCoordinate(clickedCoordinate: number) {
				if (_isInteractable()) {
					const clickedPercent = (clickedCoordinate - sliderDomRect().left) / sliderDomRect().width;
					_dirtyValue.set(clickedPercent * (maxValue() - minValue()) + minValue());
				}
			},
			onKeydown(key: number) {
				if (_isInteractable()) {
					switch (key) {
						case Key.ArrowDown:
						case Key.ArrowLeft:
							_dirtyValue.set(handleValue() - stepSize());
							break;
						case Key.ArrowUp:
						case Key.ArrowRight:
							_dirtyValue.set(handleValue() + stepSize());
							break;
						case Key.Home:
							_dirtyValue.set(minValue());
							break;
						case Key.End:
							_dirtyValue.set(maxValue());
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
