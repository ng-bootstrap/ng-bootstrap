import {Component, Input} from '@angular/core';
import {NgbAlertConfig, NgbSelfClosingAlertConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-alert-config',
  templateUrl: './alert-config.html',
  // add NgbProgressbarConfig and NgbSelfClosingAlertConfig to the component providers
  providers: [NgbAlertConfig, NgbSelfClosingAlertConfig]
})
export class NgbdAlertConfig {
  @Input() public alerts: Array<string> = [];

  constructor(alertConfig: NgbAlertConfig, selfClosingAlertConfig: NgbSelfClosingAlertConfig) {
    // customize default values of alerts used by this component tree
    alertConfig.type = 'success';
    alertConfig.dismissible = false;
    selfClosingAlertConfig.dismissible = true;
    selfClosingAlertConfig.dismissOnTimeout = 5000;
    selfClosingAlertConfig.type = 'danger';
  }

  public addAlert() {
    this.alerts.push('This alert has type danger and will close automatically after 5 seconds thanks to the custom config');
  }
}
