import {Component, Input} from '@angular/core';
import {NgbAlertConfig, NgbDismissibleAlertConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-alert-config',
  templateUrl: './alert-config.html',
  // add NgbProgressbarConfig and NgbDismissibleAlertConfig to the component providers
  providers: [NgbAlertConfig, NgbDismissibleAlertConfig]
})
export class NgbdAlertConfig {
  @Input() public alerts: Array<string> = [];

  constructor(alertConfig: NgbAlertConfig, dismissibleAlertConfig: NgbDismissibleAlertConfig) {
    // customize default values of alerts used by this component tree
    alertConfig.type = 'success';
    alertConfig.dismissible = false;
    dismissibleAlertConfig.dismissOnTimeout = 5000;
    dismissibleAlertConfig.type = 'danger';
  }

  public addAlert() {
    this.alerts.push('This alert has type danger and will close automatically after 5 seconds thanks to the custom config');
  }
}
