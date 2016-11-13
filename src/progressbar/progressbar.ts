import {Component, Input, ChangeDetectionStrategy} from '@angular/core';
import {getValueInRange} from '../util/util';
import {NgbProgressbarConfig} from './progressbar-config';

/**
 * Directive that can be used to provide feedback on the progress of a workflow or an action.
 */
@Component({
  selector: 'ngb-progressbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <progress class="progress{{type ? ' progress-' + type : ''}}{{animated ? ' progress-animated' : ''}}{{striped ? 
    ' progress-striped' : ''}}" 
      [max]="max" [value]="getValue()">
      <div class="progress">
        <span class="progress-bar" [style.width.%]="getPercentValue()"><ng-content></ng-content></span>
      </div>
    </progress>
  `
})
export class NgbProgressbar {
  /**
   * Maximal value to be displayed in the progressbar.
   */
  @Input() max: number;

  /**
   * A flag indicating if the stripes of the progress bar should be animated. Takes effect only for browsers
   * supporting CSS3 animations, and if striped is true.
   */
  @Input() animated: boolean;

  /**
   * A flag indicating if a progress bar should be displayed as striped.
   */
  @Input() striped: boolean;

  /**
   * Type of progress bar, can be one of "success", "info", "warning" or "danger".
   */
  @Input() type: string;

  /**
   * Current value to be displayed in the progressbar. Should be smaller or equal to "max" value.
   */
  @Input() value = 0;

  constructor(config: NgbProgressbarConfig) {
    this.max = config.max;
    this.animated = config.animated;
    this.striped = config.striped;
    this.type = config.type;
  }

  getValue() { return getValueInRange(this.value, this.max); }

  getPercentValue() { return 100 * this.getValue() / this.max; }
}
