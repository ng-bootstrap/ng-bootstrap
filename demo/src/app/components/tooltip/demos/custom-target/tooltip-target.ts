import { Component } from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-tooltip-target',
	standalone: true,
	imports: [NgbTooltipModule],
	templateUrl: './tooltip-target.html',
})
export class NgbdTooltipTarget {}
