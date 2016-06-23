import { Component } from '@angular/core';

import { NgbAlert } from '@ng-bootstrap/alert';

@Component({
  selector: 'ngbd-alert-custom',
  template: require('./custom.alert.html'),
  directives: [NgbAlert],
  styles: [`
    :host .alert-custom {
      color: #99004d;
      background-color: #f169b4;
      border-color: #800040;
    }
  `]
})
export class AlertCustomComponent {}
