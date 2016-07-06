import {Component} from '@angular/core';

import {ContentWrapper} from '../../shared';
import {ExampleBoxComponent, NgbdApiDocs} from '../shared';
import {AccordionBasicComponent, basicHtmlContent, basicTsContent, AccordionStaticComponent, staticHtmlContent, staticTsContent} from './demos';

@Component({
  selector: 'ngbd-accordion',
  template: require('./accordion.component.html'),
  directives: [ContentWrapper, AccordionBasicComponent, AccordionStaticComponent, NgbdApiDocs, ExampleBoxComponent]
})
export class NgbdAccordion {
  basicHtmlContent = basicHtmlContent;
  basicTsContent = basicTsContent;
  staticHtmlContent = staticHtmlContent;
  staticTsContent = staticTsContent;
}
