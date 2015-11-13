import {
  iit,
  it,
  ddescribe,
  describe,
  expect,
  inject,
  injectAsync,
  TestComponentBuilder,
  beforeEachProviders
} from 'angular2/testing';

import {Component, NgFor} from 'angular2/angular2';

import {NgbCarousel, NgbSlide} from './carousel';

function getSlides(compiled) {
  return compiled.querySelectorAll('.carousel-item');
}

function hasClass(element: Element, str: string): Boolean {
  return new RegExp(`(^|\\s)${str}(\\s|$)`).test(element.className)
}

describe('ngb-carousel', () => {
  describe('UI logic', () => {
    let html: string;

    beforeEach(() => {
      html = `
      <ngb-carousel [(active)]="activeSlide">
        <ngb-slide>
          <div class="text-content">{{slides[0].content}}</div>
        </ngb-slide>
        <ngb-slide>
          <div class="text-content">{{slides[1].content}}</div>
        </ngb-slide>
        <ngb-slide>
          <div class="text-content">{{slides[2].content}}</div>
        </ngb-slide>
      </ngb-carousel>
    `;
    });

    it('should set the first slide as active when no active', injectAsync([TestComponentBuilder], (tcb) => {
         return tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.detectChanges();

           const compiled = fixture.debugElement.nativeElement;

           let slides = getSlides(compiled);

           expect(hasClass(slides[0], 'active')).toBe(true);
           expect(hasClass(slides[1], 'active')).toBe(false);
           expect(hasClass(slides[2], 'active')).toBe(false);
         });
       }));

    it('should change slides appropriately', injectAsync([TestComponentBuilder], (tcb) => {
         return tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.detectChanges();

           const tc = fixture.debugElement.componentInstance;
           const compiled = fixture.debugElement.nativeElement;

           let slides = getSlides(compiled);

           tc.activeSlide = 1;
           fixture.detectChanges();

           expect(hasClass(slides[0], 'active')).toBe(false);
           expect(hasClass(slides[1], 'active')).toBe(true);
           expect(hasClass(slides[2], 'active')).toBe(false);

           tc.activeSlide = 0;
           fixture.detectChanges();

           expect(hasClass(slides[0], 'active')).toBe(true);
           expect(hasClass(slides[1], 'active')).toBe(false);
           expect(hasClass(slides[2], 'active')).toBe(false);

           tc.activeSlide = 2;
           fixture.detectChanges();

           expect(hasClass(slides[0], 'active')).toBe(false);
           expect(hasClass(slides[1], 'active')).toBe(false);
           expect(hasClass(slides[2], 'active')).toBe(true);
         });
       }));
  });
});

@Component({selector: 'test-cmp', directives: [NgFor, NgbCarousel, NgbSlide], template: ''})
class TestComponent {
  activeSlide: number;
  slides: any[] = [{content: 'foo'}, {content: 'bar'}, {content: 'baz'}];
}
