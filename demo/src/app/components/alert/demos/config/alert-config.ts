import { Component, inject } from '@angular/core';
import { NgbAlertConfig, NgbAlert } from '@ng-bootstrap/ng-bootstrap/alert';

@Component({
	selector: 'ngbd-alert-config',
	imports: [NgbAlert],
	templateUrl: './alert-config.html',
	// add NgbAlertConfig  to the component providers
	providers: [NgbAlertConfig],
})
export class NgbdAlertConfig {
	constructor() {
		// customize default values of alerts used by this component tree
		const alertConfig = inject(NgbAlertConfig);
		alertConfig.type = 'success';
		alertConfig.dismissible = false;
	}
}
