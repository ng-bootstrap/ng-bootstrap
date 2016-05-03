import {Component, Input, ChangeDetectionStrategy} from '@angular/core';
import {getValueInRange, toBoolean} from '../util/util';

@Component({
  selector: 'ngb-progressbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <progress class="progress {{isStriped() && 'progress-striped'}} {{type && 'progress-' + type}}" [value]="getValue()" [max]="max">
      <div class="progress">
        <span class="progress-bar" [style.width.%]="getPercentValue()"><ng-content></ng-content></span>
      </div>
    </progress>
  `
})
export class NgbProgressbar {
  @Input() max = 100;
  @Input() striped: boolean | string;
  @Input() type: string;
  @Input() value: number;

  isStriped(): boolean { return toBoolean(this.striped); }

  getValue() { return getValueInRange(this.value, this.max); }

  getPercentValue() { return 100 * this.getValue() / this.max; }
}
