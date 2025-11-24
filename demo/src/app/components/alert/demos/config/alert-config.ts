import { Component } from '@angular/core';
import { NgbAlertConfig, NgbAlert } from '@ng-bootstrap/ng-bootstrap/alert';

@Component({
	selector: 'ngbd-alert-config',
	imports: [NgbAlert],
	templateUrl: './alert-config.html',
	// add NgbAlertConfig  to the component providers
	providers: [NgbAlertConfig],
})
export class NgbdAlertConfig {
	constructor(alertConfig: NgbAlertConfig) {
		// customize default values of alerts used by this component tree
		alertConfig.type = 'success';
		alertConfig.dismissible = false;
	}
}
