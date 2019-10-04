import {Component, Input, ChangeDetectionStrategy} from '@angular/core';
import {getValueInRange} from '../util/util';
import {NgbProgressbarConfig} from './progressbar-config';

/**
 * A directive that provides feedback on the progress of a workflow or an action.
 */
@Component({
  selector: 'ngb-progressbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="progress" [style.height]="height">
      <div class="progress-bar{{type ? ' bg-' + type : ''}}{{animated ? ' progress-bar-animated' : ''}}{{striped ?
    ' progress-bar-striped' : ''}}" role="progressbar" [style.width.%]="getPercentValue()"
    [attr.aria-valuenow]="getValue()" aria-valuemin="0" [attr.aria-valuemax]="max">
        <span *ngIf="showValue" i18n="@@ngb.progressbar.value">{{getPercentValue()}}%</span><ng-content></ng-content>
      </div>
    </div>
  `
})
export class NgbProgressbar {
  /**
   * The maximal value to be displayed in the progressbar.
   */
  @Input() max: number;

  /**
   * If `true`, the stripes on the progressbar are animated.
   *
   * Takes effect only for browsers supporting CSS3 animations, and if `striped` is `true`.
   */
  @Input() animated: boolean;

  /**
   * If `true`, the progress bars will be displayed as striped.
   */
  @Input() striped: boolean;

  /**
   * If `true`, the current percentage will be shown in the `xx%` format.
   */
  @Input() showValue: boolean;

  /**
   * The type of the progress bar.
   *
   * Supports types based on Bootstrap background color variants, like:
   *  `"success"`, `"info"`, `"warning"`, `"danger"`, `"primary"`, `"secondary"`, `"dark"` and so on.
   */
  @Input() type: string;

  /**
   * The current value for the progress bar.
   *
   * Should be in the `[0, max]` range.
   */
  @Input() value = 0;

  /**
   * THe height of the progress bar.
   *
   * Accepts any valid CSS height values, ex. `"2rem"`
   */
  @Input() height: string;

  constructor(config: NgbProgressbarConfig) {
    this.max = config.max;
    this.animated = config.animated;
    this.striped = config.striped;
    this.type = config.type;
    this.showValue = config.showValue;
    this.height = config.height;
  }

  getValue() { return getValueInRange(this.value, this.max); }

  getPercentValue() { return 100 * this.getValue() / this.max; }
}
