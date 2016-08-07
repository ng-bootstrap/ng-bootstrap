import {Component, Input, ChangeDetectionStrategy} from '@angular/core';
import {getValueInRange} from '../util/util';

/**
 * Directive that can be used to provide feedback on the progress of a workflow or an action.
 */
@Component({
  selector: 'ngb-progressbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <progress class="progress {{type ? 'progress-' + type : ''}}" 
      [class.progress-animated]="animated" 
      [class.progress-striped]="striped"
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
  @Input() max = 100;

  /**
   * A flag indicating if a progress bar should be animated when the value changes. Takes effect only for browsers
   * supporting CSS3 animations.
   */
  @Input() animated = false;

  /**
   * A flag indicating if a progress bar should be displayed as striped.
   */
  @Input() striped = false;

  /**
   * Type of progress bar, can be one of "success", "info", "warning" or "danger".
   */
  @Input() type: string;

  /**
   * Current value to be displayed in the progressbar. Should be smaller or equal to "max" value.
   */
  @Input() value = 0;

  getValue() { return getValueInRange(this.value, this.max); }

  getPercentValue() { return 100 * this.getValue() / this.max; }
}

export const NGB_PROGRESSBAR_DIRECTIVES = [NgbProgressbar];
