import { Component, inject } from '@angular/core';
import { NgbProgressbarConfig, NgbProgressbar } from '@ng-bootstrap/ng-bootstrap/progressbar';

@Component({
	selector: 'ngbd-progressbar-config',
	imports: [NgbProgressbar],
	templateUrl: './progressbar-config.html',
	providers: [NgbProgressbarConfig],
})
export class NgbdProgressbarConfig {
	constructor() {
		// customize default values of progress bars used by this component tree
		const config = inject(NgbProgressbarConfig);
		config.max = 1000;
		config.striped = true;
		config.animated = true;
		config.type = 'success';
		config.height = '20px';
	}
}
