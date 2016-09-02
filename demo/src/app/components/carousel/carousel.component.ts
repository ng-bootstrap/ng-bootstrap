import {Component} from '@angular/core';
import {DEMO_SNIPPETS} from './demos';

@Component({
  selector: 'ngbd-carousel',
  template: `
    <ngbd-content-wrapper component="Carousel">
      <ngbd-api-docs directive="NgbCarousel"></ngbd-api-docs>
      <ngbd-api-docs directive="NgbSlide"></ngbd-api-docs>
      <ngbd-api-docs-config type="NgbCarouselConfig"></ngbd-api-docs-config>
      <ngbd-example-box demoTitle="Carousel" [htmlSnippet]="snippets.basic.markup" [tsSnippet]="snippets.basic.code">
        <ngbd-carousel-basic></ngbd-carousel-basic>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Global configuration of carousels" 
                        [htmlSnippet]="snippets.config.markup" 
                        [tsSnippet]="snippets.config.code">
        <ngbd-carousel-config></ngbd-carousel-config>
      </ngbd-example-box>
    </ngbd-content-wrapper>
  `
})
export class NgbdCarousel {
  snippets = DEMO_SNIPPETS;
}
