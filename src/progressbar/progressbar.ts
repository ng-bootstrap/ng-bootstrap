import {Component, Input, ChangeDetectionStrategy} from 'angular2/angular2';

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

  isStriped(): boolean { return this.striped === '' ? true : !!this.striped; }

  getValue() { return Math.max(Math.min(this.value, this.max), 0); }

  getPercentValue() { return 100 * this.getValue() / this.max; }
}
