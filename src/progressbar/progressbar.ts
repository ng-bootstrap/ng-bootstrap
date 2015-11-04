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
  private _striped: boolean;

  @Input() max = 100;

  @Input()
  set striped(value: boolean | string) {
    if (value === '') {  // boolean usage
      value = true;
    }

    this._striped = !!value;
  }

  get striped(): boolean | string { return this._striped; }

  @Input() type: string;

  @Input() value: number;

  calculatePercentage() { return 100 * this.value / this.max; }
}
