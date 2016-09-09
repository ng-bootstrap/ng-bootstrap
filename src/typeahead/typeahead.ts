import {
  Directive,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ComponentRef,
  ComponentFactoryResolver,
  ViewContainerRef,
  Injector,
  Renderer,
  ElementRef,
  TemplateRef,
  forwardRef,
  AfterViewChecked,
  OnDestroy
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {Observable, Subject, Subscription} from 'rxjs/Rx';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/let';
import {positionElements} from '../util/positioning';
import {NgbTypeaheadWindow, ResultTemplateContext} from './typeahead-window';
import {PopupService} from '../util/popup';
import {toString} from '../util/util';
import {NgbTypeaheadConfig} from './typeahead-config';

enum Key {
  Tab = 9,
  Enter = 13,
  Escape = 27,
  ArrowUp = 38,
  ArrowDown = 40
}

const NGB_TYPEAHEAD_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NgbTypeahead),
  multi: true
};

/**
 * NgbTypeahead directive provides a simple way of creating powerful typeaheads from any text input
 */
@Directive({
  selector: 'input[ngbTypeahead]',
  host: {
    '(blur)': 'onTouched()',
    '[class.open]': 'isPopupOpen()',
    '(document:click)': 'dismissPopup()',
    '(input)': 'onChange($event.target.value)',
    '(keydown)': 'handleKeyDown($event)',
    'autocomplete': 'off',
    'autocapitalize': 'off',
    'autocorrect': 'off'
  },
  providers: [NGB_TYPEAHEAD_VALUE_ACCESSOR]
})
export class NgbTypeahead implements OnInit,
    AfterViewChecked, ControlValueAccessor, OnDestroy {
  private _onChangeNoEmit: (_: any) => void;
  private _popupService: PopupService<NgbTypeaheadWindow>;
  private _subscription: Subscription;
  private _userInput: string;
  private _valueChanges = new Subject<string>();
  private _windowRef: ComponentRef<NgbTypeaheadWindow>;

  /**
   * A function to convert a given value into string to display in the input field
   */
  @Input() inputFormatter: (value: any) => string;

  /**
   * A function to transform the provided observable text into the array of results
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

  /**
   * An event emitted when a match is selected. Event payload is equal to the selected item.
   */
  @Output() selectItem = new EventEmitter();

  onChange = (value) => {
    this._onChangeNoEmit(value);
    this._valueChanges.next(value);
  };

  onTouched = () => {};

  constructor(
      private _elementRef: ElementRef, private _viewContainerRef: ViewContainerRef, private _renderer: Renderer,
      private _injector: Injector, componentFactoryResolver: ComponentFactoryResolver, config: NgbTypeaheadConfig) {
    this.showHint = config.showHint;
    this._popupService = new PopupService<NgbTypeaheadWindow>(
        NgbTypeaheadWindow, _injector, _viewContainerRef, _renderer, componentFactoryResolver);
    this._onChangeNoEmit = (_: any) => {};
  }

  ngAfterViewChecked() {
    if (this._windowRef) {
      positionElements(this._elementRef.nativeElement, this._windowRef.location.nativeElement, 'bottom-left');
    }
  }

  ngOnDestroy() { this._subscription.unsubscribe(); }

  ngOnInit() {
    this._subscription =
        this._valueChanges.do(value => this._userInput = value).let (this.ngbTypeahead).subscribe((results) => {
          if (!results || results.length === 0) {
            this._closePopup();
          } else {
            this._openPopup();
            this._windowRef.instance.results = results;
            this._windowRef.instance.term = this._elementRef.nativeElement.value;
            if (this.resultFormatter) {
              this._windowRef.instance.formatter = this.resultFormatter;
            }
            if (this.resultTemplate) {
              this._windowRef.instance.resultTemplate = this.resultTemplate;
            }
            this._showHint();
          }
        });
  }

  registerOnChange(fn: (value: any) => any): void { this._onChangeNoEmit = fn; }

  registerOnTouched(fn: () => any): void { this.onTouched = fn; }

  writeValue(value) { this._writeInputValue(this._formatItemForInput(value)); }

  setDisabledState(isDisabled: boolean): void {
    this._renderer.setElementProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
  }

  /**
   * @internal
   */
  dismissPopup() {
    if (this.isPopupOpen()) {
      this._closePopup();
      this._writeInputValue(this._userInput);
    }
  }

  /**
   * @internal
   */
  isPopupOpen() { return this._windowRef != null; }

  /**
   * @internal
   */
  handleKeyDown(event: KeyboardEvent) {
    if (!this._windowRef) {
      return;
    }

    if (Key[toString(event.which)]) {
      event.preventDefault();

      switch (event.which) {
        case Key.ArrowDown:
          this._windowRef.instance.next();
          this._showHint();
          break;
        case Key.ArrowUp:
          this._windowRef.instance.prev();
          this._showHint();
          break;
        case Key.Enter:
        case Key.Tab:
          const result = this._windowRef.instance.getActive();
          this._selectResult(result);
          break;
        case Key.Escape:
          this.dismissPopup();
          break;
      }
    }
  }

  private _openPopup() {
    if (!this._windowRef) {
      this._windowRef = this._popupService.open();
      this._windowRef.instance.selectEvent.subscribe((result: any) => this._selectResult(result));
    }
  }

  private _closePopup() {
    this._popupService.close();
    this._windowRef = null;
  }

  private _selectResult(result: any) {
    this.writeValue(result);
    this._onChangeNoEmit(result);
    this.selectItem.emit(result);
    this._closePopup();
  }

  private _showHint() {
    if (this.showHint) {
      const userInputLowerCase = this._userInput.toLowerCase();
      const formattedVal = this._formatItemForInput(this._windowRef.instance.getActive());

      if (userInputLowerCase === formattedVal.substr(0, this._userInput.length).toLowerCase()) {
        this._writeInputValue(this._userInput + formattedVal.substr(this._userInput.length));
        this._renderer.invokeElementMethod(
            this._elementRef.nativeElement, 'setSelectionRange', [this._userInput.length, formattedVal.length]);
      } else {
        this.writeValue(this._windowRef.instance.getActive());
      }
    }
  }

  private _formatItemForInput(item: any): string {
    return item && this.inputFormatter ? this.inputFormatter(item) : toString(item);
  }

  private _writeInputValue(value: string): void {
    this._renderer.setElementProperty(this._elementRef.nativeElement, 'value', value);
  }
}

export const NGB_TYPEAHEAD_DIRECTIVES = [NgbTypeahead];
