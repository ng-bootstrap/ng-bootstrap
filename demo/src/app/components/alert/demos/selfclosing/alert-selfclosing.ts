import {Component, Input} from '@angular/core';

import { NgbAlert, NGB_ALERT_DIRECTIVES } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-alert-selfclosing',
  templateUrl: './alert-selfclosing.html',
  directives: [NGB_ALERT_DIRECTIVES],
  precompile: [NgbAlert]
})
export class NgbdAlertSelfclosing {
  @Input()
  public alerts: Array<string> = [];

  public addAlert() {
    this.alerts.push('This alert will close automatically after 5 seconds');
  }
}
