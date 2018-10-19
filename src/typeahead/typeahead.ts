import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  ElementRef,
  EventEmitter,
  forwardRef,
  Injector,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {Observable, BehaviorSubject, Subscription, fromEvent} from 'rxjs';
import {positionElements, PlacementArray} from '../util/positioning';
import {NgbTypeaheadWindow, ResultTemplateContext} from './typeahead-window';
import {PopupService} from '../util/popup';
import {toString, isDefined} from '../util/util';
import {Key} from '../util/key';
import {Live} from '../util/accessibility/live';
import {NgbTypeaheadConfig} from './typeahead-config';
import {map, switchMap, tap} from 'rxjs/operators';

const NGB_TYPEAHEAD_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NgbTypeahead),
  multi: true
};

/**
 * Payload of the selectItem event.
 */
export interface NgbTypeaheadSelectItemEvent {
  /**
   * An item about to be selected
   */
  item: any;

  /**
   * Function that will prevent item selection if called
   */
  preventDefault: () => void;
}

let nextWindowId = 0;

/**
 * NgbTypeahead directive provides a simple way of creating powerful typeaheads from any text input
 */
@Directive({
  selector: 'input[ngbTypeahead]',
  exportAs: 'ngbTypeahead',
  host: {
    '(blur)': 'handleBlur()',
    '[class.open]': 'isPopupOpen()',
    '(document:click)': 'onDocumentClick($event)',
    '(keydown)': 'handleKeyDown($event)',
    '[autocomplete]': 'autocomplete',
    'autocapitalize': 'off',
    'autocorrect': 'off',
    'role': 'combobox',
    'aria-multiline': 'false',
    '[attr.aria-autocomplete]': 'showHint ? "both" : "list"',
    '[attr.aria-activedescendant]': 'activeDescendant',
    '[attr.aria-owns]': 'isPopupOpen() ? popupId : null',
    '[attr.aria-expanded]': 'isPopupOpen()'
  },
  providers: [NGB_TYPEAHEAD_VALUE_ACCESSOR]
})
export class NgbTypeahead implements ControlValueAccessor,
    OnInit, OnDestroy {
  private _popupService: PopupService<NgbTypeaheadWindow>;
  private _subscription: Subscription;
  private _inputValueBackup: string;
  private _valueChanges: Observable<string>;
  private _resubscribeTypeahead: BehaviorSubject<any>;
  private _windowRef: ComponentRef<NgbTypeaheadWindow>;
  private _zoneSubscription: any;

  /**
   * Value for the configurable autocomplete attribute.
   * Defaults to 'off' to disable the native browser autocomplete, but this standard value does not seem
   * to be always correctly taken into account.
   *
   * @since 2.1.0
   */
  @Input() autocomplete = 'off';

  /**
   * A selector specifying the element the tooltip should be appended to.
   * Currently only supports "body".
   */
  @Input() container: string;

  /**
   * A flag indicating if model values should be restricted to the ones selected from the popup only.
   */
  @Input() editable: boolean;

  /**
   * A flag indicating if the first match should automatically be focused as you type.
   */
  @Input() focusFirst: boolean;

  /**
   * A function to convert a given value into string to display in the input field
   */
  @Input() inputFormatter: (value: any) => string;

  /**
   * A function to transform the provided observable text into the array of results.  Note that the "this" argument
   * is undefined so you need to explicitly bind it to a desired "this" target.
   */
  @Input() ngbTypeahead: (text: Observable<string>) => Observable<any[]>;

  /**
   * A function to format a given result before display. This function should return a formatted string without any
   * HTML markup
   */
  @Input() resultFormatter: (value: any) => string;

  /**
   * A template to override a matching result default display
   */
  @Input() resultTemplate: TemplateRef<ResultTemplateContext>;

  /**
   * Show hint when an option in the result list matches.
   */
  @Input() showHint: boolean;

  /** Placement of a typeahead accepts:
   *    "top", "top-left", "top-right", "bottom", "bottom-left", "bottom-right",
   *    "left", "left-top", "left-bottom", "right", "right-top", "right-bottom"
   * and array of above values.
  */
  @Input() placement: PlacementArray = 'bottom-left';

  /**
   * An event emitted when a match is selected. Event payload is of type NgbTypeaheadSelectItemEvent.
   */
  @Output() selectItem = new EventEmitter<NgbTypeaheadSelectItemEvent>();

  activeDescendant: string;
  popupId = `ngb-typeahead-${nextWindowId++}`;

  private _onTouched = () => {};
  private _onChange = (_: any) => {};

  constructor(
      private _elementRef: ElementRef<HTMLInputElement>, private _viewContainerRef: ViewContainerRef,
      private _renderer: Renderer2, private _injector: Injector, componentFactoryResolver: ComponentFactoryResolver,
      config: NgbTypeaheadConfig, ngZone: NgZone, private _live: Live) {
    this.container = config.container;
    this.editable = config.editable;
    this.focusFirst = config.focusFirst;
    this.showHint = config.showHint;
    this.placement = config.placement;

    this._valueChanges = fromEvent<Event>(_elementRef.nativeElement, 'input')
                             .pipe(map($event => ($event.target as HTMLInputElement).value));

    this._resubscribeTypeahead = new BehaviorSubject(null);

    this._popupService = new PopupService<NgbTypeaheadWindow>(
        NgbTypeaheadWindow, _injector, _viewContainerRef, _renderer, componentFactoryResolver);

    this._zoneSubscription = ngZone.onStable.subscribe(() => {
      if (this.isPopupOpen()) {
        positionElements(
            this._elementRef.nativeElement, this._windowRef.location.nativeElement, this.placement,
            this.container === 'body');
      }
    });
  }

  ngOnInit(): void {
    const inputValues$ = this._valueChanges.pipe(tap(value => {
      this._inputValueBackup = value;
      if (this.editable) {
        this._onChange(value);
      }
    }));
    const results$ = inputValues$.pipe(this.ngbTypeahead);
    const processedResults$ = results$.pipe(tap(() => {
      if (!this.editable) {
        this._onChange(undefined);
      }
    }));
    const userInput$ = this._resubscribeTypeahead.pipe(switchMap(() => processedResults$));
    this._subscription = this._subscribeToUserInput(userInput$);
  }

  ngOnDestroy(): void {
    this._closePopup();
    this._unsubscribeFromUserInput();
    this._zoneSubscription.unsubscribe();
  }

  registerOnChange(fn: (value: any) => any): void { this._onChange = fn; }

  registerOnTouched(fn: () => any): void { this._onTouched = fn; }

  writeValue(value) { this._writeInputValue(this._formatItemForInput(value)); }

  setDisabledState(isDisabled: boolean): void {
    this._renderer.setProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
  }

  onDocumentClick(event) {
    if (event.target !== this._elementRef.nativeElement) {
      this.dismissPopup();
    }
  }

  /**
   * Dismisses typeahead popup window
   */
  dismissPopup() {
    if (this.isPopupOpen()) {
      this._closePopup();
      this._writeInputValue(this._inputValueBackup);
    }
  }

  /**
   * Returns true if the typeahead popup window is displayed
   */
  isPopupOpen() { return this._windowRef != null; }

  handleBlur() {
    this._resubscribeTypeahead.next(null);
    this._onTouched();
  }

  handleKeyDown(event: KeyboardEvent) {
    if (!this.isPopupOpen()) {
      return;
    }

    // tslint:disable-next-line:deprecation
    const {which} = event;
    if (Key[toString(which)]) {
      switch (which) {
        case Key.ArrowDown:
          event.preventDefault();
          this._windowRef.instance.next();
          this._showHint();
          break;
        case Key.ArrowUp:
          event.preventDefault();
          this._windowRef.instance.prev();
          this._showHint();
          break;
        case Key.Enter:
        case Key.Tab:
          const result = this._windowRef.instance.getActive();
          if (isDefined(result)) {
            event.preventDefault();
            event.stopPropagation();
            this._selectResult(result);
          }
          this._closePopup();
          break;
        case Key.Escape:
          event.preventDefault();
          this._resubscribeTypeahead.next(null);
          this.dismissPopup();
          break;
      }
    }
  }

  private _openPopup() {
    if (!this.isPopupOpen()) {
      this._inputValueBackup = this._elementRef.nativeElement.value;
      this._windowRef = this._popupService.open();
      this._windowRef.instance.id = this.popupId;
      this._windowRef.instance.selectEvent.subscribe((result: any) => this._selectResultClosePopup(result));
      this._windowRef.instance.activeChangeEvent.subscribe((activeId: string) => this.activeDescendant = activeId);

      if (this.container === 'body') {
        window.document.querySelector(this.container).appendChild(this._windowRef.location.nativeElement);
      }
    }
  }

  private _closePopup() {
    this._popupService.close();
    this._windowRef = null;
    this.activeDescendant = undefined;
  }

  private _selectResult(result: any) {
    let defaultPrevented = false;
    this.selectItem.emit({item: result, preventDefault: () => { defaultPrevented = true; }});
    this._resubscribeTypeahead.next(null);

    if (!defaultPrevented) {
      this.writeValue(result);
      this._onChange(result);
    }
  }

  private _selectResultClosePopup(result: any) {
    this._selectResult(result);
    this._closePopup();
    this._elementRef.nativeElement.focus();
  }

  private _showHint() {
    if (this.showHint && this._windowRef.instance.hasActive() && this._inputValueBackup != null) {
      const userInputLowerCase = this._inputValueBackup.toLowerCase();
      const formattedVal = this._formatItemForInput(this._windowRef.instance.getActive());

      if (userInputLowerCase === formattedVal.substr(0, this._inputValueBackup.length).toLowerCase()) {
        this._writeInputValue(this._inputValueBackup + formattedVal.substr(this._inputValueBackup.length));
        this._elementRef.nativeElement['setSelectionRange'].apply(
            this._elementRef.nativeElement, [this._inputValueBackup.length, formattedVal.length]);
      } else {
        this.writeValue(this._windowRef.instance.getActive());
      }
    }
  }

  private _formatItemForInput(item: any): string {
    return item != null && this.inputFormatter ? this.inputFormatter(item) : toString(item);
  }

  private _writeInputValue(value: string): void {
    this._renderer.setProperty(this._elementRef.nativeElement, 'value', toString(value));
  }

  private _subscribeToUserInput(userInput$: Observable<any[]>): Subscription {
    return userInput$.subscribe((results) => {
      if (!results || results.length === 0) {
        this._closePopup();
      } else {
        this._openPopup();
        this._windowRef.instance.focusFirst = this.focusFirst;
        this._windowRef.instance.results = results;
        this._windowRef.instance.term = this._elementRef.nativeElement.value;
        if (this.resultFormatter) {
          this._windowRef.instance.formatter = this.resultFormatter;
        }
        if (this.resultTemplate) {
          this._windowRef.instance.resultTemplate = this.resultTemplate;
        }
        this._windowRef.instance.resetActive();

        // The observable stream we are subscribing to might have async steps
        // and if a component containing typeahead is using the OnPush strategy
        // the change detection turn wouldn't be invoked automatically.
        this._windowRef.changeDetectorRef.detectChanges();

        this._showHint();
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
