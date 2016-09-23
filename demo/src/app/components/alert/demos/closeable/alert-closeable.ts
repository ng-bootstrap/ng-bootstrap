import { Input, Component } from '@angular/core';

@Component({
  selector: 'ngbd-alert-closeable',
  templateUrl: './alert-closeable.html'
})
export class NgbdAlertCloseable {

  @Input()
  public alerts: Array<IAlert> = [];

  private backup: Array<IAlert>;

  constructor() {
    this.alerts.push({
      id: 1,
      type: 'success',
      message: 'This is an success alert',
    }, {
      id: 2,
      type: 'info',
      message: 'This is an info alert',
    }, {
      id: 3,
      type: 'warning',
      message: 'This is a warning alert',
    }, {
      id: 4,
      type: 'danger',
      message: 'This is a danger alert',
    });
    this.backup = this.alerts.map((alert: IAlert) => Object.assign({}, alert));
  }

  public closeAlert(alert: IAlert) {
    const index: number = this.alerts.indexOf(alert);
    this.alerts.splice(index, 1);
  }

  public reset() {
    this.alerts = this.backup.map((alert: IAlert) => Object.assign({}, alert));
  }
}

export interface IAlert {
  id: number;
  type: string;
  message: string;
}
