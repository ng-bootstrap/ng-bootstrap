import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from 'angular2/core';

@Component({
  selector: 'ngb-alert',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="'alert alert-' + type" role="alert">
      <template [ngIf]="dismissible">
        <button type="button" class="close" aria-label="Close" (click)="closeHandler()">
              <span aria-hidden="true">&times;</span>
        </button>
      </template>
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
