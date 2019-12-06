import {
  Component,
  Input,
  ContentChildren,
  QueryList,
  Directive,
  TemplateRef,
  AfterContentChecked,
  Output,
  EventEmitter,
  ViewChild
} from '@angular/core';
import {NgbTabsetConfig} from './tabset-config';
import {NgbNavDirective} from '../nav/nav';

/**
 * A directive to wrap tab titles that need to contain HTML markup or other directives.
 *
 * Alternatively you could use the `NgbTab.title` input for string titles.
 */
@Directive({selector: 'ng-template[ngbTabTitle]'})
export class NgbTabTitle {
  constructor(public templateRef: TemplateRef<any>) {}
}

/**
 * A directive to wrap content to be displayed in a tab.
 */
@Directive({selector: 'ng-template[ngbTabContent]'})
export class NgbTabContent {
  constructor(public templateRef: TemplateRef<any>) {}
}

/**
 * A directive representing an individual tab.
 */
@Directive({selector: 'ngb-tab'})
export class NgbTab implements AfterContentChecked {
  /**
   * The tab identifier.
   *
   * Must be unique for the entire document for proper accessibility support.
   */
  @Input() id: string;
  /**
   * The tab title.
   *
   * Use the [`NgbTabTitle`](#/components/tabset/api#NgbTabTitle) directive for non-string titles.
   */
  @Input() title: string;

  /**
   * If `true`, the current tab is disabled and can't be toggled.
   */
  @Input() disabled = false;

  titleTpl: NgbTabTitle | null;
  contentTpl: NgbTabContent | null;

  @ContentChildren(NgbTabTitle, {descendants: false}) titleTpls: QueryList<NgbTabTitle>;
  @ContentChildren(NgbTabContent, {descendants: false}) contentTpls: QueryList<NgbTabContent>;

  ngAfterContentChecked() {
    // We are using @ContentChildren instead of @ContentChild as in the Angular version being used
    // only @ContentChildren allows us to specify the {descendants: false} option.
    // Without {descendants: false} we are hitting bugs described in:
    // https://github.com/ng-bootstrap/ng-bootstrap/issues/2240
    this.titleTpl = this.titleTpls.first;
    this.contentTpl = this.contentTpls.first;
  }
}

/**
 * The payload of the change event fired right before the tab change.
 */
export interface NgbTabChangeEvent {
  /**
   * The id of the currently active tab.
   */
  activeId: string;

  /**
   * The id of the newly selected tab.
   */
  nextId: string;

  /**
   * Calling this function will prevent tab switching.
   */
  preventDefault: () => void;
}


/**
 * A component that makes it easy to create tabbed interface.
 */
@Component({
  selector: 'ngb-tabset',
  exportAs: 'ngbTabset',
  template: `
    <ul ngbNav
        (navChange)="tabChange.next($event)"
        [destroyOnHide]="destroyOnHide"
        [activeId]="activeId"
        class="nav nav-{{type}} {{orientation == 'horizontal' ?  '' + justifyClass : 'flex-column'}}"
        #nav="ngbNav"
    >
      <li ngbNavItem [domId]="tab.id" [disabled]="tab.disabled" *ngFor="let tab of tabs">
        <a ngbNavLink>{{tab.title}}
          <ng-template [ngTemplateOutlet]="tab.titleTpl?.templateRef"></ng-template>
        </a>
        <ng-template ngbNavContent>
          <ng-template [ngTemplateOutlet]="tab.contentTpl?.templateRef"></ng-template>
        </ng-template>
      </li>
    </ul>
    <div [ngbNavOutlet]="nav" class="tab-content"></div>
  `
})
export class NgbTabset {
  justifyClass;

  @ContentChildren(NgbTab) tabs: QueryList<NgbTab>;
  @ViewChild(NgbNavDirective, {static: true}) control: NgbNavDirective;

  /**
   * The identifier of the tab that should be opened **initially**.
   *
   * For subsequent tab switches use the `.select()` method and the `(tabChange)` event.
   */
  @Input() activeId: string;

  /**
   * If `true`, non-visible tabs content will be removed from DOM. Otherwise it will just be hidden.
   */
  @Input() destroyOnHide = true;

  /**
   * The horizontal alignment of the tabs with flexbox utilities.
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
   * The orientation of the tabset.
   */
  @Input() orientation: 'horizontal' | 'vertical';

  /**
   * Type of navigation to be used for tabs.
   *
   * Currently Bootstrap supports only `"tabs"` and `"pills"`.
   *
   * Since `3.0.0` can also be an arbitrary string (ex. for custom themes).
   */
  @Input() type: 'tabs' | 'pills' | string;

  /**
   * A tab change event emitted right before the tab change happens.
   *
   * See [`NgbTabChangeEvent`](#/components/tabset/api#NgbTabChangeEvent) for payload details.
   */
  @Output() tabChange = new EventEmitter<NgbTabChangeEvent>();

  constructor(config: NgbTabsetConfig) {
    this.type = config.type;
    this.justify = config.justify;
    this.orientation = config.orientation;
  }

  /**
   * Selects the tab with the given id and shows its associated content panel.
   *
   * Any other tab that was previously selected becomes unselected and its associated pane is removed from DOM or
   * hidden depending on the `destroyOnHide` value.
   */
  select(tabId: string) { this.control.select(tabId); }
}
