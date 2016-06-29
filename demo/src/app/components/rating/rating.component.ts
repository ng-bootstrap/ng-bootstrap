import {Component} from '@angular/core';
import {ContentWrapper} from '../../shared';
import {ExampleBoxComponent, NgbdApiDocs} from '../shared';
import {RatingBasicComponent, basicHtmlContent, basicTsContent} from './demos';

@Component({
  selector: 'ngbd-rating',
  template: require('./rating.component.html'),
  directives: [ContentWrapper, RatingBasicComponent, NgbdApiDocs, ExampleBoxComponent]
})
export class NgbdRating {
  basicHtmlContent = basicHtmlContent;
  basicTsContent = basicTsContent;
}
