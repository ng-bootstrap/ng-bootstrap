import {Component, View, OnDestroy} from 'angular2/angular2';

@Component({selector: 'ngb-accordion, [ngb-accordion]', properties: ['onlyOneOpen: closeOthers']})
@View({template: `<ng-content></ng-content>`})
export class NgbAccordion {
  private onlyOneOpen: boolean;
  private groups: Array<NgbAccordionGroup> = [];

  addGroup(group: NgbAccordionGroup): void { this.groups.push(group); }

  closeOthers(openGroup): void {
    if (!this.onlyOneOpen) {
      return;
    }

    this.groups.forEach((group: NgbAccordionGroup) => {
      if (group !== openGroup) {
        group.isOpen = false;
      }
    });
  }

  removeGroup(group: NgbAccordionGroup): void {
    const index = this.groups.indexOf(group);
    if (index !== -1) {
      this.groups.splice(index, 1);
    }
  }
}

@Component({selector: 'ngb-accordion-group, [ngb-accordion-group]', properties: ['heading', 'isOpen', 'isDisabled']})
@View({
  template: `
    <div class="panel panel-default" [class.panel-open]="isOpen">
      <div class="panel-heading">
        <h4 class="panel-title">
          <a href tabindex="0"><span [class.text-muted]="isDisabled" (click)="toggleOpen($event)">{{heading}}</span></a>
        </h4>
      </div>
      <div class="panel-collapse" [hidden]="!isOpen">
        <div class="panel-body">
    	    <ng-content></ng-content>
  	    </div>
      </div>
    </div>
  `
})
export class NgbAccordionGroup implements OnDestroy {
  private isDisabled: boolean;
  private _isOpen: boolean = false;

  constructor(private accordion: NgbAccordion) { this.accordion.addGroup(this); }

  toggleOpen(event) {
    event.preventDefault();
    if (!this.isDisabled) {
      this.isOpen = !this.isOpen;
    }
  }

  onDestroy(): void { this.accordion.removeGroup(this); }

  public get isOpen(): boolean { return this._isOpen; }

  public set isOpen(value: boolean) {
    this._isOpen = value;
    if (value) {
      this.accordion.closeOthers(this);
    }
  }
}