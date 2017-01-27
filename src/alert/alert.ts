import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';

import {NgbAlertConfig} from './alert-config';

/**
 * Alerts can be used to provide feedback messages.
 */
@Component({
  selector: 'ngb-alert',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="'alert alert-' + type + (dismissible ? ' alert-dismissible' : '')" role="alert">
      <button *ngIf="dismissible" type="button" class="close" aria-label="Close" (click)="closeHandler()">
            <span aria-hidden="true">&times;</span>
      </button>
      <ng-content></ng-content>
    </div>
    `
})
export class NgbAlert {
  /**
   * A flag indicating if a given alert can be dismissed (closed) by a user. If this flag is set, a close button (in a
   * form of an ×) will be displayed.
   */
  @Input() dismissible: boolean;
  /**
   * Alert type (CSS class). Bootstrap 4 recognizes the following types: "success", "info", "warning" and "danger".
   */
  @Input() type: string;
  /**
   * An event emitted when the close button is clicked. This event has no payload. Only relevant for dismissible alerts.
   */
  @Output() close = new EventEmitter();

  constructor(config: NgbAlertConfig) {
    this.dismissible = config.dismissible;
    this.type = config.type;
  }

  closeHandler() { this.close.emit(null); }
}
