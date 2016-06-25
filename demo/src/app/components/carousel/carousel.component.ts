import {Component} from '@angular/core';
import {NgbdApiDocs} from '../shared/api-docs';

@Component({
  selector: 'ngbd-carousel',
  template: `
    <ngbd-api-docs directive="NgbCarousel"></ngbd-api-docs>
    <ngbd-api-docs directive="NgbSlide"></ngbd-api-docs>
  `,
  directives: [NgbdApiDocs]
})
export class NgbdCarousel {}
