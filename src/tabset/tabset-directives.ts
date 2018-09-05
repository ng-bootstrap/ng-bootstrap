import {
  Directive,
  TemplateRef,
  Component,
  Input,
  ContentChildren,
  QueryList,
  Inject,
  forwardRef,
  Output,
  EventEmitter,
  AfterContentChecked,
  Self,
  ChangeDetectorRef
} from '@angular/core';
import {NgbTabsetConfig} from './tabset-config';

let nextId = 0;

/**
 * This directive must be used to wrap content to be displayed in a tab.
 */
@Directive({selector: 'ng-template[ngbTabContent]'})
export class NgbTabContent {
  constructor(public templateRef: TemplateRef<any>) {}
}

@Directive({selector: '[ngbTab]', exportAs: 'ngbTab', host: {'class': 'nav-item'}})
export class NgbTabDirective implements AfterContentChecked {
  defaultDomId = `ngb-tab-${nextId++}`;
  /**
   * Base id to be used in the DOM (globally unique).
   */
  @Input() domId: string;
  /**
   * Id used in the model (unique in the current tabset)
   */
  @Input() ngbTab: string;

  @Input() disabled = false;

  contentTpl: NgbTabContent | null;

  @ContentChildren(NgbTabContent, {descendants: false}) contentTpls: QueryList<NgbTabContent>;

  tabset: NgbTabsetDirective;

  constructor(@Inject(forwardRef(() => NgbTabsetDirective)) tabset) {
    // TODO: cf https://github.com/angular/angular/issues/30106
    this.tabset = tabset;
  }

  ngAfterContentChecked() {
    // We are using @ContentChildren instead of @ContentChild as in the Angular version being used
    // only @ContentChildren allows us to specify the {descendants: false} option.
    // Without {descendants: false} we are hitting bugs described in:
    // https://github.com/ng-bootstrap/ng-bootstrap/issues/2240
    this.contentTpl = this.contentTpls.first;
  }

  getDomId() { return this.domId || this.defaultDomId; }

  getModelId() { return this.ngbTab || this.getDomId(); }

  isPanelInDom() { return !this.tabset.destroyOnHide || this.isActive(); }

  getPanelDomId() { return `${this.getDomId()}-panel`; }

  isActive() { return this.tabset.activeId === this.getModelId(); }

  click() {
    if (!this.disabled) {
      this.tabset.tabClick(this.getModelId());
    }
  }
}

@Directive({
  selector: '[ngbTabLink]',
  host: {
    '[id]': 'tab.getDomId()',
    'class': 'nav-link',
    'role': 'tab',
    'href': '',
    '[class.active]': 'tab.isActive()',
    '[class.disabled]': 'tab.disabled',
    '[attr.tabindex]': 'tab.disabled ? -1 : undefined',
    '[attr.aria-controls]': 'tab.isPanelInDom() ? tab.getPanelDomId() : null',
    '[attr.aria-selected]': 'tab.isActive()',
    '[attr.aria-disabled]': 'tab.disabled',
    '(click)': 'tab.click(); $event.preventDefault();'
  }
})
export class NgbTabLinkDirective {
  constructor(public tab: NgbTabDirective) {}
}

@Directive({
  selector: '[ngbTabset]',
  exportAs: 'ngbTabset',
  host: {
    'role': 'tablist',
    '[class]':
        'className + \' nav nav-\' + type + (orientation == \'horizontal\'?  \' \' + justifyClass : \' flex-column\')'
  }
})
export class NgbTabsetDirective {
  justifyClass: string;

  @Input('class') className = '';

  @Input() destroyOnHide = true;

  /**
   * The horizontal alignment of the nav with flexbox utilities. Can be one of 'start', 'center', 'end', 'fill' or
   * 'justified'
   * The default value is 'start'.
   */
  @Input()
  set justify(className: 'start' | 'center' | 'end' | 'fill' | 'justified') {
    if (className === 'fill' || className === 'justified') {
      this.justifyClass = `nav-${className}`;
    } else {
      this.justifyClass = `justify-content-${className}`;
    }
  }

