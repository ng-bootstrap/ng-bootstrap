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

@Directive({selector: 'template[ngb-tab-title]'})
export class NgbTabTitle {
  constructor(public templateRef: TemplateRef<any>) {}
}

@Directive({selector: 'template[ngb-tab-content]'})
export class NgbTabContent {
  constructor(public templateRef: TemplateRef<any>) {}
}

@Directive({selector: 'ngb-tab'})
export class NgbTab {
  @Input() title: string;

  @ContentChild(NgbTabContent) contentTpl: NgbTabContent;
  @ContentChild(NgbTabTitle) titleTpl: NgbTabTitle;
}

@Component({
  selector: 'ngb-tabset',
  template: `
    <ul class="nav nav-tabs" role="tablist">
      <li class="nav-item" *ngFor="let tab of tabs; let i=index">
        <a class="nav-link" [class.active]="i === activeIdx" (click)="select(i)">
          {{tab.title}}<template [ngTemplateOutlet]="tab.titleTpl?.templateRef"></template>
        </a>
      </li>
    </ul>
    <div class="tab-content">
      <div *ngFor="let tab of tabs; let i=index" class="tab-pane" [class.active]="i === activeIdx" role="tabpanel">
        <template [ngTemplateOutlet]="tab.contentTpl.templateRef"></template>
      </div>
    </div>
  `
})
export class NgbTabset implements AfterContentChecked {
  @ContentChildren(NgbTab) tabs: QueryList<NgbTab>;

  @Input() activeIdx = 0;

  select(tabIdx: number) { this.activeIdx = tabIdx; }

  ngAfterContentChecked() {
    // auto-correct _activeIdx that might have been set incorrectly as input
    this.activeIdx = Math.min(Math.max(0, this.activeIdx), this.tabs.length - 1);
  }
}
