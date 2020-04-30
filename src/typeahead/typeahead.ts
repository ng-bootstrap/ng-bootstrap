import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  ElementRef,
  EventEmitter,
  forwardRef,
  Inject,
  Injector,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
  ApplicationRef
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {DOCUMENT} from '@angular/common';
import {BehaviorSubject, fromEvent, Observable, Subject, Subscription} from 'rxjs';
import {map, switchMap, tap} from 'rxjs/operators';

import {Live} from '../util/accessibility/live';
import {ngbAutoClose} from '../util/autoclose';
import {Key} from '../util/key';
import {PopupService} from '../util/popup';
import {PlacementArray, positionElements} from '../util/positioning';
import {isDefined, toString} from '../util/util';

import {NgbTypeaheadConfig} from './typeahead-config';
import {NgbTypeaheadWindow, ResultTemplateContext, ContentTemplateContext} from './typeahead-window';


const NGB_TYPEAHEAD_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NgbTypeahead),
  multi: true
};

/**
 * An event emitted right before an item is selected from the result list.
 */
export interface NgbTypeaheadSelectItemEvent<T = any> {
  /**
   * The item from the list about to be selected.
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
  selector: '[ngbTypeahead]',
  exportAs: 'ngbTypeahead',
  host: {
    '(blur)': 'handleBlur()',
    '[class.open]': 'isPopupOpen()',
    '(keydown)': 'handleKeyDown($event)',
    'role': 'combobox',
    'aria-multiline': 'false',
    '[attr.aria-autocomplete]': 'showHint ? "both" : "list"',
    '[attr.aria-activedescendant]': 'activeDescendant',
    '[attr.aria-owns]': 'isPopupOpen() ? popupId : null',
    '[attr.aria-expanded]': 'isPopupOpen()'
  },
  providers: [NGB_TYPEAHEAD_VALUE_ACCESSOR]
})
export class NgbTypeahead implements AfterViewInit,
    ControlValueAccessor, OnInit, OnDestroy {
  private _popupService: PopupService<NgbTypeaheadWindow>;
  private _subscription: Subscription | null = null;
  private _closed$ = new Subject();
  private _inputValueBackup: string | null = null;
  private _valueChanges: Observable<string>;
  private _resubscribeTypeahead: BehaviorSubject<any>;
  private _windowRef: ComponentRef<NgbTypeaheadWindow>| null = null;
  private _zoneSubscription: any;
  private _inputRef: ElementRef<HTMLInputElement>;
  private _autocomplete = 'off';

  /**
   * The value for the `autocomplete` attribute for the `<input>` element.
   *
   * Defaults to `"off"` to disable the native browser autocomplete, but you can override it if necessary.
   *
   * @since 2.1.0
   */
  @Input()
  set autocomplete(_autocomplete: string) {
    this._autocomplete = _autocomplete;
    if (this._inputRef) {
      this._renderer.setAttribute(this._inputRef.nativeElement, 'autocomplete', this._autocomplete);
    }
  }

  /**
   * A selector specifying the element the typeahead popup will be appended to.
   *
   * Currently only supports `"body"`.
   */
  @Input() container: string;

  /**
   * If `true`, model values will not be restricted only to items selected from the popup.
   */
  @Input() editable: boolean;

  /**
   * If `true`, the first item in the list will always stay focused while typing.
   */
  @Input() focusFirst: boolean;

  /**
   * The function that converts an item from the list to a `string` to display in the `<input>` field.
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
  @Input() ngbTypeahead: (text: Observable<string>) => Observable<readonly any[]>;

  /**
   * The function that converts an item from the list to a `string` to display in the popup.
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
   * The template to override the layout of resulting items.
   *
   * See the [ContentTemplateContext](#/components/typeahead/api#ContentTemplateContext) for the template context.
   *
   * Also see the [template for results demo](#/components/typeahead/examples#grouping) for more details.
   */
  @Input() contentTemplate: TemplateRef<ContentTemplateContext<any>>;

  /**
   * If `true`, will show the hint in the `<input>` when an item in the list matches.
   */
  @Input() showHint: boolean;

  /**
   * The preferred placement of the typeahead.
   *
   * Possible values are `"top"`, `"top-left"`, `"top-right"`, `"bottom"`, `"bottom-left"`,
   * `"bottom-right"`, `"left"`, `"left-top"`, `"left-bottom"`, `"right"`, `"right-top"`,
   * `"right-bottom"`
   *
   * Accepts an array of strings or a string with space separated possible values.
   *
   * The default order of preference is `"bottom-left bottom-right top-left top-right"`
   *
   * Please see the [positioning overview](#/positioning) for more details.
   */
  @Input() placement: PlacementArray = 'bottom-left';

