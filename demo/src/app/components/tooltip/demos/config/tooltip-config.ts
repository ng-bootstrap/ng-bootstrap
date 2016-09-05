import {Component} from '@angular/core';
import {NgbTooltipConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-tooltip-config',
  templateUrl: './tooltip-config.html',
  providers: [NgbTooltipConfig] // add NgbTooltipConfig to the component providers
})
export class NgbdTooltipConfig {
  constructor(config: NgbTooltipConfig) {
    // customize default values of tooltips used by this component tree
    config.placement = 'right';
    config.triggers = 'click';
  }
}
