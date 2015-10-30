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

function getStar(compiled, num: number) {
  return getStars(compiled)[num - 1];
}

function getStars(element, selector = 'i') {
  return element.querySelectorAll(selector);
}

function getState(compiled) {
  const stars = getStars(compiled);
  let state = [];
  for (let i = 0, l = stars.length; i < l; i++) {
    state.push((stars[i].classList.contains('glyphicon-star') && !stars[i].classList.contains('glyphicon-star-empty')));
  }
  return state;
}

function getAriaState(compiled) {
  const stars = getStars(compiled, '.sr-only');
  let state = [];
  for (let i = 0, l = stars.length; i < l; i++) {
    state.push((stars[i].textContent === '(*)' && stars[i].textContent !== '( )'));
  }
  return state;
}

describe('ngb-rating', () => {
  it('should show 10 stars by default', injectAsync([TestComponentBuilder], (tcb) => {
       return tcb.createAsync(NgbRating).then((fixture) => {
         fixture.detectChanges();

         const compiled = fixture.debugElement.nativeElement;

         const stars = getStars(compiled);
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

             const stars = getStars(compiled);
             expect(stars.length).toBe(3);
           });
     }));

  it('initializes the default star icons as selected', injectAsync([TestComponentBuilder], (tcb) => {
       const html = '<ngb-rating rate="3" max="5"></ngb-rating>';

       return tcb.overrideTemplate(TestComponent, html)
           .createAsync(TestComponent)
           .then((fixture) => {
             fixture.detectChanges();

             const compiled = fixture.debugElement.nativeElement;

             expect(getState(compiled)).toEqual([true, true, true, false, false]);
           });
     }));

  it('handles correctly the click event', injectAsync([TestComponentBuilder], (tcb) => {
       const html = '<ngb-rating rate="3" max="5"></ngb-rating>';

       return tcb.overrideTemplate(TestComponent, html)
           .createAsync(TestComponent)
           .then((fixture) => {
             fixture.detectChanges();

             const compiled = fixture.debugElement.nativeElement;

             getStar(compiled, 2).click();
             fixture.detectChanges();
             expect(getState(compiled)).toEqual([true, true, false, false, false]);
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
               let hiddenStars = getStars(compiled, '.sr-only');
               expect(hiddenStars.length).toBe(5);
             });
       }));

    it('initializes populates the current rate for screenreaders', injectAsync([TestComponentBuilder], (tcb) => {
         const html = '<ngb-rating rate="3" max="5"></ngb-rating>';

         return tcb.overrideTemplate(TestComponent, html)
             .createAsync(TestComponent)
             .then((fixture) => {
               fixture.detectChanges();

               const compiled = fixture.debugElement.nativeElement;

               expect(getAriaState(compiled)).toEqual([true, true, true, false, false]);
             });
       }));

    it('contains aria-valuenow with the current rate', injectAsync([TestComponentBuilder], (tcb) => {
         const html = '<ngb-rating [max]="max" rate="3"></ngb-rating>';

         return tcb.overrideTemplate(TestComponent, html)
             .createAsync(TestComponent)
             .then((fixture) => {
               fixture.detectChanges();

               const compiled = fixture.debugElement.nativeElement;

               expect(compiled.querySelector('span').getAttribute('aria-valuenow')).toBe('3');
             });
       }));

    it('updates aria-valuenow when the rate changes', injectAsync([TestComponentBuilder], (tcb) => {
         const html = '<ngb-rating [max]="max" rate="3"></ngb-rating>';

         return tcb.overrideTemplate(TestComponent, html)
             .createAsync(TestComponent)
             .then((fixture) => {
               fixture.detectChanges();

               const compiled = fixture.debugElement.nativeElement;

               getStar(compiled, 7).click();
               fixture.detectChanges();

               expect(compiled.querySelector('span').getAttribute('aria-valuenow')).toBe('7');
             });
       }));
  });
});

@Component({selector: 'test-cmp', directives: [NgbRating], template: ''})
class TestComponent {
  max: number = 10;
}