  /**
   * An event emitted right before an item is selected from the list.
   *
   * Event payload is of type [`NgbTypeaheadSelectItemEvent`](#/components/typeahead/api#NgbTypeaheadSelectItemEvent).
   */
  @Output() selectItem = new EventEmitter<NgbTypeaheadSelectItemEvent>();

  @ViewChild('input', {static: true}) childInput: ElementRef<HTMLInputElement>;

  activeDescendant: string | null = null;
  popupId = `ngb-typeahead-${nextWindowId++}`;

  private _onTouched = () => {};
  private _onChange = (_: any) => {};

  constructor(
      private _elementRef: ElementRef<HTMLInputElement>, viewContainerRef: ViewContainerRef,
      private _renderer: Renderer2, injector: Injector, componentFactoryResolver: ComponentFactoryResolver,
      config: NgbTypeaheadConfig, ngZone: NgZone, private _live: Live, @Inject(DOCUMENT) private _document: any,
      private _ngZone: NgZone, private _changeDetector: ChangeDetectorRef, applicationRef: ApplicationRef) {
    this.container = config.container;
    this.editable = config.editable;
    this.focusFirst = config.focusFirst;
    this.showHint = config.showHint;
    this.placement = config.placement;

    this._resubscribeTypeahead = new BehaviorSubject(null);

    this._popupService = new PopupService<NgbTypeaheadWindow>(
        NgbTypeaheadWindow, injector, viewContainerRef, _renderer, componentFactoryResolver, applicationRef);

    this._zoneSubscription = ngZone.onStable.subscribe(() => {
      if (this.isPopupOpen()) {
        positionElements(
            this._inputRef.nativeElement, this._windowRef !.location.nativeElement, this.placement,
            this.container === 'body');
      }
    });
  }

  ngOnInit(): void { this._inputRef = this._elementRef; }

  ngAfterViewInit(): void {
    this._inputRef = this.childInput || this._elementRef;
    this._renderer.setAttribute(this._inputRef.nativeElement, 'autocomplete', this._autocomplete);
    this._renderer.setAttribute(this._inputRef.nativeElement, 'autocapitalize', 'off');
    this._renderer.setAttribute(this._inputRef.nativeElement, 'autocorrect', 'off');
    this._valueChanges = fromEvent<Event>(this._inputRef.nativeElement, 'input')
                             .pipe(map($event => ($event.target as HTMLInputElement).value));

    const inputValues$ = this._valueChanges.pipe(tap(value => {
      this._inputValueBackup = this.showHint ? value : null;
      this._onChange(this.editable ? value : undefined);
    }));
    const results$ = inputValues$.pipe(this.ngbTypeahead);
    const userInput$ = this._resubscribeTypeahead.pipe(switchMap(() => results$));
    this._subscription = this._subscribeToUserInput(userInput$);
  }

  ngOnDestroy(): void {
    this._closePopup();
    this._unsubscribeFromUserInput();
    this._zoneSubscription.unsubscribe();
  }

  registerOnChange(fn: (value: any) => any): void { this._onChange = fn; }

  registerOnTouched(fn: () => any): void { this._onTouched = fn; }

  writeValue(value) {
    this._writeInputValue(this._formatItemForInput(value));
    if (this.showHint) {
      this._inputValueBackup = value;
    }
  }

  setDisabledState(isDisabled: boolean): void {
    this._renderer.setProperty(this._inputRef.nativeElement, 'disabled', isDisabled);
  }

