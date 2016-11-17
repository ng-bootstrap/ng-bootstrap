import {
  Directive,
  Input,
  Output,
  EventEmitter,
  AfterContentInit,
  OnDestroy,
  ContentChild,
  Renderer,
  ComponentRef,
  ElementRef,
  NgZone
} from '@angular/core';
import {NgbDropdownConfig} from './dropdown-config';
import {positionElements} from '../util/positioning';

/**
 * Transforms a node into a dropdown.
 */
@Directive({
  selector: '[ngbDropdown]',
  exportAs: 'ngbDropdown',
  host: {
    '[class.dropdown]': '!up',
    '[class.dropup]': 'up',
    '[class.open]': 'isOpen()',
    '(keyup.esc)': 'closeFromOutsideEsc()',
    '(document:click)': 'closeFromOutsideClick($event)'
  }
})
export class NgbDropdown implements AfterContentInit,
    OnDestroy {
  private _toggleElement: any;

  /**
   * Indicates that the dropdown should open upwards
   */
  @Input() up: boolean;

  /**
   * Indicates that dropdown should be closed when selecting one of dropdown items (click) or pressing ESC.
   */
  @Input() autoClose: boolean;

  /**
   * A selector specifying the element the dropdown should be appended to.
   * Currently only supports "body".
   */
  @Input() container: string;

  /**
   *  Defines whether or not the dropdown-menu is open initially.
   */
  @Input('open') _open = false;

  /**
   *  An event fired when the dropdown is opened or closed.
   *  Event's payload equals whether dropdown is open.
   */
  @Output() openChange = new EventEmitter();

  @ContentChild(NgbDropdownMenu) private _dropdownMenu: NgbDropdownMenu;

  private _zoneSubscription: any;

  constructor(
      private _elementRef: ElementRef, config: NgbDropdownConfig, private _renderer: Renderer,
      private _ngZone: NgZone) {
    this.up = config.up;
    this.autoClose = config.autoClose;
    this.container = config.container;
  }


  /**
   * Checks if the dropdown menu is open or not.
   */
  isOpen(): boolean { return this._open; }

  /**
   * Opens the dropdown menu of a given navbar or tabbed navigation.
   */
  open(): void {
    if (!this._open) {
      if (this.container === 'body') {
        let container = window.document.querySelector(this.container);
        this._renderer.attachViewAfter(container, this._dropdownMenu.elementRef.nativeElement);
        this._renderer.setElementClass(container, 'open', true);
      }

      this._open = true;
      this.openChange.emit(true);
    }
  }

  /**
   * Closes the dropdown menu of a given navbar or tabbed navigation.
   */
  close(): void {
    if (this._open) {
      if (this.container === 'body') {
        this._renderer.attachViewAfter(this._elementRef.nativeElement, this._dropdownMenu.elementRef.nativeElement);
        let container = window.document.querySelector(this.container);
        this._renderer.setElementClass(container, 'open', false);
      }

      this._open = false;
      this.openChange.emit(false);
    }
  }

  /**
   * Toggles the dropdown menu of a given navbar or tabbed navigation.
   */
  toggle(): void {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  closeFromOutsideClick($event) {
    if (this.autoClose && !this._isEventFromToggle($event)) {
      this.close();
    }
  }

  closeFromOutsideEsc() {
    if (this.autoClose) {
      this.close();
    }
  }

  ngAfterContentInit() {
    if (this.container === 'body') {
      this._zoneSubscription = this._ngZone.onStable.subscribe(() => {
        positionElements(
            this._elementRef.nativeElement, this._dropdownMenu.elementRef.nativeElement,
            this.up ? 'top-left' : 'bottom-left', this.container === 'body');
      });
    }
  }

  ngOnDestroy() {
    this._removeMenu();
    if (this._zoneSubscription) {
      this._zoneSubscription.unsubscribe();
    }
  }

  /**
   * @internal
   */
  set toggleElement(toggleElement: any) { this._toggleElement = toggleElement; }

  private _isEventFromToggle($event) { return !!this._toggleElement && this._toggleElement.contains($event.target); }

  private _removeMenu() {
    if (this._dropdownMenu) {
      this._dropdownMenu.elementRef.nativeElement.parentNode.removeChild(this._dropdownMenu);
    }
  }
}

/**
 * Gives hook for dropdown to get dropdown menu. This directive is
 * mandatory when appending to body
 */
@Directive({selector: '[ngbDropdownMenu]', host: {'class': 'dropdown-menu'}})
export class NgbDropdownMenu {
  constructor(public elementRef: ElementRef) {}
}

/**
 * Allows the dropdown to be toggled via click. This directive is optional.
 */
@Directive({
  selector: '[ngbDropdownToggle]',
  host: {
    'class': 'dropdown-toggle',
    'aria-haspopup': 'true',
    '[attr.aria-expanded]': 'dropdown.isOpen()',
    '(click)': 'toggleOpen()'
  }
})
export class NgbDropdownToggle {
  constructor(public dropdown: NgbDropdown, elementRef: ElementRef) {
    dropdown.toggleElement = elementRef.nativeElement;
  }

  toggleOpen() { this.dropdown.toggle(); }
}
