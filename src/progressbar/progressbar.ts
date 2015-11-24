import {Component, Input} from 'angular2/angular2';

@Component({
  selector: 'ngb-progressbar',
  template: `
    <progress class="progress {{striped && 'progress-striped'}} {{type && 'progress-' + type}}" [value]="value" [max]="max">
      <div class="progress">
        <span class="progress-bar" [style.width.%]="calculatePercentage()"><ng-content></ng-content></span>
      </div>
    </progress>
  `
})
export class NgbProgressbar {
  private _max = 100;
  private _striped: boolean;
  private _value: number;

  @Input()
  set max(value: number) {
    this._max = value;
    this.value = Math.min(this.value, this._max);
  }

  get max(): number { return this._max; }

  @Input()
  set striped(value: boolean | string) {
    if (value === '') {  // boolean usage
      value = true;
    }

    this._striped = !!value;
  }

  get striped(): boolean | string { return this._striped; }

  @Input() type: string;

  @Input()
  set value(value: number) {
    this._value = Math.max(Math.min(value, this.max), 0);
  }

  get value(): number { return this._value; }

  calculatePercentage() { return 100 * this.value / this.max; }
}
