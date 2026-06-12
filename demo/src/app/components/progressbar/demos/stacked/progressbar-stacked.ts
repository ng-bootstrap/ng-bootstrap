import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgbProgressbar, NgbProgressbarStacked } from '@ng-bootstrap/ng-bootstrap/progressbar';

@Component({
	selector: 'ngbd-progressbar-stacked',
	imports: [NgbProgressbar, NgbProgressbarStacked],
	changeDetection: ChangeDetectionStrategy.Eager,
	templateUrl: './progressbar-stacked.html',
})
export class NgbdProgressbarStacked {}
