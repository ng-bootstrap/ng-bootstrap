import {
  Component,
  Directive,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ChangeDetectionStrategy,
  ViewContainerRef,
  Injector,
  OnDestroy,
  ComponentFactoryResolver,
  ComponentRef,
  Renderer,
  TemplateRef
} from '@angular/core';

import {PopupService} from '../util/popup';
import {NgbAlertConfig, NgbDismissibleAlertConfig} from './alert-config';

/**
 * Alerts can be used to provide feedback messages.
 */
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
  /**
   * A flag indicating if a given alert can be dismissed (closed) by a user. If this flag is set, a close button (in a
   * form of a cross) will be displayed.
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

/**
 * Alerts that can be dismissed without any additional code.
 */
@Directive({selector: 'template[ngbAlert]'})
export class NgbDismissibleAlert implements OnInit, OnDestroy {
  private _popupService: PopupService<NgbAlert>;
  private _timeout;

  /**
   * Alert type (CSS class). Bootstrap 4 recognizes the following types: "success", "info", "warning" and "danger".
   */
  @Input() type: string;
  /**
   * An event emitted when the close button is clicked.
   */
  @Output('close') closeEvent = new EventEmitter();
  /**
   *  Time, in milliseconds, before the alert auto closes.
   */
  @Input() dismissOnTimeout: number;

  constructor(
      private _templateRef: TemplateRef<Object>, viewContainerRef: ViewContainerRef, injector: Injector,
      componentFactoryResolver: ComponentFactoryResolver, renderer: Renderer, config: NgbDismissibleAlertConfig) {
    this._popupService =
        new PopupService<NgbAlert>(NgbAlert, injector, viewContainerRef, renderer, componentFactoryResolver);
    this.type = config.type;
    this.dismissOnTimeout = config.dismissOnTimeout;
  }

  close(): void { this._popupService.close(); }

  ngOnInit() {
    const windowRef = this._popupService.open(this._templateRef);
    windowRef.instance.type = this.type;
    windowRef.instance.close.subscribe(($event) => {
      this.closeEvent.emit($event);
      this.close();
    });
    if (this.dismissOnTimeout) {
      this._timeout = setTimeout(() => { this.close(); }, this.dismissOnTimeout);
    }
  }

  ngOnDestroy() { clearTimeout(this._timeout); }
}

export const NGB_ALERT_DIRECTIVES = [NgbAlert, NgbDismissibleAlert];
