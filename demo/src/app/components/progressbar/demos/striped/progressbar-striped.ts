import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap/progressbar';

@Component({
	selector: 'ngbd-progressbar-striped',
	imports: [NgbProgressbar],
	changeDetection: ChangeDetectionStrategy.Eager,
	templateUrl: './progressbar-striped.html',
})
export class NgbdProgressbarStriped {}
