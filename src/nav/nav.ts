import {
  AfterContentChecked,
  ChangeDetectorRef,
  ContentChildren,
  Directive,
  EventEmitter,
  forwardRef,
  Inject,
  Input,
  Output,
  QueryList,
  TemplateRef
} from '@angular/core';
import {NgbNavConfig} from './nav-config';

let nextId = 0;


/**
 * This directive must be used to wrap content to be displayed in the nav
 */
@Directive({selector: 'ng-template[ngbNavContent]'})
export class NgbNavContent {
  constructor(public templateRef: TemplateRef<any>) {}
}


/**
 * Nav item
 */
@Directive({selector: '[ngbNavItem]', exportAs: 'ngbNavItem', host: {'class': 'nav-item'}})
export class NgbNavItemDirective implements AfterContentChecked {
  private _defaultDomId = `ngb-nav-${nextId++}`;
  private _nav: NgbNavDirective;

  @Input() disabled = false;

  /**
   * Base id to be used in the DOM (globally unique).
   */
  @Input() domId: string;

  /**
   * Id used in the model (unique in the current tabset)
   */
  @Input('ngbNavItem') id: any;

  contentTpl: NgbNavContent | null;

  @ContentChildren(NgbNavContent, {descendants: false}) contentTpls: QueryList<NgbNavContent>;

  constructor(@Inject(forwardRef(() => NgbNavDirective)) nav) {
    // TODO: cf https://github.com/angular/angular/issues/30106
    this._nav = nav;
  }

  ngAfterContentChecked() {
    // We are using @ContentChildren instead of @ContentChild as in the Angular version being used
    // only @ContentChildren allows us to specify the {descendants: false} option.
    // Without {descendants: false} we are hitting bugs described in:
    // https://github.com/ng-bootstrap/ng-bootstrap/issues/2240
    this.contentTpl = this.contentTpls.first;
  }

  getDomId() { return this.domId || this._defaultDomId; }

  getId() { return this.id || this.getDomId(); }

  isPanelInDom() { return !this._nav.destroyOnHide || this.isActive(); }

  getPanelDomId() { return `${this.getDomId()}-panel`; }

  isActive() { return this._nav.activeId === this.getId(); }
}


/**
 * Nav itself
 */
@Directive({selector: '[ngbNav]', exportAs: 'ngbNav', host: {'role': 'tablist', '[class.nav]': 'true'}})
export class NgbNavDirective {
  @Input() destroyOnHide;

  @Input() activeId: any;

  @Output() activeIdChange = new EventEmitter<any>();

  @ContentChildren(NgbNavItemDirective) items: QueryList<NgbNavItemDirective>;

  constructor(config: NgbNavConfig, private _cd: ChangeDetectorRef) { this.destroyOnHide = config.destroyOnHide; }

  /**
   * A nav change event fired right before the nav selection happens. See NgbNavChangeEvent for payload details
   */
  @Output() navChange = new EventEmitter<NgbNavChangeEvent>();

  /**
   * Selects the nav with the given id and shows its associated pane.
   * Any other nav that was previously selected becomes unselected and its associated pane is hidden.
   */
  select(id: any) {
    const selectedNavItem = this._getItemById(id);
    if (selectedNavItem && !selectedNavItem.disabled && !selectedNavItem.isActive()) {
      let defaultPrevented = false;
      const selectedNavItemId = selectedNavItem.getId();

      this.navChange.emit(
          {activeId: this.activeId, nextId: selectedNavItemId, preventDefault: () => { defaultPrevented = true; }});

      if (!defaultPrevented) {
        this.activeId = selectedNavItemId;
        this.activeIdChange.emit(selectedNavItemId);
      }
    }
  }

  ngAfterContentChecked() {
    // auto-correct activeId that might have been set incorrectly as input
    const activeItem = this._getItemById(this.activeId);
    const newActiveId = this.items.length ? this.items.first.getId() : null;
    if (!activeItem && this.activeId !== newActiveId) {
      this.activeId = newActiveId;
      this.activeIdChange.emit(newActiveId);
      this._cd.detectChanges();
    }
  }

  private _getItemById(id: any): NgbNavItemDirective {
    const matchingItems = this.items.filter(navItem => navItem.getId() === id);
    return matchingItems.length ? matchingItems[0] : null;
  }
}


/**
 * Link
 */
@Directive({
  selector: 'a[ngbNavLink]',
  host: {
    '[id]': 'navItem.getDomId()',
    'class': 'nav-link',
    'role': 'tab',
    'href': '',
    '[class.active]': 'navItem.isActive()',
    '[class.disabled]': 'navItem.disabled',
    '[attr.tabindex]': 'navItem.disabled ? -1 : undefined',
    '[attr.aria-controls]': 'navItem.isPanelInDom() ? navItem.getPanelDomId() : null',
    '[attr.aria-selected]': 'navItem.isActive()',
    '[attr.aria-disabled]': 'navItem.disabled',
    '(click)': 'onClick(); $event.preventDefault()'
  }
})
export class NgbNavLinkDirective {
  constructor(public navItem: NgbNavItemDirective, private _nav: NgbNavDirective) {}

  onClick() {
    if (!this.navItem.disabled) {
      this._nav.select(this.navItem.getId());
    }
  }
}


/**
 * The payload of the change event fired right before the tab change
 */
export interface NgbNavChangeEvent {
  /**
   * Id of the currently active tab
   */
  activeId: any;

  /**
   * Id of the newly selected tab
   */
  nextId: any;

  /**
   * Function that will prevent tab switch if called
   */
  preventDefault: () => void;
}
