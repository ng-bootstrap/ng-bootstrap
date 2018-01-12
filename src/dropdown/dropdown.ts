import {
  forwardRef,
  Inject,
  Directive,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ContentChild,
  NgZone,
  Renderer2,
  OnInit
} from '@angular/core';
import {NgbDropdownConfig} from './dropdown-config';
import {positionElements, PlacementArray, Placement} from '../util/positioning';

/**
 */
@Directive(
    {selector: '[ngbDropdownMenu]', host: {'[class.dropdown-menu]': 'true', '[class.show]': 'dropdown.isOpen()'}})
export class NgbDropdownMenu {
  placement: Placement = 'bottom';
  isOpen = false;

  constructor(
      @Inject(forwardRef(() => NgbDropdown)) public dropdown, private _elementRef: ElementRef,
      private _renderer: Renderer2) {}

  isEventFrom($event) { return this._elementRef.nativeElement.contains($event.target); }

  position(triggerEl, placement) {
    this.applyPlacement(positionElements(triggerEl, this._elementRef.nativeElement, placement));
  }

  applyPlacement(_placement: Placement) {
    // remove the current placement classes
    this._renderer.removeClass(this._elementRef.nativeElement.parentNode, 'dropup');
    this._renderer.removeClass(this._elementRef.nativeElement.parentNode, 'dropdown');
    this.placement = _placement;
    /**
     * apply the new placement
     * in case of top use up-arrow or down-arrow otherwise
     */
    if (_placement.search('^top') !== -1) {
      this._renderer.addClass(this._elementRef.nativeElement.parentNode, 'dropup');
    } else {
      this._renderer.addClass(this._elementRef.nativeElement.parentNode, 'dropdown');
    }
  }
}

/**
 * Marks an element to which dropdown menu will be anchored. This is a simple version
 * of the NgbDropdownToggle directive. It plays the same role as NgbDropdownToggle but
 * doesn't listen to click events to toggle dropdown menu thus enabling support for
 * events other than click.
 */
@Directive({
  selector: '[ngbDropdownAnchor]',
  host: {'class': 'dropdown-toggle', 'aria-haspopup': 'true', '[attr.aria-expanded]': 'dropdown.isOpen()'}
})
export class NgbDropdownAnchor {
  anchorEl;

  constructor(@Inject(forwardRef(() => NgbDropdown)) public dropdown, private _elementRef: ElementRef) {
    this.anchorEl = _elementRef.nativeElement;
  }

  isEventFrom($event) { return this._elementRef.nativeElement.contains($event.target); }
}

/**
 * Allows the dropdown to be toggled via click. This directive is optional: you can use NgbDropdownAnchor as an
 * alternative.
 */
@Directive({
  selector: '[ngbDropdownToggle]',
  host: {
    'class': 'dropdown-toggle',
    'aria-haspopup': 'true',
    '[attr.aria-expanded]': 'dropdown.isOpen()',
    '(click)': 'toggleOpen()'
  },
  providers: [{provide: NgbDropdownAnchor, useExisting: forwardRef(() => NgbDropdownToggle)}]
})
export class NgbDropdownToggle extends NgbDropdownAnchor {
  constructor(@Inject(forwardRef(() => NgbDropdown)) dropdown, elementRef: ElementRef) { super(dropdown, elementRef); }

  toggleOpen() { this.dropdown.toggle(); }
}

/**
 * Transforms a node into a dropdown.
 */
@Directive({
  selector: '[ngbDropdown]',
  exportAs: 'ngbDropdown',
  host: {
    '[class.show]': 'isOpen()',
    '(keyup.esc)': 'closeFromOutsideEsc()',
    '(document:click)': 'closeFromClick($event)'
  }
})
export class NgbDropdown implements OnInit {
  private _zoneSubscription: any;

  @ContentChild(NgbDropdownMenu) private _menu: NgbDropdownMenu;

  @ContentChild(NgbDropdownAnchor) private _anchor: NgbDropdownAnchor;

  /**
   * Indicates that dropdown should be closed when selecting one of dropdown items (click) or pressing ESC.
   * When it is true (default) dropdowns are automatically closed on both outside and inside (menu) clicks.
   * When it is false dropdowns are never automatically closed.
   * When it is 'outside' dropdowns are automatically closed on outside clicks but not on menu clicks.
   * When it is 'inside' dropdowns are automatically on menu clicks but not on outside clicks.
   */
  @Input() autoClose: boolean | 'outside' | 'inside';

  /**
   *  Defines whether or not the dropdown-menu is open initially.
   */
  @Input('open') _open = false;

  /**
   * Placement of a popover accepts:
   *    "top", "top-left", "top-right", "bottom", "bottom-left", "bottom-right",
   *    "left", "left-top", "left-bottom", "right", "right-top", "right-bottom"
   * and array of above values.
   */
  @Input() placement: PlacementArray;

  /**
   *  An event fired when the dropdown is opened or closed.
   *  Event's payload equals whether dropdown is open.
   */
  @Output() openChange = new EventEmitter();

  constructor(config: NgbDropdownConfig, ngZone: NgZone) {
    this.placement = config.placement;
    this.autoClose = config.autoClose;
    this._zoneSubscription = ngZone.onStable.subscribe(() => { this._positionMenu(); });
  }

  ngOnInit() {
    if (this._menu) {
      this._menu.applyPlacement(Array.isArray(this.placement) ? (this.placement[0]) : this.placement as Placement);
    }
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
      this._positionMenu();
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

  ngOnDestroy() { this._zoneSubscription.unsubscribe(); }

  private _isEventFromToggle($event) { return this._anchor.isEventFrom($event); }

  private _isEventFromMenu($event) { return this._menu ? this._menu.isEventFrom($event) : false; }

  private _positionMenu() {
    if (this.isOpen() && this._menu) {
      this._menu.position(this._anchor.anchorEl, this.placement);
    }
  }
}
