import {ngbRunTransition} from './ngbTransition';
import createSpy = jasmine.createSpy;
import {Component, ElementRef, ViewChild} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {isBrowserVisible} from '../../test/common';

/**
 * This is sometimes necessary only for IE when it fails to recalculate styles synchronously
 * after the 'transitionend' event was fired. To remove when not supporting IE anymore.
 */
function getComputedStyleAsync(element: HTMLElement, style: keyof CSSStyleDeclaration) {
  return new Promise<string>(resolve => setTimeout(() => resolve(window.getComputedStyle(element)[style])));
}

function fadeFn({classList}: HTMLElement) {
  classList.remove('ngb-test-show');
}

if (isBrowserVisible('ngbRunTransition')) {
  describe('ngbRunTransition', () => {

    let component: ComponentFixture<TestComponent>;
    let element: HTMLElement;

    beforeEach(() => {
      TestBed.configureTestingModule({declarations: [TestComponent]});

      component = TestBed.createComponent(TestComponent);
      component.detectChanges();
      element = component.componentInstance.element.nativeElement;
      spyOn(component.componentInstance, 'onTransitionEnd');
    });

    it(`should run specified transition on an element`, (done) => {
      element.classList.add('ngb-test-fade');

      const nextSpy = createSpy();
      const errorSpy = createSpy();

      ngbRunTransition(element, fadeFn, {animation: true, runningTransition: 'continue'})
          .subscribe(nextSpy, errorSpy, async() => {
            expect(component.componentInstance.onTransitionEnd).toHaveBeenCalledTimes(1);
            expect(nextSpy).toHaveBeenCalledWith(undefined);
            expect(element.classList.contains('ngb-test-show')).toBe(false);
            expect(errorSpy).not.toHaveBeenCalled();
            expect(await getComputedStyleAsync(element, 'opacity')).toBe('0');
            done();
          });

      expect(window.getComputedStyle(element).opacity).toBe('1');
    });

    it(`should emit 'undefined' and complete synchronously with 'animation: false'`, () => {
      element.classList.add('ngb-test-fade');
      expect(window.getComputedStyle(element).opacity).toBe('1');

      const nextSpy = createSpy();
      const errorSpy = createSpy();
      const completeSpy = createSpy();

      ngbRunTransition(element, fadeFn, {animation: false, runningTransition: 'continue'})
          .subscribe(nextSpy, errorSpy, completeSpy);

      expect(element.classList.contains('ngb-test-show')).toBe(true);
      expect(window.getComputedStyle(element).opacity).toBe('1');
      expect(component.componentInstance.onTransitionEnd).not.toHaveBeenCalled();
      expect(nextSpy).toHaveBeenCalledWith(undefined);
      expect(errorSpy).not.toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });

    it(`should emit 'undefined' and complete synchronously if transition is 'none'`, () => {
      element.classList.add('ngb-test-none');
      expect(window.getComputedStyle(element).opacity).toBe('1');

      const nextSpy = createSpy();
      const errorSpy = createSpy();
      const completeSpy = createSpy();

      ngbRunTransition(element, fadeFn, {animation: true, runningTransition: 'continue'})
          .subscribe(nextSpy, errorSpy, completeSpy);

      expect(element.classList.contains('ngb-test-show')).toBe(false);
      expect(window.getComputedStyle(element).opacity).toBe('1');
      expect(component.componentInstance.onTransitionEnd).not.toHaveBeenCalled();
      expect(nextSpy).toHaveBeenCalledWith(undefined);
      expect(errorSpy).not.toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });

    it(`should complete new transition if one is already running with 'runningTransition: continue'`, (done) => {
      element.classList.add('ngb-test-fade');

      // first
      const nextSpy1 = createSpy();
      const errorSpy1 = createSpy();

      ngbRunTransition(element, fadeFn, {animation: true, runningTransition: 'continue'})
          .subscribe(nextSpy1, errorSpy1, async() => {
            expect(component.componentInstance.onTransitionEnd).toHaveBeenCalledTimes(1);
            expect(nextSpy1).toHaveBeenCalledWith(undefined);
            expect(element.classList.contains('ngb-test-show')).toBe(false);
            expect(errorSpy1).not.toHaveBeenCalled();
            expect(await getComputedStyleAsync(element, 'opacity')).toBe('0');
            done();
          });

      expect(window.getComputedStyle(element).opacity).toBe('1');

      // second
      const nextSpy2 = createSpy();
      const errorSpy2 = createSpy();
      const completeSpy2 = createSpy();

      ngbRunTransition(element, fadeFn, {animation: true, runningTransition: 'continue'})
          .subscribe(nextSpy2, errorSpy2, completeSpy2);

      // first transition is on-going
      expect(nextSpy1).not.toHaveBeenCalled();
      expect(window.getComputedStyle(element).opacity).toBe('1');

      // second transition was completed and no value was emitted
      expect(nextSpy2).not.toHaveBeenCalled();
      expect(errorSpy2).not.toHaveBeenCalled();
      expect(completeSpy2).toHaveBeenCalled();
    });

    it(`should complete and release the DOM element even if transition end is not fired`, (done) => {
      element.classList.add('ngb-test-fade');

      const nextSpy = createSpy();
      const errorSpy = createSpy();

      ngbRunTransition(element, fadeFn, {animation: true, runningTransition: 'continue'})
          .subscribe(nextSpy, errorSpy, async() => {
            expect(component.componentInstance.onTransitionEnd).not.toHaveBeenCalled();  // <-- finished with timer
            expect(nextSpy).toHaveBeenCalledWith(undefined);
            expect(errorSpy).not.toHaveBeenCalled();
            expect(element.classList.contains('ngb-test-show')).toBe(false);
            const opacity = await getComputedStyleAsync(element, 'opacity');
            expect(['1', '']).toContain(opacity !);  // <-- detached from DOM, different values in different browsers
            done();
          });

      // detaching transitioning element from DOM
      expect(window.getComputedStyle(element).opacity).toBe('1');
      element.parentElement !.removeChild(element);
    });

    it(`should read duration after the start function was executed`, (done) => {
      const startFn = ({classList}: HTMLElement) => classList.add('ngb-test-long-duration');

      const nextSpy = createSpy();
      const errorSpy = createSpy();

      ngbRunTransition(element, startFn, {animation: true, runningTransition: 'continue'})
          .subscribe(nextSpy, errorSpy, async() => {
            // if duration is read before the 'startFn' is executed, it will be read as 0
            expect(component.componentInstance.onTransitionEnd).toHaveBeenCalledTimes(1);
            expect(nextSpy).toHaveBeenCalledWith(undefined);
            expect(element.classList.contains('ngb-test-long-duration')).toBe(true);
            expect(await getComputedStyleAsync(element, 'opacity')).toBe('0');
            expect(errorSpy).not.toHaveBeenCalled();
            done();
          });

      expect(window.getComputedStyle(element).opacity).toBe('1');
      expect(element.classList.contains('ngb-test-long-duration')).toBe(true);
    });
  });
}

@Component({
  template: `
      <div #element class="ngb-test-transition ngb-test-show" (transitionend)="onTransitionEnd()"></div>`
})
class TestComponent {
  @ViewChild('element') element: ElementRef;

  onTransitionEnd = () => {};
}
