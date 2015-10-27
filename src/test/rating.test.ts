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

import {Component} from 'angular2/angular2';

import {NgbRating} from '../components/rating';

describe('ngb-rating', () => {
  it('should show 10 stars by default', injectAsync([TestComponentBuilder], (tcb) => {
       return tcb.createAsync(NgbRating).then((fixture) => {
         fixture.detectChanges();

         const compiled = fixture.debugElement.nativeElement;

         const stars = compiled.querySelectorAll('i');
         expect(stars.length).toBe(10);
       });
     }));

  it('should change the num of stars with `max`', injectAsync([TestComponentBuilder], (tcb) => {
       const html = '<ngb-rating max="3"></ngb-rating>';

       return tcb.overrideTemplate(TestComponent, html)
           .createAsync(TestComponent)
           .then((fixture) => {
             fixture.detectChanges();

             const compiled = fixture.debugElement.nativeElement;

             const stars = compiled.querySelectorAll('i');
             expect(stars.length).toBe(3);
           });
     }));

  describe('aria support', () => {
    it('contains aria-valuemax with the number of stars', injectAsync([TestComponentBuilder], (tcb) => {
         const html = '<ngb-rating [max]="max"></ngb-rating>';

         return tcb.overrideTemplate(TestComponent, html)
             .createAsync(TestComponent)
             .then((fixture) => {
               fixture.detectChanges();

               const compiled = fixture.debugElement.nativeElement;

               expect(compiled.querySelector('span').getAttribute('aria-valuemax')).toBe('10');
             });
       }));

    it('contains a hidden span for each star for screenreaders', injectAsync([TestComponentBuilder], (tcb) => {
         const html = '<ngb-rating max="5"></ngb-rating>';

         return tcb.overrideTemplate(TestComponent, html)
             .createAsync(TestComponent)
             .then((fixture) => {
               fixture.detectChanges();

               let compiled = fixture.debugElement.nativeElement;
               let hiddenStars = compiled.querySelectorAll('.sr-only');
               expect(hiddenStars.length).toBe(5);
             });
       }));
  });
});

@Component({selector: 'test-cmp', directives: [NgbRating], template: ''})
class TestComponent {
  max: number = 10;
}
