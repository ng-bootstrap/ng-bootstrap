import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap/progressbar';

@Component({
	selector: 'ngbd-progressbar-showvalue',
	imports: [NgbProgressbar],
	changeDetection: ChangeDetectionStrategy.Eager,
	templateUrl: './progressbar-showvalue.html',
})
export class NgbdProgressbarShowvalue {}
