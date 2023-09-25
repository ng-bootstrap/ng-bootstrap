import { NgFor, NgIf } from '@angular/common';
import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	computed,
	DestroyRef,
	Directive,
	ElementRef,
	EventEmitter,
	forwardRef,
	inject,
	Input,
	NgZone,
	OnDestroy,
	OnInit,
	Output,
	signal,
	ViewChild,
	ViewEncapsulation,
	WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { skip } from 'rxjs';
import { Key } from '../util/key';
import { NgbSliderConfig } from './slider-config';
import { SliderWidget } from './slider.model';

/**
 * A directive that is responsible for:
 * the click and keyboard even capture and propagation
 * positioning of the slider handle
 */
@Directive({
	selector: '[ngbSliderHandle]',
	standalone: true,
	host: {
		class: 'ngb-slider-handle',
		'[class]': "sliderWidget.state.vertical() ? 'ngb-slider-handle-vertical' : 'ngb-slider-handle-horizontal'",
		'[style.left.%]': 'sliderWidget.state.handleTooltipLeft()[sliderIndex]',
		'[style.top.%]': 'sliderWidget.state.handleTooltipTop()[sliderIndex]',
		'(keydown)': 'sliderWidget.actions.onKeydown($event, sliderIndex)',
		'(mousedown)': 'onMouseDown($event)',
	},
})
export class NgbSliderHandleDirective {
	private _elementRef = inject(ElementRef);
	private _zone = inject(NgZone);
	// needed to avoid changedetection on the mouse move over the same coordinate (vertical or horizonal movement)
	private _prevCoordinate = -1;

	/**
	 * Slider component state and events
	 */
	@Input() sliderWidget: SliderWidget;

	/**
	 * Index of the slider handle
	 */
	@Input() sliderIndex: number;

	onMouseDown(event: MouseEvent) {
		this._elementRef.nativeElement.focus();
		this.sliderWidget.state.sliderDomRect.set(this._elementRef.nativeElement.parentElement.getBoundingClientRect());
		event.preventDefault();
		const handleDrag = (e: MouseEvent) => this.elementDrag(e);
		this.sliderWidget.state.internalChange.set(true);
		this._zone.runOutsideAngular(() => {
			document.addEventListener('mousemove', handleDrag);
		});
		document.addEventListener(
			'mouseup',
			() => {
				document.removeEventListener('mousemove', handleDrag);
				this.sliderWidget.state.internalChange.set(false);
			},
			{ once: true },
		);
	}

