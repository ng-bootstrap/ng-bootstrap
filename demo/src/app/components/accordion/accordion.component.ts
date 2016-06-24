import {Component} from '@angular/core';

import {ContentWrapper} from '../../shared';
import {ExampleBoxComponent, NgbdApiDocs} from '../shared';
import {AccordionBasicComponent, basicHtmlContent, basicTsContent} from './demos';

@Component({
  selector: 'ngbd-accordion',
  template: require('./accordion.component.html'),
  directives: [ContentWrapper, AccordionBasicComponent, NgbdApiDocs, ExampleBoxComponent]
})
export class NgbdAccordion {
  basicHtmlContent = basicHtmlContent;
  basicTsContent = basicTsContent;
}
