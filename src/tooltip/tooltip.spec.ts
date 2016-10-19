import {TestBed, ComponentFixture, inject} from '@angular/core/testing';
import {createGenericTestComponent} from '../test/common';

import {By} from '@angular/platform-browser';
import {Component, ViewChild, ChangeDetectionStrategy} from '@angular/core';

import {NgbTooltipModule} from './tooltip.module';
import {NgbTooltipWindow, NgbTooltip} from './tooltip';
import {NgbTooltipConfig} from './tooltip-config';

const createTestComponent =
    (html: string) => <ComponentFixture<TestComponent>>createGenericTestComponent(html, TestComponent);

const createOnPushTestComponent =
    (html: string) => <ComponentFixture<TestOnPushComponent>>createGenericTestComponent(html, TestOnPushComponent);

describe('ngb-tooltip-window', () => {
  beforeEach(() => { TestBed.configureTestingModule({imports: [NgbTooltipModule.forRoot()]}); });

  it('should render tooltip on top by default', () => {
    const fixture = TestBed.createComponent(NgbTooltipWindow);
    fixture.detectChanges();

    expect(fixture.nativeElement).toHaveCssClass('tooltip');
    expect(fixture.nativeElement).toHaveCssClass('tooltip-top');
    expect(fixture.nativeElement.getAttribute('role')).toBe('tooltip');
  });

  it('should position tooltips as requested', () => {
    const fixture = TestBed.createComponent(NgbTooltipWindow);
    fixture.componentInstance.placement = 'left';
    fixture.detectChanges();
    expect(fixture.nativeElement).toHaveCssClass('tooltip-left');
  });
});

