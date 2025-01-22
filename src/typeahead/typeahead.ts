import {
	afterRender,
	AfterRenderRef,
	ChangeDetectorRef,
	ComponentRef,
	Directive,
	ElementRef,
	EventEmitter,
	forwardRef,
	inject,
	Injector,
	Input,
	NgZone,
	OnChanges,
	OnDestroy,
	OnInit,
	Output,
	SimpleChanges,
	TemplateRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject, fromEvent, of, OperatorFunction, Subject, Subscription } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { Live } from '../util/accessibility/live';
import { ngbAutoClose } from '../util/autoclose';
import { PopupService } from '../util/popup';
import { ngbPositioning } from '../util/positioning';
import { isDefined, toString } from '../util/util';

import { NgbTypeaheadConfig } from './typeahead-config';
import { NgbTypeaheadWindow, ResultTemplateContext } from './typeahead-window';
import { addPopperOffset } from '../util/positioning-util';

/**
 * An event emitted right before an item is selected from the result list.
 */
export interface NgbTypeaheadSelectItemEvent<T = any> {
	/**
	 * The item from the result list about to be selected.
	 */
	item: T;

	/**
	 * Calling this function will prevent item selection from happening.
	 */
	preventDefault: () => void;
}

let nextWindowId = 0;

/**
 * A directive providing a simple way of creating powerful typeaheads from any text input.
 */
@Directive({
	selector: 'input[ngbTypeahead]',
	exportAs: 'ngbTypeahead',
	host: {
		'(blur)': 'handleBlur()',
		'[class.open]': 'isPopupOpen()',
		'(keydown)': 'handleKeyDown($event)',
		'[autocomplete]': 'autocomplete',
		autocapitalize: 'off',
		autocorrect: 'off',
		role: 'combobox',
		'[attr.aria-autocomplete]': 'showHint ? "both" : "list"',
		'[attr.aria-activedescendant]': 'activeDescendant',
		'[attr.aria-owns]': 'isPopupOpen() ? popupId : null',
		'[attr.aria-expanded]': 'isPopupOpen()',
	},
	providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NgbTypeahead), multi: true }],
})
export class NgbTypeahead implements ControlValueAccessor, OnInit, OnChanges, OnDestroy {
	private _nativeElement = inject(ElementRef).nativeElement as HTMLInputElement;
	private _config = inject(NgbTypeaheadConfig);
	private _live = inject(Live);
	private _document = inject(DOCUMENT);
	private _ngZone = inject(NgZone);
	private _changeDetector = inject(ChangeDetectorRef);
	private _injector = inject(Injector);

	private _popupService = new PopupService(NgbTypeaheadWindow);
	private _positioning = ngbPositioning();

	private _subscription: Subscription | null = null;
	private _closed$ = new Subject<void>();
	private _inputValueBackup: string | null = null;
	private _inputValueForSelectOnExact: string | null = null;
	private _valueChanges$ = fromEvent<Event>(this._nativeElement, 'input').pipe(
		map(($event) => ($event.target as HTMLInputElement).value),
	);
	private _resubscribeTypeahead$ = new BehaviorSubject(null);
	private _windowRef: ComponentRef<NgbTypeaheadWindow> | null = null;
	private _afterRenderRef: AfterRenderRef;

	/**
	 * The value for the `autocomplete` attribute for the `<input>` element.
	 *
	 * Defaults to `"off"` to disable the native browser autocomplete, but you can override it if necessary.
	 *
	 * @since 2.1.0
	 */
	@Input() autocomplete = 'off';

	/**
	 * A selector specifying the element the typeahead popup will be appended to.
	 *
	 * Currently only supports `"body"`.
	 */
	@Input() container = this._config.container;

	/**
	 * If `true`, model values will not be restricted only to items selected from the popup.
	 */
	@Input() editable = this._config.editable;

	/**
	 * If `true`, the first item in the result list will always stay focused while typing.
	 */
	@Input() focusFirst = this._config.focusFirst;

	/**
	 * The function that converts an item from the result list to a `string` to display in the `<input>` field.
	 *
	 * It is called when the user selects something in the popup or the model value changes, so the input needs to
	 * be updated.
	 */
	@Input() inputFormatter: (item: any) => string;

	/**
	 * The function that converts a stream of text values from the `<input>` element to the stream of the array of items
	 * to display in the typeahead popup.
	 *
	 * If the resulting observable emits a non-empty array - the popup will be shown. If it emits an empty array - the
	 * popup will be closed.
	 *
	 * See the [basic example](#/components/typeahead/examples#basic) for more details.
	 *
	 * Note that the `this` argument is `undefined` so you need to explicitly bind it to a desired "this" target.
	 */
	@Input() ngbTypeahead: OperatorFunction<string, readonly any[]> | null | undefined;

