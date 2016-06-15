import {
  Component,
  forwardRef,
  Inject,
  Input,
  QueryList,
  ContentChildren,
  AfterContentChecked,
  Optional
} from '@angular/core';

import {NgbCollapse} from '../collapse/collapse';

var nextId = 0;

@Component({
  selector: 'ngb-panel',
  exportAs: 'ngbPanel',
  template: `
    <div class="panel panel-default" [class.panel-open]="open">
      <div class="panel-heading" role="tab" [id]="id">
        <h4 class="panel-title">
          <a tabindex="0" (click)="toggleOpen($event)"><span [class.text-muted]="disabled">{{title}}</span></a>
        </h4>
      </div>
      <div class="panel-collapse" [ngbCollapse]="!open" [attr.aria-labelledby]="id">
        <div class="panel-body">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
  directives: [NgbCollapse]
})
export class NgbPanel {
  @Input() disabled: boolean = false;
  @Input() id: string = `ngb-panel-${nextId++}`;
  @Input() open: boolean = false;
  @Input() title: string;

  constructor(@Optional() @Inject(forwardRef(() => NgbAccordion)) private accordion: NgbAccordion) {}

  toggleOpen(event): void {
    event.preventDefault();
    if (!this.disabled) {
      this.open = !this.open;
      if (this.open && this.accordion) {
        this.accordion.closeOthers(this);
      }
    }
  }
}

@Component({
  selector: 'ngb-accordion',
  host: {'role': 'tablist', '[attr.aria-multiselectable]': '!closeOtherPanels'},
  template: `<ng-content></ng-content>`
})
export class NgbAccordion implements AfterContentChecked {
  @ContentChildren(NgbPanel) _panels: QueryList<NgbPanel>;
  @Input('closeOthers') closeOtherPanels: boolean;

  closeOthers(openPanel: NgbPanel): void {
    if (this.closeOtherPanels) {
      this._panels.forEach((panel: NgbPanel) => {
        if (panel !== openPanel) {
          panel.open = false;
        }
      });
    }
  }

  ngAfterContentChecked() {
    var openPanels = this._panels.toArray().filter((panel) => panel.open);
    if (openPanels.length > 1) {
      this.closeOthers(openPanels[0]);
    }
  }
}
