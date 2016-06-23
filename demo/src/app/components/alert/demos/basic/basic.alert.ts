import { Component } from '@angular/core';

import { NgbAlert } from '@ng-bootstrap/alert';

@Component({
  selector: 'ngbd-alert-basic',
  template: require('./basic.alert.html'),
  directives: [NgbAlert]
})
export class AlertBasicComponent {}
