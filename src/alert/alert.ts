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
  ComponentFactory,
  ComponentRef,
  TemplateRef
} from '@angular/core';
import {toInteger} from '../util/util';

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
  @Input() dismissible = true;
  /**
   * Alert type (CSS class). Bootstrap 4 recognizes the following types: "success", "info", "warning" and "danger".
   */
  @Input() type = 'warning';
  /**
   * An event emitted when the close button is clicked. This event has no payload. Only relevant for dismissible alerts.
   */
  @Output() close = new EventEmitter();

  closeHandler() { this.close.emit(null); }
}

/**
 * Alerts that can be dismissed without any additional code.
 */
@Directive({selector: 'template[ngbAlert]'})
export class NgbDismissibleAlert implements OnInit, OnDestroy {
  private _windowFactory: ComponentFactory<NgbAlert>;
  private _windowRef: ComponentRef<NgbAlert>;
  private _timeout;

  /**
   * Alert type (CSS class). Bootstrap 4 recognizes the following types: "success", "info", "warning" and "danger".
   */
  @Input() type = 'warning';
  /**
   * An event emitted when the close button is clicked.
   */
  @Output('close') closeEvent = new EventEmitter();
  /**
   *  Time, in milliseconds, before the alert auto closes.
   */
  @Input() dismissOnTimeout: number;

  constructor(
      private _templateRef: TemplateRef<Object>, private _viewContainerRef: ViewContainerRef,
      private _injector: Injector, componentFactoryResolver: ComponentFactoryResolver) {
    this._windowFactory = componentFactoryResolver.resolveComponentFactory(NgbAlert);
  }

  close() {
    if (this._windowRef) {
      this._viewContainerRef.remove(this._viewContainerRef.indexOf(this._windowRef.hostView));
      this._windowRef = null;
    }
  }

  ngOnInit() {
    const nodes = [this._viewContainerRef.createEmbeddedView(this._templateRef).rootNodes];
    this._windowRef = this._viewContainerRef.createComponent(this._windowFactory, 0, this._injector, nodes);
    this._windowRef.instance.type = this.type;
    this._windowRef.instance.close.subscribe(($event) => {
      this.closeEvent.emit($event);
      this.close();
    });
    if (this.dismissOnTimeout) {
      this._timeout = setTimeout(() => { this.close(); }, toInteger(this.dismissOnTimeout));
    }
  }

  ngOnDestroy() { clearTimeout(this._timeout); }
}

export const NGB_ALERT_DIRECTIVES = [NgbAlert, NgbDismissibleAlert];