	/**
	 * The function that converts an item from the result list to a `string` to display in the popup.
	 *
	 * Must be provided, if your `ngbTypeahead` returns something other than `Observable<string[]>`.
	 *
	 * Alternatively for more complex markup in the popup you should use `resultTemplate`.
	 */
	@Input() resultFormatter: (item: any) => string;

	/**
	 * The template to override the way resulting items are displayed in the popup.
	 *
	 * See the [ResultTemplateContext](#/components/typeahead/api#ResultTemplateContext) for the template context.
	 *
	 * Also see the [template for results demo](#/components/typeahead/examples#template) for more details.
	 */
	@Input() resultTemplate: TemplateRef<ResultTemplateContext>;

	/**
	 * If `true`, automatically selects the item when it is the only one that exactly matches the user input
	 *
	 * @since 14.2.0
	 */
	@Input() selectOnExact = this._config.selectOnExact;

	/**
	 * If `true`, will show the hint in the `<input>` when an item in the result list matches.
	 */
	@Input() showHint = this._config.showHint;

	/**
	 * The preferred placement of the typeahead, among the [possible values](#/guides/positioning#api).
	 *
	 * The default order of preference is `"bottom-start bottom-end top-start top-end"`
	 *
	 * Please see the [positioning overview](#/positioning) for more details.
	 */
	@Input() placement = this._config.placement;

	/**
	 * Allows to change default Popper options when positioning the typeahead.
	 * Receives current popper options and returns modified ones.
	 *
	 * @since 13.1.0
	 */
	@Input() popperOptions = this._config.popperOptions;

	/**
	 * A custom class to append to the typeahead popup window
	 *
	 * Accepts a string containing CSS class to be applied on the `ngb-typeahead-window`.
	 *
	 * This can be used to provide instance-specific styling, ex. you can override popup window `z-index`
	 *
	 * @since 9.1.0
	 */
	@Input() popupClass: string;

	/**
	 * An event emitted right before an item is selected from the result list.
	 *
	 * Event payload is of type [`NgbTypeaheadSelectItemEvent`](#/components/typeahead/api#NgbTypeaheadSelectItemEvent).
	 */
	@Output() selectItem = new EventEmitter<NgbTypeaheadSelectItemEvent>();

	activeDescendant: string | null = null;
	popupId = `ngb-typeahead-${nextWindowId++}`;

	private _onTouched = () => {};
	private _onChange = (_: any) => {};

	ngOnInit(): void {
		this._subscribeToUserInput();
	}

	ngOnChanges({ ngbTypeahead }: SimpleChanges): void {
		if (ngbTypeahead && !ngbTypeahead.firstChange) {
			this._unsubscribeFromUserInput();
			this._subscribeToUserInput();
		}
	}

	ngOnDestroy(): void {
		this._closePopup();
		this._unsubscribeFromUserInput();
	}

	registerOnChange(fn: (value: any) => any): void {
		this._onChange = fn;
	}

	registerOnTouched(fn: () => any): void {
		this._onTouched = fn;
	}

	writeValue(value) {
		this._writeInputValue(this._formatItemForInput(value));
		if (this.showHint) {
			this._inputValueBackup = value;
		}
	}

	setDisabledState(isDisabled: boolean): void {
		this._nativeElement.disabled = isDisabled;
	}

	/**
	 * Dismisses typeahead popup window
	 */
	dismissPopup() {
		if (this.isPopupOpen()) {
			this._resubscribeTypeahead$.next(null);
			this._closePopup();
			if (this.showHint && this._inputValueBackup !== null) {
				this._writeInputValue(this._inputValueBackup);
			}
			this._changeDetector.markForCheck();
		}
	}

	/**
	 * Returns true if the typeahead popup window is displayed
	 */
	isPopupOpen() {
		return this._windowRef != null;
	}

	handleBlur() {
		this._resubscribeTypeahead$.next(null);
		this._onTouched();
	}

