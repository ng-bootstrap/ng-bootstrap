import {Component} from '@angular/core';
import {ContentWrapper} from '../shared';

@Component({
  selector: 'ngbd-getting-started',
  directives: [ContentWrapper],
  template: require('./getting-started.component.html')
})
export class GettingStarted {}
