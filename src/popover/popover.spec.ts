import {TestBed, ComponentFixture, inject} from '@angular/core/testing';
import {createGenericTestComponent} from '../test/common';

import {By} from '@angular/platform-browser';
import {Component, ViewChild, ChangeDetectionStrategy, Injectable, OnDestroy} from '@angular/core';

import {NgbPopoverModule} from './popover.module';
import {NgbPopoverWindow, NgbPopover} from './popover';
import {NgbPopoverConfig} from './popover-config';

@Injectable()
class SpyService {
  called = false;
}

const createTestComponent = (html: string) =>
    createGenericTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;

const createOnPushTestComponent =
    (html: string) => <ComponentFixture<TestOnPushComponent>>createGenericTestComponent(html, TestOnPushComponent);

describe('ngb-popover-window', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [TestComponent], imports: [NgbPopoverModule.forRoot()]});
  });

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, TestOnPushComponent, DestroyableCmpt],
      imports: [NgbPopoverModule.forRoot()],
      providers: [SpyService]
    });
  });

  function getWindow(fixture) { return fixture.nativeElement.querySelector('ngb-popover-window'); }

  describe('basic functionality', () => {

    it('should open and close a popover - default settings and content as string', () => {
      const fixture = createTestComponent(`<div ngbPopover="Great tip!" popoverTitle="Title"></div>`);
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
          <div [ngbPopover]="t" popoverTitle="Title"></div>`);
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

    it('should properly destroy TemplateRef content', () => {
      const fixture = createTestComponent(`
          <template #t><destroyable-cmpt></destroyable-cmpt></template>
          <div [ngbPopover]="t" popoverTitle="Title"></div>`);
      const directive = fixture.debugElement.query(By.directive(NgbPopover));
      const spyService = fixture.debugElement.injector.get(SpyService);

      directive.triggerEventHandler('click', {});
      fixture.detectChanges();
      expect(getWindow(fixture)).not.toBeNull();
      expect(spyService.called).toBeFalsy();

      directive.triggerEventHandler('click', {});
      fixture.detectChanges();
      expect(getWindow(fixture)).toBeNull();
      expect(spyService.called).toBeTruthy();
    });

    it('should allow re-opening previously closed popovers', () => {
      const fixture = createTestComponent(`<div ngbPopover="Great tip!" popoverTitle="Title"></div>`);
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
          createTestComponent(`<template [ngIf]="show"><div ngbPopover="Great tip!" popoverTitle="Title"></div></template>`);
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

    it('should properly position popovers when a component is using the OnPush strategy', () => {
      const fixture = createOnPushTestComponent(`<div ngbPopover="Great tip!" placement="left"></div>`);
      const directive = fixture.debugElement.query(By.directive(NgbPopover));

      directive.triggerEventHandler('click', {});
      fixture.detectChanges();
      const windowEl = getWindow(fixture);

      expect(windowEl).toHaveCssClass('popover');
      expect(windowEl).toHaveCssClass('popover-left');
      expect(windowEl.textContent.trim()).toBe('Great tip!');
    });
  });

  describe('visibility', () => {
    it('should emit events when showing and hiding popover', () => {
      const fixture = createTestComponent(`<div ngbPopover="Great tip!" triggers="click" (shown)="shown()" (hidden)="hidden()"></div>`);
      const directive = fixture.debugElement.query(By.directive(NgbPopover));

      let shownSpy = spyOn(fixture.componentInstance, 'shown');
      let hiddenSpy = spyOn(fixture.componentInstance, 'hidden');

      directive.triggerEventHandler('click', {});
      fixture.detectChanges();
      expect(getWindow(fixture)).not.toBeNull();
      expect(shownSpy).toHaveBeenCalled();

      directive.triggerEventHandler('click', {});
      fixture.detectChanges();
      expect(getWindow(fixture)).toBeNull();
      expect(hiddenSpy).toHaveBeenCalled();
    });

    it('should not emit close event when already closed', () => {
      const fixture = createTestComponent(`<div ngbPopover="Great tip!" triggers="manual" (shown)="shown()" (hidden)="hidden()"></div>`);

      let shownSpy = spyOn(fixture.componentInstance, 'shown');
      let hiddenSpy = spyOn(fixture.componentInstance, 'hidden');

      fixture.componentInstance.popover.open();
      fixture.detectChanges();

      fixture.componentInstance.popover.open();
      fixture.detectChanges();

      expect(getWindow(fixture)).not.toBeNull();
      expect(shownSpy).toHaveBeenCalled();
      expect(shownSpy.calls.count()).toEqual(1);
      expect(hiddenSpy).not.toHaveBeenCalled();
    });

    it('should not emit open event when already opened', () => {
      const fixture = createTestComponent(`<div ngbPopover="Great tip!" triggers="manual" (shown)="shown()" (hidden)="hidden()"></div>`);

      let shownSpy = spyOn(fixture.componentInstance, 'shown');
      let hiddenSpy = spyOn(fixture.componentInstance, 'hidden');

      fixture.componentInstance.popover.close();
      fixture.detectChanges();
      expect(getWindow(fixture)).toBeNull();
      expect(shownSpy).not.toHaveBeenCalled();
      expect(hiddenSpy).not.toHaveBeenCalled();
    });

    it('should report correct visibility', () => {
      const fixture = createTestComponent(`<div ngbPopover="Great tip!" triggers="manual"></div>`);
      fixture.detectChanges();

      expect(fixture.componentInstance.popover.isOpen()).toBeFalsy();

      fixture.componentInstance.popover.open();
      fixture.detectChanges();
      expect(fixture.componentInstance.popover.isOpen()).toBeTruthy();

      fixture.componentInstance.popover.close();
      fixture.detectChanges();
      expect(fixture.componentInstance.popover.isOpen()).toBeFalsy();
    });
  });

  describe('triggers', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({declarations: [TestComponent], imports: [NgbPopoverModule.forRoot()]});
    });

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
      TestBed.configureTestingModule({imports: [NgbPopoverModule.forRoot()]});
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
          {imports: [NgbPopoverModule.forRoot()], providers: [{provide: NgbPopoverConfig, useValue: config}]});
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

  shown() { }
  hidden() { }

}

@Component({selector: 'test-onpush-cmpt', changeDetection: ChangeDetectionStrategy.OnPush, template: ``})
export class TestOnPushComponent {
}

@Component({selector: 'destroyable-cmpt', template: 'Some content'})
export class DestroyableCmpt implements OnDestroy {
  constructor(private _spyService: SpyService) {}

  ngOnDestroy(): void { this._spyService.called = true; }
}