  /**
   * The orientation of the nav (horizontal or vertical).
   * The default value is 'horizontal'.
   */
  @Input() orientation: 'horizontal' | 'vertical';

  /**
   * Type of navigation to be used for tabs. Can be one of Bootstrap defined types ('tabs' or 'pills') or
   * an arbitrary string (for custom themes).
   */
  @Input() type: 'tabs' | 'pills' | string;

  @Input() activeId: string;

  @Output() activeIdChange = new EventEmitter<string>();

  @ContentChildren(NgbTabDirective) tabs: QueryList<NgbTabDirective>;

  constructor(config: NgbTabsetConfig) {
    this.type = config.type;
    this.justify = config.justify;
    this.orientation = config.orientation;
  }

  tabClick(tabId: string) { this.activeIdChange.next(tabId); }
}

@Component({
  selector: '[ngbTabsetOutlet]',
  host: {class: 'tab-content'},
  template: `
  <ng-template ngFor let-tab [ngForOf]="ngbTabsetOutlet.tabs">
    <div
      class="tab-pane {{tab.isActive() ? 'active' : null}}"
      *ngIf="tab.isPanelInDom()"
      role="tabpanel"
      [attr.aria-labelledby]="tab.getDomId()" [id]="tab.getPanelDomId()">
      <ng-template [ngTemplateOutlet]="tab.contentTpl?.templateRef"></ng-template>
    </div>
  </ng-template>
`
})
export class NgbTabsetOutlet {
  @Input() ngbTabsetOutlet: NgbTabsetDirective;
}

/**
 * The payload of the change event fired right before the tab change
 */
export interface NgbTabChangeEvent {
  /**
   * Id of the currently active tab
   */
  activeId: string;

  /**
   * Id of the newly selected tab
   */
  nextId: string;

  /**
   * Function that will prevent tab switch if called
   */
  preventDefault: () => void;
}

@Directive({selector: '[ngbTabset][selfControlled]'})
export class NgbSelfControlledTabset implements AfterContentChecked {
  get activeId() { return this.tabset.activeId; }

  @Input()
  set activeId(value: string) {
    this.tabset.activeId = value;
  }

  @ContentChildren(NgbTabDirective) tabs: QueryList<NgbTabDirective>;

  constructor(@Self() public tabset: NgbTabsetDirective, public changeDetector: ChangeDetectorRef) {
    tabset.activeIdChange.subscribe(this.select.bind(this));
  }

  /**
   * A tab change event fired right before the tab selection happens. See NgbTabChangeEvent for payload details
   */
  @Output() tabChange = new EventEmitter<NgbTabChangeEvent>();

  /**
   * Selects the tab with the given id and shows its associated pane.
   * Any other tab that was previously selected becomes unselected and its associated pane is hidden.
   */
  select(tabId: string) {
    const selectedTab = this._getTabById(tabId);
    if (selectedTab && !selectedTab.disabled && !selectedTab.isActive()) {
      let defaultPrevented = false;
      const selectedTabId = selectedTab.getModelId();

      this.tabChange.emit(
          {activeId: this.activeId, nextId: selectedTabId, preventDefault: () => { defaultPrevented = true; }});

      if (!defaultPrevented) {
        this.activeId = selectedTabId;
      }
    }
  }

  ngAfterContentChecked() {
    // auto-correct activeId that might have been set incorrectly as input
    const activeTab = this._getTabById(this.activeId);
    const newActiveId = this.tabs.length ? this.tabs.first.getModelId() : null;
    if (!activeTab && this.activeId !== newActiveId) {
      this.activeId = newActiveId;
      this.changeDetector.detectChanges();
    }
  }

  private _getTabById(id: string): NgbTabDirective {
    const tabsWithId: NgbTabDirective[] = this.tabs.filter(tab => tab.getModelId() === id);
    return tabsWithId.length ? tabsWithId[0] : null;
  }
}
