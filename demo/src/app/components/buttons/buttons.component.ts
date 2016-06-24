import {Component} from '@angular/core';
import {ContentWrapper} from '../../shared';
import {NgbdApiDocs} from '../shared/api-docs';

@Component({
  selector: 'ngbd-buttons',
  template: require('./buttons.component.html'),
  directives: [ContentWrapper, NgbdApiDocs]
})
export class NgbdButtons {}
