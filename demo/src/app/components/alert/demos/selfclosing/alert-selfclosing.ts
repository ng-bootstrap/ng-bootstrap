import {Component, Input} from '@angular/core';

@Component({
  selector: 'ngbd-alert-selfclosing',
  templateUrl: './alert-selfclosing.html'
})
export class NgbdAlertSelfclosing {
  @Input()
  public alerts: Array<string> = [];

  public addAlert() {
    this.alerts.push('This alert will close automatically after 5 seconds');
  }
}
