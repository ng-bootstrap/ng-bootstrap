import {Component} from '@angular/core';
import {ContentWrapper} from '../../shared';
import {NgbdApiDocs} from '../shared/api-docs';

@Component({
  selector: 'ngbd-carousel',
  template: `
    <ngbd-content-wrapper component="Carousel">
      <ngbd-api-docs directive="NgbCarousel"></ngbd-api-docs>
      <ngbd-api-docs directive="NgbSlide"></ngbd-api-docs>
    </ngbd-content-wrapper>
  `,
  directives: [ContentWrapper, NgbdApiDocs]
})
export class NgbdCarousel {}
