import {Component} from '@angular/core';
import {ContentWrapper} from '../../shared';
import {ExampleBoxComponent, NgbdApiDocs} from '../shared';
import {DEMO_DIRECTIVES, DEMO_SNIPPETS} from './demos';

@Component({
  selector: 'ngbd-tabs',
  template: require('./tabset.component.html'),
  directives: [ContentWrapper, NgbdApiDocs, DEMO_DIRECTIVES, ExampleBoxComponent]
})
export class NgbdTabs {
   snippets = DEMO_SNIPPETS;
}