  /**
   * Dismisses typeahead popup window
   */
  dismissPopup() {
    if (this.isPopupOpen()) {
      this._resubscribeTypeahead.next(null);
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
    switch (event.which) {
      case Key.ArrowDown:
        event.preventDefault();
        this._windowRef !.instance.next();
        this._showHint();
        break;
      case Key.ArrowUp:
        event.preventDefault();
        this._windowRef !.instance.prev();
        this._showHint();
        break;
      case Key.Enter:
      case Key.Tab:
        const result = this._windowRef !.instance.getActive();
        if (isDefined(result)) {
          event.preventDefault();
          event.stopPropagation();
          this._selectResult(result);
        }
        this._closePopup();
        break;
    }
  }

  get windowInstance() { return this._windowRef !.instance; }

  private _openPopup() {
    if (!this.isPopupOpen()) {
      this._inputValueBackup = this._inputRef.nativeElement.value;
      this._windowRef = this._popupService.open();
      this._windowRef.instance.id = this.popupId;
      this._windowRef.instance.selectEvent.subscribe((result: any) => this._selectResultClosePopup(result));
      this._windowRef.instance.activeChangeEvent.subscribe((activeId: string) => this.activeDescendant = activeId);

      if (this.container === 'body') {
        this._document.querySelector(this.container).appendChild(this._windowRef.location.nativeElement);
      }

      this._changeDetector.markForCheck();

      ngbAutoClose(
          this._ngZone, this._document, 'outside', () => this.dismissPopup(), this._closed$,
          [this._inputRef.nativeElement, this._windowRef.location.nativeElement]);
    }
  }

  private _closePopup() {
    this._closed$.next();
    this._popupService.close();
    this._windowRef = null;
    this.activeDescendant = null;
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
  }

  private _showHint() {
    if (this.showHint && this._windowRef?.instance.hasActive() && this._inputValueBackup != null) {
      const userInputLowerCase = this._inputValueBackup.toLowerCase();
      const formattedVal = this._formatItemForInput(this._windowRef.instance.getActive());

      if (userInputLowerCase === formattedVal.substr(0, this._inputValueBackup.length).toLowerCase()) {
        this._writeInputValue(this._inputValueBackup + formattedVal.substr(this._inputValueBackup.length));
        this._inputRef.nativeElement['setSelectionRange'].apply(
            this._inputRef.nativeElement, [this._inputValueBackup.length, formattedVal.length]);
      } else {
        this._writeInputValue(formattedVal);
      }
    }
  }

  private _formatItemForInput(item: any): string {
    return item != null && this.inputFormatter ? this.inputFormatter(item) : toString(item);
  }

  private _writeInputValue(value: string): void {
    this._renderer.setProperty(this._inputRef.nativeElement, 'value', toString(value));
  }

  private _subscribeToUserInput(userInput$: Observable<readonly any[]>): Subscription {
    return userInput$.subscribe((results) => {
      if (!results || results.length === 0) {
        this._closePopup();
      } else {
        this._openPopup();
        this._windowRef !.instance.focusFirst = this.focusFirst;
        this._windowRef !.instance.results = results;
        this._windowRef !.instance.term = this._inputRef.nativeElement.value;
        if (this.resultFormatter) {
          this._windowRef !.instance.formatter = this.resultFormatter;
        }
        if (this.resultTemplate) {
          this._windowRef !.instance.resultTemplate = this.resultTemplate;
        }
        if (this.contentTemplate) {
          this._windowRef !.instance.contentTemplate = this.contentTemplate;
        }
        this._windowRef !.instance.resetActive();

        // The observable stream we are subscribing to might have async steps
        // and if a component containing typeahead is using the OnPush strategy
        // the change detection turn wouldn't be invoked automatically.
        this._windowRef !.changeDetectorRef.detectChanges();

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

/**
 * The item of typeahead.
 * Use in combination with ngbTypeaheadWindowContent to create custom layout of typeahead results.
 */
@Component({
  selector: 'ngb-typeahead-item',
  encapsulation: ViewEncapsulation.None,
  exportAs: 'ngbTypeaheadItem',
  template: `
    <ng-template #rt let-item="item" let-term="term" let-formatter="formatter">
      <ngb-highlight [result]="formatter(item)" [term]="term"></ngb-highlight>
    </ng-template>
    <button type="button" class="dropdown-item" role="option"
      [id]="id + '-' + index"
      [class.active]="index === activeIdx"
      (mouseenter)="markActive()"
      (click)="select()">
        <ng-template [ngTemplateOutlet]="resultTemplate || rt"
                     [ngTemplateOutletContext]="resultTemplateContext"></ng-template>
    </button>
  `
})
export class NgbTypeaheadItem<T> {
  /**
   *  The item of typeahead to be listed.
   */
  @Input() item: T;

  /**
   *  The index of the item item.
   */
  @Input() index: number;

  constructor(private context: NgbTypeahead) {}

  markActive() { this.context.windowInstance ?.markActive(this.index); }

  select() { this.context.windowInstance ?.select(this.item); }

  get id() { return this.context.windowInstance ?.id; }

  get activeIdx() { return this.context.windowInstance ?.activeIdx; }

  get resultTemplate() { return this.context.windowInstance ?.resultTemplate; }

  get resultTemplateContext() {
    return {
      item: this.item,
      term: this.context.windowInstance ?.term, formatter : this.context.windowInstance ?.formatter || (() => {}) };
  }
}
