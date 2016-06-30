import {
  Component,
  Input,
  ContentChildren,
  QueryList,
  Directive,
  TemplateRef,
  ContentChild,
  AfterContentChecked
} from '@angular/core';

let nextId = 0;

/**
 * This directive should be used to wrap tab titles that need to contain HTML markup or other directives.
 */
@Directive({selector: 'template[ngbTabTitle]'})
export class NgbTabTitle {
  constructor(public templateRef: TemplateRef<any>) {}
}

/**
 * This directive must be used to wrap content to be displayed in a tab.
 */
@Directive({selector: 'template[ngbTabContent]'})
export class NgbTabContent {
  constructor(public templateRef: TemplateRef<any>) {}
}

/**
 * A directive representing an individual tab.
 */
@Directive({selector: 'ngb-tab'})
export class NgbTab {
  /**
   * Unique tab identifier. Must be unique for the entire document for proper accessibility support.
   */
  @Input() id: string = `ngb-tab-${nextId++}`;
  /**
   * Simple (string only) title. Use the "NgbTabTitle" directive for more complex use-cases.
   */
  @Input() title: string;
  /**
   * Allows toggling disabled state of a given state. Disabled tabs can't be selected.
   */
  @Input() disabled: boolean = false;

  @ContentChild(NgbTabContent) contentTpl: NgbTabContent;
  @ContentChild(NgbTabTitle) titleTpl: NgbTabTitle;
}

/**
 * A component that makes it easy to create tabbed interface.
 */
@Component({
  selector: 'ngb-tabset',
  exportAs: 'ngbTabset',
  template: `
    <ul [class]="'nav nav-' + type" role="tablist">
      <li class="nav-item" *ngFor="let tab of tabs">
        <a [id]="tab.id" class="nav-link" [class.active]="tab.id === activeId" [class.disabled]="tab.disabled" (click)="select(tab.id)">
          {{tab.title}}<template [ngTemplateOutlet]="tab.titleTpl?.templateRef"></template>
        </a>
      </li>
    </ul>
    <div class="tab-content">
      <div *ngFor="let tab of tabs" class="tab-pane" [class.active]="tab.id === activeId" role="tabpanel" [attr.aria-labelledby]="tab.id">
        <template [ngTemplateOutlet]="tab.contentTpl.templateRef"></template>
      </div>
    </div>
  `
})
export class NgbTabset implements AfterContentChecked {
  @ContentChildren(NgbTab) tabs: QueryList<NgbTab>;

  /**
   * An identifier of a tab that should be selected (active).
   */
  @Input() activeId: string;

  /**
   * Type of navigation to be used for tabs. Can be one of 'tabs' or 'pills'.
   */
  @Input() type: string = 'tabs';

  select(tabIdx: string) {
    let selectedTab = this._getTabById(tabIdx);
    if (selectedTab && !selectedTab.disabled) {
      this.activeId = selectedTab.id;
    }
  }

  ngAfterContentChecked() {
    // auto-correct activeId that might have been set incorrectly as input
    let activeTab = this._getTabById(this.activeId);
    this.activeId = activeTab ? activeTab.id : (this.tabs.length ? this.tabs.first.id : null);
  }

  private _getTabById(id: string): NgbTab {
    let tabsWithId: NgbTab[] = this.tabs.filter(tab => tab.id === id);
    return tabsWithId.length ? tabsWithId[0] : null;
  }
}

export const NGB_TABSET_DIRECTIVES = [NgbTabset, NgbTab, NgbTabContent, NgbTabTitle];
