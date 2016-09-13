import {TestBed, ComponentFixture, inject} from '@angular/core/testing';
import {createGenericTestComponent} from '../test/common';

import {By} from '@angular/platform-browser';
import {Component, ViewChild} from '@angular/core';

import {NgbPopoverModule} from './popover.module';
import {NgbPopoverWindow, NgbPopover} from './popover';
import {NgbPopoverConfig} from './popover-config';

const createTestComponent = (html: string) =>
    createGenericTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;

describe('ngb-popover-window', () => {
  beforeEach(() => { TestBed.configureTestingModule({declarations: [TestComponent], imports: [NgbPopoverModule]}); });

  it('should render popover on top by default', () => {
    const fixture = TestBed.createComponent(NgbPopoverWindow);
    fixture.componentInstance.title = 'Test title';
    fixture.detectChanges();

    expect(fixture.nativeElement).toHaveCssClass('popover');
    expect(fixture.nativeElement).toHaveCssClass('popover-top');
    expect(fixture.nativeElement.getAttribute('role')).toBe('tooltip');
    expect(fixture.nativeElement.querySelector('.popover-title').textContent).toBe('Test title');
  });

  it('should position popovers as requested', () => {
    const fixture = TestBed.createComponent(NgbPopoverWindow);
    fixture.componentInstance.placement = 'left';
    fixture.detectChanges();
    expect(fixture.nativeElement).toHaveCssClass('popover-left');
  });
});

