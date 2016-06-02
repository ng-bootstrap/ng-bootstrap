import {Component, Input, ChangeDetectionStrategy} from '@angular/core';

@Component({
  selector: 'ngb-tooltip-window',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {'[class]': '"tooltip " + placement', 'role': 'tooltip'},
  template: `
    <div class="tooltip-arrow"></div>
    <div class="tooltip-inner"><ng-content></ng-content></div>
    `
})
export class NgbTooltipWindow {
  @Input() placement = 'top';
}
