import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {Component, ViewChild} from '@angular/core';
import {NgbFocusTrapFactory, NgbFocusTrapDirective, NgbFocusTrap} from './focus-trap';
import {NgbInteractivityChecker} from './interactivity-checker';
import {NgbPlatform} from './platform';


describe('ngb-focus-trap', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NgbFocusTrapDirective, FocusTrapWithBindings, SimpleFocusTrap, FocusTrapTargets, FocusTrapWithSvg],
      providers: [NgbInteractivityChecker, NgbPlatform, NgbFocusTrapFactory]
    });

    TestBed.compileComponents();
  }));

  describe('with default element', () => {
    let fixture: ComponentFixture<SimpleFocusTrap>;
    let focusTrapInstance: NgbFocusTrap;

    beforeEach(() => {
      fixture = TestBed.createComponent(SimpleFocusTrap);
      fixture.detectChanges();
      focusTrapInstance = fixture.componentInstance.focusTrapDirective.focusTrap;
    });

    it('wrap focus from end to start', () => {
      // Because we can't mimic a real tab press focus change in a unit test, just call the
      // focus event handler directly.
      focusTrapInstance.focusFirstTabbableElement();

      expect(document.activeElement.nodeName.toLowerCase()).toBe('input', 'Expected input element to be focused');
    });

    it('should wrap focus from start to end', () => {
      // Because we can't mimic a real tab press focus change in a unit test, just call the
      // focus event handler directly.
      focusTrapInstance.focusLastTabbableElement();

      // In iOS button elements are never tabbable, so the last element will be the input.
      let lastElement = new NgbPlatform().IOS ? 'input' : 'button';

      expect(document.activeElement.nodeName.toLowerCase())
          .toBe(lastElement, `Expected ${lastElement} element to be focused`);
    });

    it('should be enabled by default', () => { expect(focusTrapInstance.enabled).toBe(true); });

  });

  describe('with bindings', () => {
    let fixture: ComponentFixture<FocusTrapWithBindings>;
    let focusTrapInstance: NgbFocusTrap;

    beforeEach(() => {
      fixture = TestBed.createComponent(FocusTrapWithBindings);
      fixture.detectChanges();
      focusTrapInstance = fixture.componentInstance.focusTrapDirective.focusTrap;
    });

    it('should clean up its anchor sibling elements on destroy', () => {
      const rootElement = fixture.debugElement.nativeElement as HTMLElement;

      expect(rootElement.querySelectorAll('div.sr-only').length).toBe(2);

      fixture.componentInstance.renderFocusTrap = false;
      fixture.detectChanges();

      expect(rootElement.querySelectorAll('div.sr-only').length).toBe(0);
    });

    it('should set the appropriate tabindex on the anchors, based on the disabled state', () => {
      const anchors = Array.from(fixture.debugElement.nativeElement.querySelectorAll('div.sr-only')) as HTMLElement[];

      expect(anchors.every(current => current.getAttribute('tabindex') === '0')).toBe(true);

      fixture.componentInstance.isFocusTrapEnabled = false;
      fixture.detectChanges();

      expect(anchors.every(current => current.getAttribute('tabindex') === '-1')).toBe(true);
    });
  });

  describe('with focus targets', () => {
    let fixture: ComponentFixture<FocusTrapTargets>;
    let focusTrapInstance: NgbFocusTrap;

    beforeEach(() => {
      fixture = TestBed.createComponent(FocusTrapTargets);
      fixture.detectChanges();
      focusTrapInstance = fixture.componentInstance.focusTrapDirective.focusTrap;
    });

    it('should be able to set initial focus target', () => {
      // Because we can't mimic a real tab press focus change in a unit test, just call the
      // focus event handler directly.
      focusTrapInstance.focusInitialElement();
      expect(document.activeElement.id).toBe('middle');
    });

    it('should be able to prioritize the first focus target', () => {
      // Because we can't mimic a real tab press focus change in a unit test, just call the
      // focus event handler directly.
      focusTrapInstance.focusFirstTabbableElement();
      expect(document.activeElement.id).toBe('first');
    });

    it('should be able to prioritize the last focus target', () => {
      // Because we can't mimic a real tab press focus change in a unit test, just call the
      // focus event handler directly.
      focusTrapInstance.focusLastTabbableElement();
      expect(document.activeElement.id).toBe('last');
    });
  });

  describe('special cases', () => {
    it('should not throw when it has a SVG child', () => {
      let fixture = TestBed.createComponent(FocusTrapWithSvg);

      fixture.detectChanges();

      let focusTrapInstance = fixture.componentInstance.focusTrapDirective.focusTrap;

      expect(() => focusTrapInstance.focusFirstTabbableElement()).not.toThrow();
      expect(() => focusTrapInstance.focusLastTabbableElement()).not.toThrow();
    });
  });

});


@Component({
  template: `
    <div ngbTrapFocus>
      <input>
      <button>SAVE</button>
    </div>
    `
})
class SimpleFocusTrap {
  @ViewChild(NgbFocusTrapDirective) focusTrapDirective: NgbFocusTrapDirective;
}


@Component({
  template: `
    <div *ngIf="renderFocusTrap" [ngbTrapFocus]="isFocusTrapEnabled">
      <input>
      <button>SAVE</button>
    </div>
    `
})
class FocusTrapWithBindings {
  @ViewChild(NgbFocusTrapDirective) focusTrapDirective: NgbFocusTrapDirective;
  renderFocusTrap = true;
  isFocusTrapEnabled = true;
}


@Component({
  template: `
    <div ngbTrapFocus>
      <input>
      <button>before</button>
      <button id="first" ngb-focus-region-start></button>
      <button id="middle" ngb-focus-initial></button>
      <button id="last" ngb-focus-region-end></button>
      <button>after</button>
      <input>
    </div>
    `
})
class FocusTrapTargets {
  @ViewChild(NgbFocusTrapDirective) focusTrapDirective: NgbFocusTrapDirective;
}


@Component({
  template: `
    <div ngbTrapFocus>
      <svg xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="100"/>
      </svg>
    </div>
    `
})
class FocusTrapWithSvg {
  @ViewChild(NgbFocusTrapDirective) focusTrapDirective: NgbFocusTrapDirective;
}
