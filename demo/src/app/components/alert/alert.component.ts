import {Component} from '@angular/core';

import {ContentWrapper} from '../../shared';
import {ExampleBoxComponent, NgbdApiDocs} from '../shared';
import {AlertBasicComponent, basicHtmlContent, basicTsContent,
        AlertCloseableComponent, closeableHtmlContent, closeableTsContent,
        AlertCustomComponent, customHtmlContent, customTsContent,
        AlertSelfClosingComponent, selfClosingHtmlContent, selfClosingTsContent} from './demos';

@Component({
  selector: 'ngbd-alert',
  template: require('./alert.component.html'),
  directives: [
    AlertBasicComponent,
    AlertCloseableComponent,
    AlertCustomComponent,
    AlertSelfClosingComponent,
    ContentWrapper,
    ExampleBoxComponent,
    NgbdApiDocs]
})
export class NgbdAlert {
  basicHtmlContent = basicHtmlContent;
  basicTsContent = basicTsContent;
  closeableHtmlContent = closeableHtmlContent;
  closeableTsContent = closeableTsContent;
  customHtmlContent = customHtmlContent;
  customTsContent = customTsContent;
  selfClosingHtmlContent = selfClosingHtmlContent;
  selfClosingTsContent = selfClosingTsContent;
}
