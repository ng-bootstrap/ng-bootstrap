import {Directive, Input, Output, EventEmitter, ElementRef} from '@angular/core';
import {NgbDropdownConfig} from './dropdown-config';

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
export class NgbDropdown {
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
   *  Defines whether or not the dropdown-menu is open initially.
   */
  @Input('open') private _open = false;

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

  /**
   * @internal
   */
  set toggleElement(toggleElement: any) { this._toggleElement = toggleElement; }

  private _isEventFromToggle($event) { return !!this._toggleElement && this._toggleElement.contains($event.target); }
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

export const NGB_DROPDOWN_DIRECTIVES = [NgbDropdownToggle, NgbDropdown];