	handleKeyDown(event: KeyboardEvent) {
		if (!this.isPopupOpen()) {
			return;
		}

		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault();
				this._windowRef!.instance.next();
				this._showHint();
				break;
			case 'ArrowUp':
				event.preventDefault();
				this._windowRef!.instance.prev();
				this._showHint();
				break;
			case 'Enter':
			case 'Tab': {
				const result = this._windowRef!.instance.getActive();
				if (isDefined(result)) {
					event.preventDefault();
					event.stopPropagation();
					this._selectResult(result);
				}
				this._closePopup();
				break;
			}
		}
	}

	private _openPopup() {
		if (!this.isPopupOpen()) {
			this._inputValueBackup = this._nativeElement.value;
			const { windowRef } = this._popupService.open();
			this._windowRef = windowRef;
			this._windowRef.setInput('id', this.popupId);
			this._windowRef.setInput('popupClass', this.popupClass);
			this._windowRef.instance.selectEvent.subscribe((result: any) => this._selectResultClosePopup(result));
			this._windowRef.instance.activeChangeEvent.subscribe((activeId: string) => (this.activeDescendant = activeId));

			if (this.container === 'body') {
				(this._windowRef.location.nativeElement as HTMLElement).style.zIndex = '1055';
				this._document.body.appendChild(this._windowRef.location.nativeElement);
			}

			this._changeDetector.markForCheck();

			// Setting up popper and scheduling updates when zone is stable
			this._ngZone.runOutsideAngular(() => {
				if (this._windowRef) {
					this._positioning.createPopper({
						hostElement: this._nativeElement,
						targetElement: this._windowRef.location.nativeElement,
						placement: this.placement,
						updatePopperOptions: (options) => this.popperOptions(addPopperOffset([0, 2])(options)),
					});

					this._afterRenderRef = afterRender(
						{
							mixedReadWrite: () => {
								this._positioning.update();
							},
						},
						{ injector: this._injector },
					);
				}
			});

			ngbAutoClose(this._ngZone, this._document, 'outside', () => this.dismissPopup(), this._closed$, [
				this._nativeElement,
				this._windowRef.location.nativeElement,
			]);
		}
	}

	private _closePopup() {
		this._popupService.close().subscribe(() => {
			this._positioning.destroy();
			this._afterRenderRef?.destroy();
			this._closed$.next();
			this._windowRef = null;
			this.activeDescendant = null;
		});
	}

	private _selectResult(result: any) {
		let defaultPrevented = false;
		this.selectItem.emit({
			item: result,
			preventDefault: () => {
				defaultPrevented = true;
			},
		});
		this._resubscribeTypeahead$.next(null);

		if (!defaultPrevented) {
			this.writeValue(result);
			this._onChange(result);
		}
	}

	private _selectResultClosePopup(result: any) {
		this._selectResult(result);
		this._closePopup();
	}

	private _showHint() {
		if (this.showHint && this._windowRef?.instance.hasActive() && this._inputValueBackup != null) {
			const userInputLowerCase = this._inputValueBackup.toLowerCase();
			const formattedVal = this._formatItemForInput(this._windowRef.instance.getActive());

			if (userInputLowerCase === formattedVal.substring(0, this._inputValueBackup.length).toLowerCase()) {
				this._writeInputValue(this._inputValueBackup + formattedVal.substring(this._inputValueBackup.length));
				this._nativeElement['setSelectionRange'].apply(this._nativeElement, [
					this._inputValueBackup.length,
					formattedVal.length,
				]);
			} else {
				this._writeInputValue(formattedVal);
			}
		}
	}

	private _formatItemForInput(item: any): string {
		return item != null && this.inputFormatter ? this.inputFormatter(item) : toString(item);
	}

	private _writeInputValue(value: string): void {
		this._nativeElement.value = toString(value);
	}

	private _subscribeToUserInput(): void {
		const results$ = this._valueChanges$.pipe(
			tap((value) => {
				this._inputValueBackup = this.showHint ? value : null;
				this._inputValueForSelectOnExact = this.selectOnExact ? value : null;
				this._onChange(this.editable ? value : undefined);
			}),
			this.ngbTypeahead ? this.ngbTypeahead : () => of([]),
		);

		this._subscription = this._resubscribeTypeahead$.pipe(switchMap(() => results$)).subscribe((results) => {
			if (!results || results.length === 0) {
				this._closePopup();
			} else {
				// when there is only one result and this matches the input value
				if (
					this.selectOnExact &&
					results.length === 1 &&
					this._formatItemForInput(results[0]) === this._inputValueForSelectOnExact
				) {
					this._selectResult(results[0]);
					this._closePopup();
				} else {
					this._openPopup();
					this._windowRef!.setInput('focusFirst', this.focusFirst);
					this._windowRef!.setInput('results', results);
					this._windowRef!.setInput('term', this._nativeElement.value);
					if (this.resultFormatter) {
						this._windowRef!.setInput('formatter', this.resultFormatter);
					}
					if (this.resultTemplate) {
						this._windowRef!.setInput('resultTemplate', this.resultTemplate);
					}
					this._windowRef!.instance.resetActive();

					// The observable stream we are subscribing to might have async steps
					// and if a component containing typeahead is using the OnPush strategy
					// the change detection turn wouldn't be invoked automatically.
					this._windowRef!.changeDetectorRef.detectChanges();

					this._showHint();
				}
			}

			// live announcer
			const count = results ? results.length : 0;
			this._live.say(count === 0 ? 'No results available' : `${count} result${count === 1 ? '' : 's'} available`);
		});
	}

	private _unsubscribeFromUserInput() {
		if (this._subscription) {
			this._subscription.unsubscribe();
		}
		this._subscription = null;
	}
}