describe('ngb-popover', () => {

  beforeEach(() => { TestBed.configureTestingModule({declarations: [TestComponent], imports: [NgbPopoverModule]}); });

  function getWindow(fixture) { return fixture.nativeElement.querySelector('ngb-popover-window'); }

  describe('basic functionality', () => {

    it('should open and close a popover - default settings and content as string', () => {
      const fixture = createTestComponent(`<div ngbPopover="Great tip!" title="Title"></div>`);
      const directive = fixture.debugElement.query(By.directive(NgbPopover));

      directive.triggerEventHandler('click', {});
      fixture.detectChanges();
      const windowEl = getWindow(fixture);

      expect(windowEl).toHaveCssClass('popover');
      expect(windowEl).toHaveCssClass('popover-top');
      expect(windowEl.textContent.trim()).toBe('TitleGreat tip!');
      expect(windowEl.getAttribute('role')).toBe('tooltip');

      directive.triggerEventHandler('click', {});
      fixture.detectChanges();
      expect(getWindow(fixture)).toBeNull();
    });

    it('should open and close a popover - default settings and content from a template', () => {
      const fixture = createTestComponent(`
          <template #t>Hello, {{name}}!</template>
          <div [ngbPopover]="t" title="Title"></div>`);
      const directive = fixture.debugElement.query(By.directive(NgbPopover));
      const defaultConfig = new NgbPopoverConfig();

      directive.triggerEventHandler('click', {});
      fixture.detectChanges();
      const windowEl = getWindow(fixture);

      expect(windowEl).toHaveCssClass('popover');
      expect(windowEl).toHaveCssClass(`popover-${defaultConfig.placement}`);
      expect(windowEl.textContent.trim()).toBe('TitleHello, World!');
      expect(windowEl.getAttribute('role')).toBe('tooltip');

      directive.triggerEventHandler('click', {});
      fixture.detectChanges();
      expect(getWindow(fixture)).toBeNull();
    });

    it('should allow re-opening previously closed popovers', () => {
      const fixture = createTestComponent(`<div ngbPopover="Great tip!" title="Title"></div>`);
      const directive = fixture.debugElement.query(By.directive(NgbPopover));

      directive.triggerEventHandler('click', {});
      fixture.detectChanges();
      expect(getWindow(fixture)).not.toBeNull();

      directive.triggerEventHandler('click', {});
      fixture.detectChanges();
      expect(getWindow(fixture)).toBeNull();

      directive.triggerEventHandler('click', {});
      fixture.detectChanges();
      expect(getWindow(fixture)).not.toBeNull();
    });

    it('should not leave dangling popovers in the DOM', () => {
      const fixture =
          createTestComponent(`<template [ngIf]="show"><div ngbPopover="Great tip!" title="Title"></div></template>`);
      const directive = fixture.debugElement.query(By.directive(NgbPopover));

      directive.triggerEventHandler('click', {});
      fixture.detectChanges();
      expect(getWindow(fixture)).not.toBeNull();

      fixture.componentInstance.show = false;
      fixture.detectChanges();
      expect(getWindow(fixture)).toBeNull();
    });

    it('should properly cleanup popovers with manual triggers', () => {
      const fixture = createTestComponent(`<template [ngIf]="show">
                                            <div ngbPopover="Great tip!" triggers="manual" #p="ngbPopover" (mouseenter)="p.open()"></div>
                                        </template>`);
      const directive = fixture.debugElement.query(By.directive(NgbPopover));

      directive.triggerEventHandler('mouseenter', {});
      fixture.detectChanges();
      expect(getWindow(fixture)).not.toBeNull();

      fixture.componentInstance.show = false;
      fixture.detectChanges();
      expect(getWindow(fixture)).toBeNull();
    });
  });


  describe('positioning', () => {

    it('should use requested position', () => {
      const fixture = createTestComponent(`<div ngbPopover="Great tip!" placement="left"></div>`);
      const directive = fixture.debugElement.query(By.directive(NgbPopover));

      directive.triggerEventHandler('click', {});
      fixture.detectChanges();
      const windowEl = getWindow(fixture);

      expect(windowEl).toHaveCssClass('popover');
      expect(windowEl).toHaveCssClass('popover-left');
      expect(windowEl.textContent.trim()).toBe('Great tip!');
    });
  });

  describe('triggers', () => {
    beforeEach(() => { TestBed.configureTestingModule({declarations: [TestComponent], imports: [NgbPopoverModule]}); });

    it('should support toggle triggers', () => {
      const fixture = createTestComponent(`<div ngbPopover="Great tip!" triggers="click"></div>`);
      const directive = fixture.debugElement.query(By.directive(NgbPopover));

      directive.triggerEventHandler('click', {});
      fixture.detectChanges();
      expect(getWindow(fixture)).not.toBeNull();

      directive.triggerEventHandler('click', {});
      fixture.detectChanges();
      expect(getWindow(fixture)).toBeNull();
    });

    it('should non-default toggle triggers', () => {
      const fixture = createTestComponent(`<div ngbPopover="Great tip!" triggers="mouseenter:click"></div>`);
      const directive = fixture.debugElement.query(By.directive(NgbPopover));

      directive.triggerEventHandler('mouseenter', {});
      fixture.detectChanges();
      expect(getWindow(fixture)).not.toBeNull();

      directive.triggerEventHandler('click', {});
      fixture.detectChanges();
      expect(getWindow(fixture)).toBeNull();
    });

    it('should support multiple triggers', () => {
      const fixture = createTestComponent(`<div ngbPopover="Great tip!" triggers="mouseenter:mouseleave click"></div>`);
      const directive = fixture.debugElement.query(By.directive(NgbPopover));

      directive.triggerEventHandler('mouseenter', {});
      fixture.detectChanges();
      expect(getWindow(fixture)).not.toBeNull();

      directive.triggerEventHandler('click', {});
      fixture.detectChanges();
      expect(getWindow(fixture)).toBeNull();
    });

    it('should not use default for manual triggers', () => {
      const fixture = createTestComponent(`<div ngbPopover="Great tip!" triggers="manual"></div>`);
      const directive = fixture.debugElement.query(By.directive(NgbPopover));

      directive.triggerEventHandler('mouseenter', {});
      fixture.detectChanges();
      expect(getWindow(fixture)).toBeNull();
    });

    it('should allow toggling for manual triggers', () => {
      const fixture = createTestComponent(`
                <div ngbPopover="Great tip!" triggers="manual" #t="ngbPopover"></div>
                <button (click)="t.toggle()">T</button>`);
      const button = fixture.nativeElement.querySelector('button');

      button.click();
      fixture.detectChanges();
      expect(getWindow(fixture)).not.toBeNull();

      button.click();
      fixture.detectChanges();
      expect(getWindow(fixture)).toBeNull();
    });

    it('should allow open / close for manual triggers', () => {
      const fixture = createTestComponent(`<div ngbPopover="Great tip!" triggers="manual" #t="ngbPopover"></div>
                <button (click)="t.open()">O</button>
                <button (click)="t.close()">C</button>`);
      const buttons = fixture.nativeElement.querySelectorAll('button');

      buttons[0].click();  // open
      fixture.detectChanges();
      expect(getWindow(fixture)).not.toBeNull();

      buttons[1].click();  // close
      fixture.detectChanges();
      expect(getWindow(fixture)).toBeNull();
    });

    it('should not throw when open called for manual triggers and open popover', () => {
      const fixture = createTestComponent(`
                <div ngbPopover="Great tip!" triggers="manual" #t="ngbPopover"></div>
                <button (click)="t.open()">O</button>`);
      const button = fixture.nativeElement.querySelector('button');

      button.click();  // open
      fixture.detectChanges();
      expect(getWindow(fixture)).not.toBeNull();

      button.click();  // open
      fixture.detectChanges();
      expect(getWindow(fixture)).not.toBeNull();
    });

    it('should not throw when closed called for manual triggers and closed popover', () => {
      const fixture = createTestComponent(`
                <div ngbPopover="Great tip!" triggers="manual" #t="ngbPopover"></div>
                <button (click)="t.close()">C</button>`);
      const button = fixture.nativeElement.querySelector('button');

      button.click();  // close
      fixture.detectChanges();
      expect(getWindow(fixture)).toBeNull();
    });
  });

  describe('Custom config', () => {
    let config: NgbPopoverConfig;

    beforeEach(() => {
      TestBed.configureTestingModule({imports: [NgbPopoverModule]});
      TestBed.overrideComponent(TestComponent, {set: {template: `<div ngbPopover="Great tip!"></div>`}});
    });

    beforeEach(inject([NgbPopoverConfig], (c: NgbPopoverConfig) => {
      config = c;
      config.placement = 'bottom';
      config.triggers = 'hover';
    }));

    it('should initialize inputs with provided config', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();

      const popover = fixture.componentInstance.popover;

      expect(popover.placement).toBe(config.placement);
      expect(popover.triggers).toBe(config.triggers);
    });
  });

  describe('Custom config as provider', () => {
    let config = new NgbPopoverConfig();
    config.placement = 'bottom';
    config.triggers = 'hover';

    beforeEach(() => {
      TestBed.configureTestingModule(
          {imports: [NgbPopoverModule], providers: [{provide: NgbPopoverConfig, useValue: config}]});
    });

    it('should initialize inputs with provided config as provider', () => {
      const fixture = createTestComponent(`<div ngbPopover="Great tip!"></div>`);
      const popover = fixture.componentInstance.popover;

      expect(popover.placement).toBe(config.placement);
      expect(popover.triggers).toBe(config.triggers);
    });
  });
});

@Component({selector: 'test-cmpt', template: ``})
export class TestComponent {
  name = 'World';
  show = true;
  title: string;
  placement: string;

  @ViewChild(NgbPopover) popover: NgbPopover;
}
