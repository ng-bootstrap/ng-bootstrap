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

@Directive({selector: 'template[ngbTabTitle]'})
export class NgbTabTitle {
  constructor(public templateRef: TemplateRef<any>) {}
}

@Directive({selector: 'template[ngbTabContent]'})
export class NgbTabContent {
  constructor(public templateRef: TemplateRef<any>) {}
}

@Directive({selector: 'ngb-tab'})
export class NgbTab {
  @Input() title: string;
  @Input() disabled: boolean = false;

  @ContentChild(NgbTabContent) contentTpl: NgbTabContent;
  @ContentChild(NgbTabTitle) titleTpl: NgbTabTitle;
}

@Component({
  selector: 'ngb-tabset',
  template: `
    <ul class="nav nav-tabs" role="tablist">
      <li class="nav-item" *ngFor="let tab of tabs; let i=index">
        <a class="nav-link" [class.active]="i === activeIdx" [class.disabled]="tab.disabled" (click)="select(i)">
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

  @Input() activeIdx: number = 0;

  select(tabIdx: number) {
    if (!this.tabs.toArray()[tabIdx].disabled) {
      this.activeIdx = tabIdx;
    }
  }

  ngAfterContentChecked() {
    // auto-correct _activeIdx that might have been set incorrectly as input
    const activeIdx = Math.min(Math.max(0, this.activeIdx), this.tabs.length - 1);
    this.activeIdx = this.tabs.toArray()[activeIdx] ? activeIdx : 0;
  }
}