	private elementDrag(e: MouseEvent) {
		e.preventDefault();
		const newCoord = this.sliderWidget.state.vertical() ? e.clientY : e.clientX;
		if (!this.sliderWidget.state.readonly() && !this.sliderWidget.state.disabled()) {
			this._elementRef.nativeElement.focus();
		}
		if (this._prevCoordinate !== newCoord) {
			this._prevCoordinate = newCoord;
			this._zone.run(() => {
				this.sliderWidget.actions.adjustCoordinate(newCoord, this.sliderIndex);
			});
		}
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
		'[class]': 'widget.state.vertical() ? "ngb-slider-vertical" : "ngb-slider-horizontal"',
		'(blur)': 'handleBlur()',
	},
	template: `
		<div
			[class]="widget.state.vertical() ? 'ngb-clickable-slider-area-vertical' : 'ngb-clickable-slider-area'"
			(click)="sliderClick($event)"
		>
		</div>
		<div
			*ngFor="let repeat of [].constructor(widget.state.cleanValue().length - 1 || 1); let i = index"
			#progress
			class="ngb-slider-progress"
			[attr.disabled]="widget.state.disabled() ? true : null"
			[style.left.%]="widget.state.progressLeft()[i]"
			[style.bottom.%]="widget.state.progressBottom()[i]"
			[style.width.%]="widget.state.progressWidth()[i]"
			[style.height.%]="widget.state.progressHeight()[i]"
		></div>
		<div
			#minLabel
			[class]="
				widget.state.vertical()
					? 'ngb-slider-label-vertical ngb-slider-label-vertical-min'
					: 'ngb-slider-label ngb-slider-label-min'
			"
			[style.visibility]="widget.state.minValueLabelDisplay()"
			[attr.disabled]="widget.state.disabled() ? true : null"
		>
			{{ widget.state.minValue() }}
		</div>
		<div
			#maxLabel
			[class]="
				widget.state.vertical()
					? 'ngb-slider-label-vertical ngb-slider-label-vertical-max'
					: 'ngb-slider-label ngb-slider-label-max'
			"
			[style.visibility]="widget.state.maxValueLabelDisplay()"
			[attr.disabled]="widget.state.disabled() ? true : null"
		>
			{{ widget.state.maxValue() }}
		</div>
		<div
			[class]="
				widget.state.vertical()
					? 'ngb-slider-label-vertical ngb-slider-label-vertical-now'
					: 'ngb-slider-label ngb-slider-label-now'
			"
			[style.visibility]="widget.state.mixLabelDisplay()"
			[style.left.%]="widget.state.mixLabelLeft()"
			[style.top.%]="widget.state.mixLabelTop()"
			[attr.disabled]="widget.state.disabled() ? true : null"
		>
			{{ widget.state.sortedCleanValue()[0] }} - {{ widget.state.sortedCleanValue()[1] }}</div
		>
		<ng-template
			ngFor
			let-item
			[ngForOf]="widget.state.sortedHandleDisplay()"
			let-i="index"
			;
			[ngForTrackBy]="trackHandle"
		>
			<button
				ngbSliderHandle
				[sliderWidget]="widget"
				[sliderIndex]="item.id"
				role="slider"
				[attr.aria-valuemin]="widget.state.minValue()"
				[attr.aria-valuemax]="widget.state.maxValue()"
				[attr.aria-valuenow]="item.value"
				[attr.aria-valuetext]="item.value"
				[attr.aria-readonly]="widget.state.readonly() ? true : null"
				[attr.aria-disabled]="widget.state.disabled() ? true : null"
				[attr.disabled]="widget.state.disabled() ? true : null"
				>&nbsp;
			</button>
			<div
				[class]="
					widget.state.vertical()
						? 'ngb-slider-label-vertical ngb-slider-label-vertical-now'
						: 'ngb-slider-label ngb-slider-label-now'
				"
				[style.left.%]="widget.state.handleTooltipLeft()[i]"
				[style.top.%]="widget.state.handleTooltipTop()[i]"
				[style.visibility]="widget.state.mixLabelDisplay() === 'visible' ? 'hidden' : 'visible'"
				[attr.disabled]="widget.state.disabled() ? true : null"
			>
				{{ widget.state.cleanValue()[i] }}</div
			>
		</ng-template>
	`,
	styleUrls: ['./slider.scss'],
})
export class NgbSlider implements OnInit, ControlValueAccessor, AfterViewInit, OnDestroy {
	/**
	 * NgbSlider element reference
	 */
	private _elementRef = inject(ElementRef);
	private _destroyRef = inject(DestroyRef);

