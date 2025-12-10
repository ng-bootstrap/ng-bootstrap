import { Component } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-tooltip-disable',
  imports: [NgbTooltip],
  templateUrl: './tooltip-disable.html',
})
export class NgbdTooltipDisable {
	public state: boolean = false;
}
