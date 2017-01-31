import {
  Directive,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  OnChanges,
  OnInit,
  OnDestroy,
  Renderer
} from '@angular/core';
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
    '[class.show]': 'isOpen()',
    '(keyup.esc)': 'closeFromOutsideEsc()',
  }
})
export class NgbDropdown implements OnInit,
    OnDestroy {
  private _toggleElement: any;

  /**
   * Holds the remove listener method returned by listenGlobal
   */
  private _outsideClickListener;

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
  @Input('open') _open = false;

  /**
   *  An event fired when the dropdown is opened or closed.
   *  Event's payload equals whether dropdown is open.
   */
  @Output() openChange = new EventEmitter();

  constructor(config: NgbDropdownConfig, private _renderer: Renderer) {
    this.up = config.up;
    this.autoClose = config.autoClose;
  }

  ngOnInit() {
    if (this._open) {
      this._registerListener();
    }
  }

  ngOnDestroy() { this.close(); }

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
      this._registerListener();
      this.openChange.emit(true);
    }
  }

  /**
   * Closes the dropdown menu of a given navbar or tabbed navigation.
   */
  close(): void {
    if (this._open) {
      this._open = false;

      // Removes "listenGlobal" listener
      this._outsideClickListener();

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
    if (this.autoClose && $event.button !== 2 && !this._isEventFromToggle($event)) {
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

  private _registerListener() {
    this._outsideClickListener = this._renderer.listenGlobal('document', 'click', (e) => this.closeFromOutsideClick(e));
  }
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
