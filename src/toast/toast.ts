import {
  AfterContentInit,
  Attribute,
  Component,
  ContentChild,
  Directive,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation,
  ElementRef,
} from '@angular/core';

import {NgbToastConfig} from './toast-config';
import {NgbRunTransition} from '../util/transition/ngbTransition';
import {NgbAlertFadingTransition} from '../util/transition/ngbFadingTransition';

/**
 * This directive allows the usage of HTML markup or other directives
 * inside of the toast's header.
 *
 * @since 5.0.0
 */
@Directive({selector: '[ngbToastHeader]'})
export class NgbToastHeader {
}

/**
 * Toasts provide feedback messages as notifications to the user.
 * Goal is to mimic the push notifications available both on mobile and desktop operating systems.
 *
 * @since 5.0.0
 */
@Component({
  selector: 'ngb-toast',
  exportAs: 'ngbToast',
  encapsulation: ViewEncapsulation.None,
  host: {
    'role': 'alert',
    '[attr.aria-live]': 'ariaLive',
    'aria-atomic': 'true',
    '[class.toast]': 'true',
    '[class.show]': 'true',
    '[class.fade]': 'animation',
  },
  template: `
    <ng-template #headerTpl>
      <strong class="mr-auto">{{header}}</strong>
    </ng-template>
    <ng-template [ngIf]="contentHeaderTpl || header">
      <div class="toast-header">
        <ng-template [ngTemplateOutlet]="contentHeaderTpl || headerTpl"></ng-template>
        <button type="button" class="close" aria-label="Close" i18n-aria-label="@@ngb.toast.close-aria" (click)="hide()">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </ng-template>
    <div class="toast-body">
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./toast.scss']
})
export class NgbToast implements AfterContentInit,
    OnChanges {
  private _timeoutID;

  /**
   * Delay after which the toast will hide (ms).
   * default: `500` (ms) (inherited from NgbToastConfig)
   */
  @Input() delay: number;

  /**
   * Auto hide the toast after a delay in ms.
   * default: `true` (inherited from NgbToastConfig)
   */
  @Input() autohide: boolean;

  /**
   * Text to be used as toast's header.
   * Ignored if a ContentChild template is specified at the same time.
   */
  @Input() header: string;

  /**
   * A flag to enable/disable the animation when closing.
   */
  @Input() animation: boolean;

  /**
   * A template like `<ng-template ngbToastHeader></ng-template>` can be
   * used in the projected content to allow markup usage.
   */
  @ContentChild(NgbToastHeader, {read: TemplateRef, static: true}) contentHeaderTpl: TemplateRef<any>| null = null;

  /**
   * An event fired immediately when toast's `hide()` method has been called.
   * It can only occur in 2 different scenarios:
   * - `autohide` timeout fires
   * - user clicks on a closing cross (&times)
   *
   * Additionally this output is purely informative. The toast won't disappear. It's up to the user to take care of
   * that.
   */
  @Output('hide') hideOutput = new EventEmitter<void>();

  private _transitionRunning = false;

  constructor(@Attribute('aria-live') public ariaLive: string, config: NgbToastConfig, private _element: ElementRef) {
    if (this.ariaLive == null) {
      this.ariaLive = config.ariaLive;
    }
    this.delay = config.delay;
    this.autohide = config.autohide;
    this.animation = config.animation;
  }

  ngAfterContentInit() { this._init(); }

  ngOnChanges(changes: SimpleChanges) {
    if ('autohide' in changes) {
      this._clearTimeout();
      this._init();
    }
  }

  hide() {
    this._clearTimeout();
    if (this.animation) {
      if (!this._transitionRunning) {
        this._transitionRunning = true;
        // Element is hidden only if animation is enabled
        NgbRunTransition(this._element.nativeElement, NgbAlertFadingTransition, {
          animation: this.animation
        }).subscribe(() => {
          this._transitionRunning = false;
          this.hideOutput.emit();
        });
      }
    } else {
      // Up to the application to hide the toast
      this.hideOutput.emit();
    }
  }

  private _init() {
    if (this.autohide && !this._timeoutID) {
      this._timeoutID = setTimeout(() => this.hide(), this.delay);
    }
  }

  private _clearTimeout() {
    if (this._timeoutID) {
      clearTimeout(this._timeoutID);
      this._timeoutID = null;
    }
  }
}