describe('ngb-tooltip', () => {

  beforeEach(() => {
    TestBed.configureTestingModule(
        {declarations: [TestComponent, TestOnPushComponent], imports: [NgbTooltipModule.forRoot()]});
  });

  function getWindow(element) { return element.querySelector('ngb-tooltip-window'); }

  describe('basic functionality', () => {

    it('should open and close a tooltip - default settings and content as string', () => {
      const fixture = createTestComponent(`<div ngbTooltip="Great tip!"></div>`);
      const directive = fixture.debugElement.query(By.directive(NgbTooltip));
      const defaultConfig = new NgbTooltipConfig();

      directive.triggerEventHandler('mouseenter', {});
      fixture.detectChanges();
      const windowEl = getWindow(fixture.nativeElement);

      expect(windowEl).toHaveCssClass('tooltip');
      expect(windowEl).toHaveCssClass(`tooltip-${defaultConfig.placement}`);
      expect(windowEl.textContent.trim()).toBe('Great tip!');
      expect(windowEl.getAttribute('role')).toBe('tooltip');
      expect(windowEl.parentNode).toBe(fixture.nativeElement);

      directive.triggerEventHandler('mouseleave', {});
      fixture.detectChanges();
      expect(getWindow(fixture.nativeElement)).toBeNull();
    });

    it('should open and close a tooltip - default settings and content from a template', () => {
      const fixture = createTestComponent(`<template #t>Hello, {{name}}!</template><div [ngbTooltip]="t"></div>`);
      const directive = fixture.debugElement.query(By.directive(NgbTooltip));

      directive.triggerEventHandler('mouseenter', {});
      fixture.detectChanges();
      const windowEl = getWindow(fixture.nativeElement);

      expect(windowEl).toHaveCssClass('tooltip');
      expect(windowEl).toHaveCssClass('tooltip-top');
      expect(windowEl.textContent.trim()).toBe('Hello, World!');
      expect(windowEl.getAttribute('role')).toBe('tooltip');
      expect(windowEl.parentNode).toBe(fixture.nativeElement);

      directive.triggerEventHandler('mouseleave', {});
      fixture.detectChanges();
      expect(getWindow(fixture.nativeElement)).toBeNull();
    });

    it('should not open a tooltip if content is falsy', () => {
      const fixture = createTestComponent(`<div [ngbTooltip]="notExisting"></div>`);
      const directive = fixture.debugElement.query(By.directive(NgbTooltip));

      directive.triggerEventHandler('mouseenter', {});
      fixture.detectChanges();
      const windowEl = getWindow(fixture.nativeElement);

      expect(windowEl).toBeNull();
    });

    it('should close the tooltip tooltip if content becomes falsy', () => {
      const fixture = createTestComponent(`<div [ngbTooltip]="name"></div>`);
      const directive = fixture.debugElement.query(By.directive(NgbTooltip));

      directive.triggerEventHandler('mouseenter', {});
      fixture.detectChanges();
      expect(getWindow(fixture.nativeElement)).not.toBeNull();

      fixture.componentInstance.name = null;
      fixture.detectChanges();
      expect(getWindow(fixture.nativeElement)).toBeNull();
    });

    it('should allow re-opening previously closed tooltips', () => {
      const fixture = createTestComponent(`<div ngbTooltip="Great tip!"></div>`);
      const directive = fixture.debugElement.query(By.directive(NgbTooltip));

      directive.triggerEventHandler('mouseenter', {});
      fixture.detectChanges();
      expect(getWindow(fixture.nativeElement)).not.toBeNull();

      directive.triggerEventHandler('mouseleave', {});
      fixture.detectChanges();
      expect(getWindow(fixture.nativeElement)).toBeNull();

      directive.triggerEventHandler('mouseenter', {});
      fixture.detectChanges();
      expect(getWindow(fixture.nativeElement)).not.toBeNull();
    });

    it('should not leave dangling tooltips in the DOM', () => {
      const fixture = createTestComponent(`<template [ngIf]="show"><div ngbTooltip="Great tip!"></div></template>`);
      const directive = fixture.debugElement.query(By.directive(NgbTooltip));

      directive.triggerEventHandler('mouseenter', {});
      fixture.detectChanges();
      expect(getWindow(fixture.nativeElement)).not.toBeNull();

      fixture.componentInstance.show = false;
      fixture.detectChanges();
      expect(getWindow(fixture.nativeElement)).toBeNull();
    });

    it('should properly cleanup tooltips with manual triggers', () => {
      const fixture = createTestComponent(`
            <template [ngIf]="show">
              <div ngbTooltip="Great tip!" triggers="manual" #t="ngbTooltip" (mouseenter)="t.open()"></div>
            </template>`);
      const directive = fixture.debugElement.query(By.directive(NgbTooltip));

      directive.triggerEventHandler('mouseenter', {});
      fixture.detectChanges();
      expect(getWindow(fixture.nativeElement)).not.toBeNull();

      fixture.componentInstance.show = false;
      fixture.detectChanges();
      expect(getWindow(fixture.nativeElement)).toBeNull();
    });

    describe('positioning', () => {

      it('should use requested position', () => {
        const fixture = createTestComponent(`<div ngbTooltip="Great tip!" placement="left"></div>`);
        const directive = fixture.debugElement.query(By.directive(NgbTooltip));

        directive.triggerEventHandler('mouseenter', {});
        fixture.detectChanges();
        const windowEl = getWindow(fixture.nativeElement);

        expect(windowEl).toHaveCssClass('tooltip');
        expect(windowEl).toHaveCssClass('tooltip-left');
        expect(windowEl.textContent.trim()).toBe('Great tip!');
      });

      it('should properly position tooltips when a component is using the OnPush strategy', () => {
        const fixture = createOnPushTestComponent(`<div ngbTooltip="Great tip!" placement="left"></div>`);
        const directive = fixture.debugElement.query(By.directive(NgbTooltip));

        directive.triggerEventHandler('mouseenter', {});
        fixture.detectChanges();
        const windowEl = getWindow(fixture.nativeElement);

        expect(windowEl).toHaveCssClass('tooltip');
        expect(windowEl).toHaveCssClass('tooltip-left');
        expect(windowEl.textContent.trim()).toBe('Great tip!');
      });
    });

    describe('triggers', () => {

      it('should support toggle triggers', () => {
        const fixture = createTestComponent(`<div ngbTooltip="Great tip!" triggers="click"></div>`);
        const directive = fixture.debugElement.query(By.directive(NgbTooltip));

        directive.triggerEventHandler('click', {});
        fixture.detectChanges();
        expect(getWindow(fixture.nativeElement)).not.toBeNull();

        directive.triggerEventHandler('click', {});
        fixture.detectChanges();
        expect(getWindow(fixture.nativeElement)).toBeNull();
      });

      it('should non-default toggle triggers', () => {
        const fixture = createTestComponent(`<div ngbTooltip="Great tip!" triggers="mouseenter:click"></div>`);
        const directive = fixture.debugElement.query(By.directive(NgbTooltip));

        directive.triggerEventHandler('mouseenter', {});
        fixture.detectChanges();
        expect(getWindow(fixture.nativeElement)).not.toBeNull();

        directive.triggerEventHandler('click', {});
        fixture.detectChanges();
        expect(getWindow(fixture.nativeElement)).toBeNull();
      });

      it('should support multiple triggers', () => {
        const fixture =
            createTestComponent(`<div ngbTooltip="Great tip!" triggers="mouseenter:mouseleave click"></div>`);
        const directive = fixture.debugElement.query(By.directive(NgbTooltip));

        directive.triggerEventHandler('mouseenter', {});
        fixture.detectChanges();
        expect(getWindow(fixture.nativeElement)).not.toBeNull();

        directive.triggerEventHandler('click', {});
        fixture.detectChanges();
        expect(getWindow(fixture.nativeElement)).toBeNull();
      });

      it('should not use default for manual triggers', () => {
        const fixture = createTestComponent(`<div ngbTooltip="Great tip!" triggers="manual"></div>`);
        const directive = fixture.debugElement.query(By.directive(NgbTooltip));

        directive.triggerEventHandler('mouseenter', {});
        fixture.detectChanges();
        expect(getWindow(fixture.nativeElement)).toBeNull();
      });

      it('should allow toggling for manual triggers', () => {
        const fixture = createTestComponent(`
                <div ngbTooltip="Great tip!" triggers="manual" #t="ngbTooltip"></div>
                <button (click)="t.toggle()">T</button>`);
        const button = fixture.nativeElement.querySelector('button');

        button.click();
        fixture.detectChanges();
        expect(getWindow(fixture.nativeElement)).not.toBeNull();

        button.click();
        fixture.detectChanges();
        expect(getWindow(fixture.nativeElement)).toBeNull();
      });

      it('should allow open / close for manual triggers', () => {
        const fixture = createTestComponent(`
                <div ngbTooltip="Great tip!" triggers="manual" #t="ngbTooltip"></div>
                <button (click)="t.open()">O</button>
                <button (click)="t.close()">C</button>`);

        const buttons = fixture.nativeElement.querySelectorAll('button');

        buttons[0].click();  // open
        fixture.detectChanges();
        expect(getWindow(fixture.nativeElement)).not.toBeNull();

        buttons[1].click();  // close
        fixture.detectChanges();
        expect(getWindow(fixture.nativeElement)).toBeNull();
      });

      it('should not throw when open called for manual triggers and open tooltip', () => {
        const fixture = createTestComponent(`
                <div ngbTooltip="Great tip!" triggers="manual" #t="ngbTooltip"></div>
                <button (click)="t.open()">O</button>`);
        const button = fixture.nativeElement.querySelector('button');

        button.click();  // open
        fixture.detectChanges();
        expect(getWindow(fixture.nativeElement)).not.toBeNull();

        button.click();  // open
        fixture.detectChanges();
        expect(getWindow(fixture.nativeElement)).not.toBeNull();
      });

      it('should not throw when closed called for manual triggers and closed tooltip', () => {
        const fixture = createTestComponent(`
                <div ngbTooltip="Great tip!" triggers="manual" #t="ngbTooltip"></div>
                <button (click)="t.close()">C</button>`);

        const button = fixture.nativeElement.querySelector('button');

        button.click();  // close
        fixture.detectChanges();
        expect(getWindow(fixture.nativeElement)).toBeNull();
      });
    });
  });

  describe('container', () => {

    it('should be appended to the element matching the selector passed to "container"', () => {
      const selector = 'body';
      const fixture = createTestComponent(`<div ngbTooltip="Great tip!" container="` + selector + `"></div>`);
      const directive = fixture.debugElement.query(By.directive(NgbTooltip));

      directive.triggerEventHandler('mouseenter', {});
      fixture.detectChanges();
      expect(getWindow(fixture.nativeElement)).toBeNull();
      expect(getWindow(document.querySelector(selector))).not.toBeNull();
    });

    it('should properly destroy tooltips when the "container" option is used', () => {
      const selector = 'body';
      const fixture =
          createTestComponent(`<div *ngIf="show" ngbTooltip="Great tip!" container="` + selector + `"></div>`);
      const directive = fixture.debugElement.query(By.directive(NgbTooltip));

      directive.triggerEventHandler('mouseenter', {});
      fixture.detectChanges();

      expect(getWindow(document.querySelector(selector))).not.toBeNull();
      fixture.componentRef.instance.show = false;
      fixture.detectChanges();
      expect(getWindow(document.querySelector(selector))).toBeNull();
    });
  });

  describe('visibility', () => {
    it('should emit events when showing and hiding popover', () => {
      const fixture = createTestComponent(
          `<div ngbTooltip="Great tip!" triggers="click" (shown)="shown()" (hidden)="hidden()"></div>`);
      const directive = fixture.debugElement.query(By.directive(NgbTooltip));

      let shownSpy = spyOn(fixture.componentInstance, 'shown');
      let hiddenSpy = spyOn(fixture.componentInstance, 'hidden');

      directive.triggerEventHandler('click', {});
      fixture.detectChanges();
      expect(getWindow(fixture.nativeElement)).not.toBeNull();
      expect(shownSpy).toHaveBeenCalled();

      directive.triggerEventHandler('click', {});
      fixture.detectChanges();
      expect(getWindow(fixture.nativeElement)).toBeNull();
      expect(hiddenSpy).toHaveBeenCalled();
    });

    it('should not emit close event when already closed', () => {
      const fixture = createTestComponent(
          `<div ngbTooltip="Great tip!" triggers="manual" (shown)="shown()" (hidden)="hidden()"></div>`);

      let shownSpy = spyOn(fixture.componentInstance, 'shown');
      let hiddenSpy = spyOn(fixture.componentInstance, 'hidden');

      fixture.componentInstance.tooltip.open();
      fixture.detectChanges();

      fixture.componentInstance.tooltip.open();
      fixture.detectChanges();

      expect(getWindow(fixture.nativeElement)).not.toBeNull();
      expect(shownSpy).toHaveBeenCalled();
      expect(shownSpy.calls.count()).toEqual(1);
      expect(hiddenSpy).not.toHaveBeenCalled();
    });

    it('should not emit open event when already opened', () => {
      const fixture = createTestComponent(
          `<div ngbTooltip="Great tip!" triggers="manual" (shown)="shown()" (hidden)="hidden()"></div>`);

      let shownSpy = spyOn(fixture.componentInstance, 'shown');
      let hiddenSpy = spyOn(fixture.componentInstance, 'hidden');

      fixture.componentInstance.tooltip.close();
      fixture.detectChanges();
      expect(getWindow(fixture.nativeElement)).toBeNull();
      expect(shownSpy).not.toHaveBeenCalled();
      expect(hiddenSpy).not.toHaveBeenCalled();
    });

    it('should report correct visibility', () => {
      const fixture = createTestComponent(`<div ngbTooltip="Great tip!" triggers="manual"></div>`);
      fixture.detectChanges();

      expect(fixture.componentInstance.tooltip.isOpen()).toBeFalsy();

      fixture.componentInstance.tooltip.open();
      fixture.detectChanges();
      expect(fixture.componentInstance.tooltip.isOpen()).toBeTruthy();

      fixture.componentInstance.tooltip.close();
      fixture.detectChanges();
      expect(fixture.componentInstance.tooltip.isOpen()).toBeFalsy();
    });
  });

  describe('Custom config', () => {
    let config: NgbTooltipConfig;

    beforeEach(() => {
      TestBed.configureTestingModule({imports: [NgbTooltipModule.forRoot()]});
      TestBed.overrideComponent(TestComponent, {set: {template: `<div ngbTooltip="Great tip!"></div>`}});
    });

    beforeEach(inject([NgbTooltipConfig], (c: NgbTooltipConfig) => {
      config = c;
      config.placement = 'bottom';
      config.triggers = 'click';
      config.container = 'body';
    }));

    it('should initialize inputs with provided config', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      const tooltip = fixture.componentInstance.tooltip;

      expect(tooltip.placement).toBe(config.placement);
      expect(tooltip.triggers).toBe(config.triggers);
      expect(tooltip.container).toBe(config.container);
    });
  });

  describe('Custom config as provider', () => {
    let config = new NgbTooltipConfig();
    config.placement = 'bottom';
    config.triggers = 'click';
    config.container = 'body';

    beforeEach(() => {
      TestBed.configureTestingModule(
          {imports: [NgbTooltipModule.forRoot()], providers: [{provide: NgbTooltipConfig, useValue: config}]});
    });

    it('should initialize inputs with provided config as provider', () => {
      const fixture = createTestComponent(`<div ngbTooltip="Great tip!"></div>`);
      const tooltip = fixture.componentInstance.tooltip;

      expect(tooltip.placement).toBe(config.placement);
      expect(tooltip.triggers).toBe(config.triggers);
      expect(tooltip.container).toBe(config.container);
    });
  });
});

@Component({selector: 'test-cmpt', template: ``})
export class TestComponent {
  name = 'World';
  show = true;

  @ViewChild(NgbTooltip) tooltip: NgbTooltip;

  shown() {}
  hidden() {}
}

@Component({selector: 'test-onpush-cmpt', changeDetection: ChangeDetectionStrategy.OnPush, template: ``})
export class TestOnPushComponent {
}
