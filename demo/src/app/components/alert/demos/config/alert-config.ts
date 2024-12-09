import { Component } from '@angular/core';
import { NgbAlertConfig, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'ngbd-alert-config',
    imports: [NgbAlertModule],
    templateUrl: './alert-config.html',
    // add NgbAlertConfig  to the component providers
    providers: [NgbAlertConfig]
})
export class NgbdAlertConfig {
	constructor(alertConfig: NgbAlertConfig) {
		// customize default values of alerts used by this component tree
		alertConfig.type = 'success';
		alertConfig.dismissible = false;
	}
}
