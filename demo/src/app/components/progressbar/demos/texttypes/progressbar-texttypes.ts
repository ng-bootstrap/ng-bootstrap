import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap/progressbar';

@Component({
	selector: 'ngbd-progressbar-texttypes',
	imports: [NgbProgressbar],
	changeDetection: ChangeDetectionStrategy.Eager,
	templateUrl: './progressbar-texttypes.html',
})
export class NgbdProgressbarTextTypes {}
