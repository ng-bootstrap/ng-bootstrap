import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap/progressbar';

@Component({
	selector: 'ngbd-progressbar-basic',
	imports: [NgbProgressbar],
	changeDetection: ChangeDetectionStrategy.Eager,
	templateUrl: './progressbar-basic.html',
})
export class NgbdProgressbarBasic {}
