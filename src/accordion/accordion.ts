import {Component, Directive, forwardRef, Inject, Input, Query, QueryList} from 'angular2/angular2';

import {NgbCollapse} from '../collapse/collapse';

@Component({
  selector: 'ngb-accordion-panel',
  directives: [NgbCollapse],
  template: `
    <div class="panel panel-default" [class.panel-open]="isOpen">
      <div class="panel-heading">
        <h4 class="panel-title">
          <a href tabindex="0"><span [class.text-muted]="isDisabled" (click)="toggleOpen($event)">{{title}}</span></a>
        </h4>
      </div>
      <div class="panel-collapse" [ngb-collapse]="!isOpen">
        <div class="panel-body">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `
})
export class NgbAccordionPanel {
  private _isOpen = false;
  @Input() isDisabled: boolean;
  @Input() title: string;

  @Input()
  set isOpen(value: boolean) {
    this._isOpen = value;
    if (value) {
      this.accordion.closeOthers(this);
    }
  }

  get isOpen(): boolean { return this._isOpen; }

  constructor(@Inject(forwardRef(() => NgbAccordion)) private accordion: NgbAccordion) {}

  toggleOpen(event): void {
    event.preventDefault();
    if (!this.isDisabled) {
      this.isOpen = !this.isOpen;
    }
  }
}

@Directive({selector: 'ngb-accordion'})
export class NgbAccordion {
  @Input('closeOthers') onlyOneOpen: boolean;

  constructor(@Query(NgbAccordionPanel) public panels: QueryList<NgbAccordionPanel>) {}

  closeOthers(openPanel: NgbAccordionPanel): void {
    if (!this.onlyOneOpen) {
      return;
    }

    this.panels.toArray().forEach((panel: NgbAccordionPanel) => {
      if (panel !== openPanel) {
        panel.isOpen = false;
      }
    });
  }
}
