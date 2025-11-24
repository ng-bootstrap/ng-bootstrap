import { Component } from '@angular/core';
import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap/progressbar';

@Component({
	selector: 'ngbd-progressbar-height',
	imports: [NgbProgressbar],
	templateUrl: './progressbar-height.html',
})
export class NgbdProgressbarHeight {
	height = '20px';
}
