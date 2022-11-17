import { Component } from '@angular/core';
import { NgbProgressbarConfig, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-progressbar-config',
	standalone: true,
	imports: [NgbProgressbarModule],
	templateUrl: './progressbar-config.html',
	providers: [NgbProgressbarConfig], // add the NgbProgressbarConfig to the component providers
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
