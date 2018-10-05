import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  Renderer2,
  ElementRef,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';

import {NgbAlertConfig} from './alert-config';
import {ngbRunTransition} from '../util/transition/ngbTransition';
import {ngbAlertFadingTransition} from '../util/transition/ngbFadingTransition';

/**
 * Alert is a component to provide contextual feedback messages for user.
 *
 * It supports several alert types and can be dismissed.
 */
@Component({
  selector: 'ngb-alert',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {'role': 'alert', 'class': 'alert show fade', '[class.alert-dismissible]': 'dismissible'},
  template: `
    <ng-content></ng-content>
    <button *ngIf="dismissible" type="button" class="close" aria-label="Close" i18n-aria-label="@@ngb.alert.close"
      (click)="close()">
      <span aria-hidden="true">&times;</span>
    </button>
    `,
  styleUrls: ['./alert.scss']
})
export class NgbAlert implements OnInit,
    OnChanges {
  /**
   * If `true`, alert closing will be animated.
   *
   * Animation is triggered only when clicked on the close button (×)
   * or via the `.close()` function
   */
  @Input() animation: boolean;

  /**
   * If `true`, alert can be dismissed by the user.
   *
   * The close button (×) will be displayed and you can be notified
   * of the event with the `(close)` output.
   */
  @Input() dismissible: boolean;

  /**
   * Type of the alert.
   *
   * Bootstrap provides styles for the following types: `'success'`, `'info'`, `'warning'`, `'danger'`, `'primary'`,
   * `'secondary'`, `'light'` and `'dark'`.
   */
  @Input() type: string;

  /**
   * An event emitted when the close button is clicked. It has no payload and only relevant for dismissible alerts.
   */
  @Output('close') closeEvent = new EventEmitter<void>();


  constructor(config: NgbAlertConfig, private _renderer: Renderer2, private _element: ElementRef) {
    this.dismissible = config.dismissible;
    this.type = config.type;
    this.animation = config.animation;
  }

  close() {
    ngbRunTransition(this._element.nativeElement, ngbAlertFadingTransition, {
      animation: this.animation,
      runningTransition: 'continue'
    }).subscribe(() => this.closeEvent.emit());
  }

  ngOnChanges(changes: SimpleChanges) {
    const typeChange = changes['type'];
    if (typeChange && !typeChange.firstChange) {
      this._renderer.removeClass(this._element.nativeElement, `alert-${typeChange.previousValue}`);
      this._renderer.addClass(this._element.nativeElement, `alert-${typeChange.currentValue}`);
    }
  }

  ngOnInit() { this._renderer.addClass(this._element.nativeElement, `alert-${this.type}`); }
}
