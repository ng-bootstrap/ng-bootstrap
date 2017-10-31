import {ChangeDetectionStrategy, Component, ElementRef, Input, Renderer2, SimpleChanges} from '@angular/core';
import {getValueInRange} from '../util/util';
import {NgbProgressbarConfig} from './progressbar-config';

/**
 * Directive that can be used to provide feedback on the progress of a workflow or an action.
 */
@Component({
  selector: 'ngb-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'progress-bar',
    'role': 'progressbar',
    '[attr.aria-valuenow]': 'getValue()',
    '[attr.aria-valuemin]': '0',
    '[attr.aria-valuemax]': 'max',
    '[style.width.%]': 'getPercentValue()',
    '[style.height]': 'height',
    '[class.progress-bar-animated]': 'animated',
    '[class.progress-bar-striped]': 'striped',
  },
  template: `
    <span *ngIf="showValue">{{getPercentValue()}}%</span>
    <ng-content></ng-content>
  `
})
export class NgbBar {
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
   * A flag indicating if the current percentage value should be shown.
   */
  @Input() showValue: boolean;

  /**
   * Type of progress bar, can be one of "success", "info", "warning" or "danger".
   */
  @Input() type: string;

  /**
   * Current value to be displayed in the progressbar. Should be smaller or equal to "max" value.
   */
  @Input() value = 0;

  /**
   * Height of the progress bar. Accepts any valid CSS height values, ex. '2rem'
   */
  @Input() height: string;

  constructor(config: NgbProgressbarConfig, private el: ElementRef, private r: Renderer2) {
    this.max = config.max;
    this.animated = config.animated;
    this.striped = config.striped;
    this.type = config.type;
    this.showValue = config.showValue;
    this.height = config.height;
  }

  ngOnChanges(changes: SimpleChanges) {
    const typeChange = changes['type'];
    if (typeChange) {
      this.r.removeClass(this.el.nativeElement, `bg-${typeChange.previousValue}`);
      this.r.addClass(this.el.nativeElement, `bg-${typeChange.currentValue}`);
    }
  }

  getValue() { return getValueInRange(this.value, this.max); }

  getPercentValue() { return 100 * this.getValue() / this.max; }
}

/**
 * Directive that can be used to provide feedback on the progress of a workflow or an action.
 */
@Component({
  selector: 'ngb-progressbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {'[class.progress]': 'true', '[style.height]': 'height'},
  template: `
    <ngb-bar [value]="value" [type]="type" [max]="max" [animated]="animated" [striped]="striped" [showValue]="showValue">
      <ng-content></ng-content>
    </ngb-bar>
  `
})
export class NgbProgressbar extends NgbBar {
  constructor(config: NgbProgressbarConfig, el: ElementRef, r: Renderer2) { super(config, el, r); }

  ngOnChanges() {
    // do nothing in ngb-progressbar
  }
}

/**
 * Directive that can be used to show stacked progress bars.
 */
@Component({
  selector: 'ngb-progressbar-stack',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {'[class.progress]': 'true', '[style.height]': 'height'},
  template: `<ng-content></ng-content>`
})
export class NgbProgressbarStack {
  /**
   * Height of the progress bar. Accepts any valid CSS height values, ex. '2rem'
   */
  @Input() height: string;
}
