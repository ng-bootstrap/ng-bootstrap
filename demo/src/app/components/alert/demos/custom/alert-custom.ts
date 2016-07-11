import { Component } from '@angular/core';

import { NGB_ALERT_DIRECTIVES } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-alert-custom',
  templateUrl: './alert-custom.html',
  directives: [NGB_ALERT_DIRECTIVES],
  styles: [`
    :host .alert-custom {
      color: #99004d;
      background-color: #f169b4;
      border-color: #800040;
    }
  `]
})
export class NgbdAlertCustom {}
