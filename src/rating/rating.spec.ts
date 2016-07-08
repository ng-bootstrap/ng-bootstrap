import {inject, async, addProviders} from '@angular/core/testing';

import {TestComponentBuilder} from '@angular/compiler/testing';

import {Component} from '@angular/core';

import {NgbRating} from './rating';

function getAriaState(compiled) {
  const stars = getStars(compiled, '.sr-only');
  let state = [];
  for (let i = 0, l = stars.length; i < l; i++) {
    state.push((stars[i].textContent === '(*)' && stars[i].textContent !== '( )'));
  }
  return state;
}

function getStar(compiled, num: number) {
  return getStars(compiled)[num - 1];
}

function getStars(element, selector = 'span > span:not(.sr-only)') {
  return element.querySelectorAll(selector);
}

function getState(compiled) {
  const stars = getStars(compiled);
  let state = [];
  for (let i = 0, l = stars.length; i < l; i++) {
    state.push((stars[i].textContent === String.fromCharCode(9733)));
  }
  return state;
}

describe('ngb-rating', () => {
  it('should show 10 stars by default', async(inject([TestComponentBuilder], (tcb) => {
       tcb.createAsync(NgbRating).then((fixture) => {
         fixture.detectChanges();

         const compiled = fixture.nativeElement;

         const stars = getStars(compiled);
         expect(stars.length).toBe(10);
       });
     })));

  it('should change the num of stars with `max`', async(inject([TestComponentBuilder], (tcb) => {
       const html = '<ngb-rating max="3"></ngb-rating>';

       return tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();

         const compiled = fixture.nativeElement;

         const stars = getStars(compiled);
         expect(stars.length).toBe(3);
       });
     })));

  it('initializes the default star icons as selected', async(inject([TestComponentBuilder], (tcb) => {
       const html = '<ngb-rating rate="3" max="5"></ngb-rating>';

       return tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();

         const compiled = fixture.nativeElement;

         expect(getState(compiled)).toEqual([true, true, true, false, false]);
       });
     })));

  it('handles correctly the click event', async(inject([TestComponentBuilder], (tcb) => {
       const html = '<ngb-rating rate="3" max="5"></ngb-rating>';

       return tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();

         const compiled = fixture.nativeElement;

         getStar(compiled, 2).click();
         fixture.detectChanges();
         expect(getState(compiled)).toEqual([true, true, false, false, false]);
       });
     })));

  it('should set pointer cursor on stars when not readonly', async(inject([TestComponentBuilder], (tcb) => {
       tcb.createAsync(NgbRating).then((fixture) => {
         fixture.detectChanges();

         const compiled = fixture.nativeElement;

         expect(window.getComputedStyle(getStar(compiled, 1)).getPropertyValue('cursor')).toBe('pointer');
       });
     })));

  it('should set not allowed cursor on stars when readonly', async(inject([TestComponentBuilder], (tcb) => {
       const html = '<ngb-rating [readonly]="true"></ngb-rating>';
       return tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();

         const compiled = fixture.nativeElement;

         expect(window.getComputedStyle(getStar(compiled, 1)).getPropertyValue('cursor')).toBe('not-allowed');
       });
     })));

  describe('aria support', () => {
    it('contains aria-valuemax with the number of stars', async(inject([TestComponentBuilder], (tcb) => {
         const html = '<ngb-rating [max]="max"></ngb-rating>';

         return tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.detectChanges();

           const compiled = fixture.nativeElement;

           expect(compiled.querySelector('span').getAttribute('aria-valuemax')).toBe('10');
         });
       })));

    it('contains a hidden span for each star for screenreaders', async(inject([TestComponentBuilder], (tcb) => {
         const html = '<ngb-rating max="5"></ngb-rating>';

         return tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.detectChanges();

           let compiled = fixture.nativeElement;
           let hiddenStars = getStars(compiled, '.sr-only');
           expect(hiddenStars.length).toBe(5);
         });
       })));

    it('initializes populates the current rate for screenreaders', async(inject([TestComponentBuilder], (tcb) => {
         const html = '<ngb-rating rate="3" max="5"></ngb-rating>';

         return tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.detectChanges();

           const compiled = fixture.nativeElement;

           expect(getAriaState(compiled)).toEqual([true, true, true, false, false]);
         });
       })));

    it('contains aria-valuenow with the current rate', async(inject([TestComponentBuilder], (tcb) => {
         const html = '<ngb-rating [max]="max" rate="3"></ngb-rating>';

         return tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.detectChanges();

           const compiled = fixture.nativeElement;

           expect(compiled.querySelector('span').getAttribute('aria-valuenow')).toBe('3');
         });
       })));

    it('updates aria-valuenow when the rate changes', async(inject([TestComponentBuilder], (tcb) => {
         const html = '<ngb-rating [max]="max" rate="3"></ngb-rating>';

         return tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.detectChanges();

           const compiled = fixture.nativeElement;

           getStar(compiled, 7).click();
           fixture.detectChanges();

           expect(compiled.querySelector('span').getAttribute('aria-valuenow')).toBe('7');
         });
       })));
  });
});

@Component({selector: 'test-cmp', directives: [NgbRating], template: ''})
class TestComponent {
  max: number = 10;
}
