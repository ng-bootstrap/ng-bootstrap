import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from '@angular/core';

@Component({
  selector: 'ngb-alert',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="'alert alert-' + type" role="alert">
      <button *ngIf="dismissible" type="button" class="close" aria-label="Close" (click)="closeHandler()">
            <span aria-hidden="true">&times;</span>
      </button>
      <ng-content></ng-content>
    </div>
    `
})
export class NgbAlert {
  @Input() dismissible = true;
  @Input() type = 'warning';
  @Output() close = new EventEmitter();

  closeHandler() { this.close.emit(null); }
}
