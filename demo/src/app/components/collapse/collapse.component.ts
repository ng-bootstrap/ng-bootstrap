import {Component} from '@angular/core';

import {ContentWrapper} from '../../shared';
import {ExampleBoxComponent, NgbdApiDocs} from '../shared';
import {CollapseBasicComponent, basicHtmlContent, basicTsContent } from './demos';

@Component({
  selector: 'ngbd-collapse',
  template: require('./collapse.component.html'),
  directives: [
    CollapseBasicComponent,
    ContentWrapper,
    ExampleBoxComponent,
    NgbdApiDocs
  ]
})
export class NgbdCollapse {
  basicHtmlContent = basicHtmlContent;
  basicTsContent = basicTsContent;
}
