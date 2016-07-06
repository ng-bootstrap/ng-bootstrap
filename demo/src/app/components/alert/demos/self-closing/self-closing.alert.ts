import {Component, Input} from '@angular/core';

import {NgbAlert, NgbDismissibleAlert} from '@ng-bootstrap/alert';

@Component({
  selector: 'ngbd-alert-self-closing',
  template: require('./self-closing.alert.html'),
  directives: [NgbAlert, NgbDismissibleAlert],
  precompile: [NgbAlert]
})
export class AlertSelfClosingComponent {
  @Input()
  public alerts: Array<string> = [];

  public addAlert() {
    this.alerts.push('This alert will close automatically after 5 seconds');
  }
}