	private _resizeObserver = new ResizeObserver(() => {
		this.widget.state.sliderDomRect.set(this._elementRef.nativeElement.getBoundingClientRect());
		this.widget.state.minLabelDomRect.set(this._minLabelRef?.nativeElement.getBoundingClientRect());
		this.widget.state.maxLabelDomRect.set(this._maxLabelRef?.nativeElement.getBoundingClientRect());
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

	/**
	 * SliderWidget hold the state and actions applicable to the NgbSliderComponent
	 */
	widget: SliderWidget = createSlider(inject(NgbSliderConfig));

	/**
	 * The minimum value that can be assigned to the slider.
	 */
	@Input()
	set minValue(value: number) {
		this.widget.state.minValueDirty.set(value);
	}

	get minValue(): number {
		return this.widget.state.minValue();
	}

	/**
	 * The maximum value that can be assigned to the slider
	 */
	@Input()
	set maxValue(value: number) {
		this.widget.state.maxValueDirty.set(value);
	}

	get maxValue(): number {
		return this.widget.state.maxValue();
	}

	/**
	 * Unit value between slider steps
	 */
	@Input()
	set stepSize(value: number) {
		this.widget.state.stepSizeDirty.set(value);
	}

	get stepSize(): number {
		return this.widget.state.stepSize();
	}

	/**
	 * Current slider value
	 */
	@Input()
	set sliderValues(value: number[]) {
		// to avoid circular dependency of the value change
		if (!this.widget.state.internalChange()) {
			this.widget.state._dirtyValue.set(value);
		}
	}

	get sliderValues(): number[] {
		return this.widget.state.sortedCleanValue();
	}

	/**
	 * If `true` slider value cannot be changed but the slider is still focusable
	 */
	@Input()
	set readonly(value: boolean) {
		this.widget.state.readonly.set(value);
	}

	get readonly(): boolean {
		return this.widget.state.readonly();
	}

	/**
	 * If `true` slider value cannot be changed and the slider cannot be focused
	 */
	@Input()
	set disabled(value: boolean) {
		this.widget.state.disabled.set(value);
	}

	get disabled(): boolean {
		return this.widget.state.disabled();
	}

	/**
	 * If `true` slider is vertically positioned
	 */
	@Input()
	set vertical(value: boolean) {
		this.widget.state.vertical.set(value);
	}

	get vertical(): boolean {
		return this.widget.state.vertical();
	}

	/**
	 * An event containing the new slider value
	 * emitted every time when the value is changed
	 */
	@Output()
	sliderValuesChange = new EventEmitter<number[]>();

	/**
	 * Control value accessor methods
	 */
	onChange = (_: any) => {};

	onTouched = () => {};

	registerOnChange(fn: (value: any) => any): void {
		this.onChange = fn;
		// workaround to update the value of the form when the Input value does not correspond to a real step of the slider
		if (this.widget.state._dirtyValue().some((dh, index) => dh != this.widget.state.cleanValue()[index])) {
			this.emitControlValues();
		}
	}

	registerOnTouched(fn: () => any): void {
		this.onTouched = fn;
	}

	writeValue(value: any): void {
		if (Array.isArray(value)) {
			this.widget.state._dirtyValue.set(value);
		} else {
			this.widget.state._dirtyValue.set([value]);
		}
	}

	setDisabledState(isDisabled: boolean) {
		this.widget.state.disabled.set(isDisabled);
	}

	ngOnInit() {
		this.widget.events.onValueChange$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((value: number[]) => {
			queueMicrotask(() => {
				this.emitControlValues();
				this.sliderValuesChange.emit(value);
			});
		});
	}

	ngAfterViewInit() {
		this._resizeObserver.observe(this._elementRef.nativeElement);
	}

	ngOnDestroy() {
		this._resizeObserver.unobserve(this._elementRef.nativeElement);
	}

	handleBlur() {
		this.onTouched();
	}

	/**
	 * Method that holds all the necessary emits to update the input value of the slider
	 */
	emitControlValues() {
		this.onChange(this.widget.state.sortedCleanValue());
		this.onTouched();
	}

	sliderClick($event: any) {
		this.widget.state.sliderDomRect.set(this._elementRef.nativeElement.getBoundingClientRect());
		this.widget.actions.adjustCoordinate(this.widget.state.vertical() ? $event.clientY : $event.clientX);
	}

	trackHandle(index: number, handle: { id: number; value: number }) {
		return handle.id;
	}
}

/**
 * Method to populate the slider widget based on the input configuration
 * @param config input configuration
 * @returns populated SliderWidget object
 */
export function createSlider(config: NgbSliderConfig): SliderWidget {
	const internalChange = signal(false);
	const _dirtyValue = signal(config.sliderValues);

	// validation in case of equal min and max values
	const minValueDirty = signal(config.minValue);
	const maxValueDirty = signal(config.maxValue);

	const minValue = computed(() => {
		if (minValueDirty() === maxValueDirty()) {
			return config.minValue;
		} else {
			return Math.min(minValueDirty(), maxValueDirty());
		}
	});

	const maxValue = computed(() => {
		if (minValueDirty() === maxValueDirty()) {
			return config.maxValue;
		} else {
			return Math.max(minValueDirty(), maxValueDirty());
		}
	});

	const stepSizeDirty = signal(config.stepSize);

	const stepSize = computed(() => stepSizeDirty() || config.stepSize);
	const readonly = signal(config.readonly);
	const disabled = signal(config.disabled);
	const vertical = signal(config.vertical);

	const sliderDomRect: WritableSignal<DOMRect> = signal(new DOMRect());
	const minLabelDomRect: WritableSignal<DOMRect> = signal(new DOMRect());
	const maxLabelDomRect: WritableSignal<DOMRect> = signal(new DOMRect());

	const _sliderDomRectOffset = computed(() => (vertical() ? sliderDomRect().top : sliderDomRect().left));
	const _sliderDomRectSize = computed(() => (vertical() ? sliderDomRect().height : sliderDomRect().width));

	const progressLeft = computed(() =>
		vertical()
			? Array(sortedCleanValuePercent().length).fill(0)
			: sortedCleanValuePercent().length === 1
			? [0]
			: sortedCleanValuePercent(),
	);
	const progressBottom = computed(() =>
		vertical()
			? sortedCleanValuePercent().length === 1
				? [0]
				: sortedCleanValuePercent()
			: Array(sortedCleanValuePercent().length).fill(0),
	);
	const progressWidth = computed(() =>
		vertical()
			? Array(sortedCleanValuePercent().length).fill(100)
			: sortedCleanValuePercent().length === 1
			? sortedCleanValuePercent()
			: sortedCleanValuePercent().map((cvp, index, array) => {
					if (index === array.length) {
						return cvp;
					} else {
						return array[index + 1] - cvp;
					}
			  }),
	);
	const progressHeight = computed(() =>
		vertical()
			? sortedCleanValuePercent().length === 1
				? sortedCleanValuePercent()
				: sortedCleanValuePercent().map((cvp, index, array) => {
						if (index === array.length) {
							return cvp;
						} else {
							return array[index + 1] - cvp;
						}
				  })
			: Array(sortedCleanValuePercent().length).fill(100),
	);

	const mixLabelLeft = computed(() =>
		vertical() || sortedCleanValuePercent().length != 2
			? 0
			: (sortedCleanValuePercent()[0] + sortedCleanValuePercent()[1]) / 2,
	);
	const mixLabelTop = computed(() =>
		vertical() && sortedCleanValuePercent().length === 2
			? 100 - (sortedCleanValuePercent()[0] + sortedCleanValuePercent()[1]) / 2
			: 0,
	);

	const handleTooltipLeft = computed(() =>
		vertical() ? Array(cleanValuePercent().length).fill(0) : cleanValuePercent(),
	);
	const handleTooltipTop = computed(() =>
		vertical() ? cleanValuePercent().map((cvp) => 100 - cvp) : Array(cleanValuePercent().length).fill(0),
	);

	const valueCompute = (value: number) => {
		if (value >= maxValue()) {
			return maxValue();
		} else if (value <= minValue()) {
			return minValue();
		}
		const indexMin = Math.floor(value / stepSize());
		return value % stepSize() < stepSize() / 2 ? indexMin * stepSize() : (indexMin + 1) * stepSize();
	};

	const cleanValue = computed(
		() => {
			return _dirtyValue().map((dh) => {
				return valueCompute(dh);
			});
		},
		{
			equal: (a, b) => a.every((val, index) => val === b[index]),
		},
	);

	const sortedCleanValue = computed(() => [...cleanValue()].sort((a, b) => a - b));
	const sortedHandleDisplay = computed(() =>
		cleanValue()
			.map((cv, index) => {
				return { id: index, value: cv };
			})
			.sort((a, b) => a.value - b.value),
	);

	const percentCompute = (value: number) => {
		return ((value - minValue()) * 100) / (maxValue() - minValue());
	};

	const cleanValuePercent = computed(() => {
		return cleanValue().map((ch) => {
			return percentCompute(ch);
		});
	});

	const sortedCleanValuePercent = computed(() => [...cleanValuePercent()].sort((a, b) => a - b));

	const minLabelWidth = computed(() => (minLabelDomRect?.().width / _sliderDomRectSize()) * 100);
	const maxLabelWidth = computed(() => (maxLabelDomRect?.().width / _sliderDomRectSize()) * 100);

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
			vertical,
			progressLeft,
			progressBottom,
			progressHeight,
			progressWidth,
			mixLabelLeft,
			mixLabelTop,
			handleTooltipLeft,
			handleTooltipTop,
			internalChange,
			sortedHandleDisplay,
			minValueDirty,
			maxValueDirty,
			stepSizeDirty
		},
		actions: {
			adjustCoordinate(clickedCoordinate: number, handleNumber?: number) {
				if (_isInteractable()) {
					const clickedPercent = vertical()
						? (_sliderDomRectSize() - clickedCoordinate + _sliderDomRectOffset()) / _sliderDomRectSize()
						: (clickedCoordinate - _sliderDomRectOffset()) / _sliderDomRectSize();
					let derivedHandleIndex = handleNumber ?? getClosestSliderHandle(clickedPercent);
					const newValue = clickedPercent * (maxValue() - minValue()) + minValue();
					_dirtyValue.update((dh) => {
						dh[derivedHandleIndex] = newValue;
						return dh;
					});
				}
			},
			onKeydown(event: KeyboardEvent, handleIndex: number) {
				if (_isInteractable()) {
					// eslint-disable-next-line deprecation/deprecation
					switch (event.which) {
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
						default:
							return;
					}
					event.preventDefault();
					event.stopPropagation();
				}
			},
		},
		events: {
			onValueChange$: toObservable(sortedCleanValue).pipe(skip(2)),
		},
	};
}
