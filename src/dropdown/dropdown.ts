import {forwardRef, Inject, Directive, Input, Output, EventEmitter, ElementRef, ContentChild} from '@angular/core';
import {NgbDropdownConfig} from './dropdown-config';

/**
 */
@Directive({selector: '[ngbDropdownMenu]', host: {'[class.dropdown-menu]': 'true'}})
export class NgbDropdownMenu {
  constructor(private _elementRef: ElementRef) {}

  isEventFrom($event) { return this._elementRef.nativeElement.contains($event.target); }
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
  constructor(@Inject(forwardRef(() => NgbDropdown)) public dropdown, private _elementRef: ElementRef) {}

  toggleOpen() { this.dropdown.toggle(); }

  isEventFrom($event) { return this._elementRef.nativeElement.contains($event.target); }
}

/**
 * Transforms a node into a dropdown.
 */
@Directive({
  selector: '[ngbDropdown]',
  exportAs: 'ngbDropdown',
  host: {
    '[class.dropdown]': '!up',
    '[class.dropup]': 'up',
    '[class.show]': 'isOpen()',
    '(keyup.esc)': 'closeFromOutsideEsc()',
    '(document:click)': 'closeFromClick($event)'
  }
})
export class NgbDropdown {
  @ContentChild(NgbDropdownMenu) private _menu: NgbDropdownMenu;

  @ContentChild(NgbDropdownToggle) private _toggle: NgbDropdownToggle;

  /**
   * Indicates that the dropdown should open upwards
   */
  @Input() up: boolean;

  /**
   * Indicates that dropdown should be closed when selecting one of dropdown items (click) or pressing ESC.
   */
  @Input() autoClose: boolean | 'outside' | 'inside';

  /**
   *  Defines whether or not the dropdown-menu is open initially.
   */
  @Input('open') _open = false;

  /**
   *  An event fired when the dropdown is opened or closed.
   *  Event's payload equals whether dropdown is open.
   */
  @Output() openChange = new EventEmitter();

  constructor(config: NgbDropdownConfig) {
    this.up = config.up;
    this.autoClose = config.autoClose;
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
      this._open = true;
      this.openChange.emit(true);
    }
  }

  /**
   * Closes the dropdown menu of a given navbar or tabbed navigation.
   */
  close(): void {
    if (this._open) {
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

  closeFromClick($event) {
    if (this.autoClose && $event.button !== 2 && !this._isEventFromToggle($event)) {
      if (this.autoClose === true) {
        this.close();
      } else if (this.autoClose === 'inside' && this._isEventFromMenu($event)) {
        this.close();
      } else if (this.autoClose === 'outside' && !this._isEventFromMenu($event)) {
        this.close();
      }
    }
  }

  closeFromOutsideEsc() {
    if (this.autoClose) {
      this.close();
    }
  }

  private _isEventFromToggle($event) {
    if (this._toggle) {
      return this._toggle.isEventFrom($event);
    }

    return false;
  }

  private _isEventFromMenu($event) {
    if (this._menu) {
      return this._menu.isEventFrom($event);
    }

    return false;
  }
}
