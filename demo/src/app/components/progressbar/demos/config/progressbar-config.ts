import { Component } from '@angular/core';
import { NgbProgressbarConfig, NgbProgressbar } from '@ng-bootstrap/ng-bootstrap/progressbar';

@Component({
	selector: 'ngbd-progressbar-config',
	imports: [NgbProgressbar],
	templateUrl: './progressbar-config.html',
	providers: [NgbProgressbarConfig],
})
export class NgbdProgressbarConfig {
	constructor(config: NgbProgressbarConfig) {
		// customize default values of progress bars used by this component tree
		config.max = 1000;
		config.striped = true;
		config.animated = true;
		config.type = 'success';
		config.height = '20px';
	}
}
