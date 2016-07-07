import {Component, Input} from '@angular/core';

import { NgbAlert, NGB_ALERT_DIRECTIVES } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-alert-self-closing',
  template: require('./alert-selfClosing.html'),
  directives: [NGB_ALERT_DIRECTIVES],
  precompile: [NgbAlert]
})
export class NgbdAlertSelfClosing {
  @Input()
  public alerts: Array<string> = [];

  public addAlert() {
    this.alerts.push('This alert will close automatically after 5 seconds');
  }
}
