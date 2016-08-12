import {Directive, Input, Output, HostListener, EventEmitter} from '@angular/core';

/**
 * Transforms a node into a dropdown.
 */
@Directive({
  selector: '[ngbDropdown]',
  exportAs: 'ngbDropdown',
  host: {
    'class': 'dropdown',
    '[class.open]': 'open',
    '(keyup.esc)': 'closeFromOutside()',
    '(document:click)': 'closeFromOutside()'
  }
})
export class NgbDropdown {
  /**
   * Indicates that dropdown should be closed when selecting one of dropdown items (click) or pressing ESC.
   */
  @Input() autoClose = true;

  /**
   *  Defines whether or not the dropdown-menu is open initially.
   */
  @Input('open') open = false;

  /**
   *  An event fired when the dropdown is opened or closed.
   *  Event's payload equals whether dropdown is open.
   */
  @Output() openChange = new EventEmitter();


  /**
   * Checks if the dropdown menu is open or not.
   */
  isOpen() { return this.open; }

  /**
   * Opens the dropdown menu of a given navbar or tabbed navigation.
   */
  openDropdown() {
    this.open = true;
    this.openChange.emit(true);
  }

  /**
   * Closes the dropdown menu of a given navbar or tabbed navigation.
   */
  closeDropdown() {
    this.open = false;
    this.openChange.emit(false);
  }

  /**
   * Toggles the dropdown menu of a given navbar or tabbed navigation.
   */
  toggle() {
    if (this.isOpen()) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  /**
   * @internal
   */
  closeFromOutside() {
    if (this.autoClose) {
      this.closeDropdown();
    }
  }
}

/**
 * Allows the dropdown to be toggled via click. This directive is optional.
 */
@Directive({
  selector: '[ngbDropdownToggle]',
  host: {'class': 'dropdown-toggle', 'aria-haspopup': 'true', '[attr.aria-expanded]': 'dropdown.isOpen()'}
})
export class NgbDropdownToggle {
  constructor(public dropdown: NgbDropdown) {}

  @HostListener('click', ['$event'])
  toggleOpen($event) {
    $event.stopPropagation();
    this.dropdown.toggle();
  }
}

export const NGB_DROPDOWN_DIRECTIVES = [NgbDropdownToggle, NgbDropdown];
