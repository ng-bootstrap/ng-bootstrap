import {Component, Input, ChangeDetectionStrategy} from '@angular/core';
import {getValueInRange, toBoolean} from '../util/util';

@Component({
  selector: 'ngb-progressbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <progress class="progress {{isAnimated() && 'progress-animated'}} {{isStriped() && 'progress-striped'}} {{type && 'progress-' + type}}"
      [value]="getValue()" [max]="max">
      <div class="progress">
        <span class="progress-bar" [style.width.%]="getPercentValue()"><ng-content></ng-content></span>
      </div>
    </progress>
  `
})
export class NgbProgressbar {
  @Input() max: number = 100;
  @Input() animated: boolean | string;
  @Input() striped: boolean | string;
  @Input() type: string;
  @Input() value: number;

  isAnimated(): boolean { return toBoolean(this.animated); }

  isStriped(): boolean { return toBoolean(this.striped); }

  getValue() { return getValueInRange(this.value, this.max); }

  getPercentValue() { return 100 * this.getValue() / this.max; }
}

export const NGB_PROGRESSBAR_DIRECTIVES = [NgbProgressbar];
