import {inject, async, TestBed, TestComponentBuilder, ComponentFixture} from '@angular/core/testing';

import {By} from '@angular/platform-browser';
import {Component} from '@angular/core';

import {NgbPopoverModule} from './index';
import {NgbPopoverWindow, NgbPopover} from './popover';

describe('ngb-popover-window', () => {
  it('should render popover on top by default', async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
       tcb.createAsync(NgbPopoverWindow).then((fixture) => {
         fixture.componentInstance.title = 'Test title';
         fixture.detectChanges();

         expect(fixture.nativeElement).toHaveCssClass('popover');
         expect(fixture.nativeElement).toHaveCssClass('popover-top');
         expect(fixture.nativeElement.getAttribute('role')).toBe('tooltip');
         expect(fixture.nativeElement.querySelector('.popover-title').textContent).toBe('Test title');
       });
     })));

  it('should position popovers as requested', async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
       tcb.createAsync(NgbPopoverWindow).then((fixture) => {
         fixture.componentInstance.placement = 'left';
         fixture.detectChanges();
         expect(fixture.nativeElement).toHaveCssClass('popover-left');
       });
     })));
});

describe('ngb-popover', () => {

  beforeEach(() => { TestBed.configureTestingModule({imports: [NgbPopoverModule]}); });

  function getWindow(fixture) { return fixture.nativeElement.querySelector('ngb-popover-window'); }

  describe('basic functionality', () => {

    it('should open and close a popover - default settings and content as string',
       async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
         tcb.overrideTemplate(TestCmpt, `<div ngbPopover="Great tip!" title="Title"></div>`)
             .createAsync(TestCmpt)
             .then((fixture: ComponentFixture<TestCmpt>) => {
               fixture.detectChanges();
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
       })));

    it('should open and close a popover - default settings and content from a template',
       async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
         tcb.overrideTemplate(TestCmpt, `<template #t>Hello, {{name}}!</template><div [ngbPopover]="t" title="Title"></div>`)
             .createAsync(TestCmpt)
             .then((fixture: ComponentFixture<TestCmpt>) => {
               fixture.detectChanges();
               const directive = fixture.debugElement.query(By.directive(NgbPopover));

               directive.triggerEventHandler('click', {});
               fixture.detectChanges();
               const windowEl = getWindow(fixture);

               expect(windowEl).toHaveCssClass('popover');
               expect(windowEl).toHaveCssClass('popover-top');
               expect(windowEl.textContent.trim()).toBe('TitleHello, World!');
               expect(windowEl.getAttribute('role')).toBe('tooltip');

               directive.triggerEventHandler('click', {});
               fixture.detectChanges();
               expect(getWindow(fixture)).toBeNull();
             });
       })));

    it('should allow re-opening previously closed popovers',
       async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
         tcb.overrideTemplate(TestCmpt, `<div ngbPopover="Great tip!" title="Title"></div>`)
             .createAsync(TestCmpt)
             .then((fixture: ComponentFixture<TestCmpt>) => {
               fixture.detectChanges();
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
       })));

    it('should not leave dangling popovers in the DOM',
       async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
         tcb.overrideTemplate(
                TestCmpt, `<template [ngIf]="show"><div ngbPopover="Great tip!" title="Title"></div></template>`)
             .createAsync(TestCmpt)
             .then((fixture: ComponentFixture<TestCmpt>) => {
               fixture.detectChanges();
               const directive = fixture.debugElement.query(By.directive(NgbPopover));

               directive.triggerEventHandler('click', {});
               fixture.detectChanges();
               expect(getWindow(fixture)).not.toBeNull();

               fixture.componentInstance.show = false;
               fixture.detectChanges();
               expect(getWindow(fixture)).toBeNull();

             });
       })));

    it('should properly cleanup popovers with manual triggers',
       async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
         tcb.overrideTemplate(TestCmpt, `<template [ngIf]="show">
                                            <div ngbPopover="Great tip!" triggers="manual" #p="ngbPopover" (mouseenter)="p.open()"></div>
                                        </template>`)
             .createAsync(TestCmpt)
             .then((fixture: ComponentFixture<TestCmpt>) => {
               fixture.detectChanges();
               const directive = fixture.debugElement.query(By.directive(NgbPopover));

               directive.triggerEventHandler('mouseenter', {});
               fixture.detectChanges();
               expect(getWindow(fixture)).not.toBeNull();

               fixture.componentInstance.show = false;
               fixture.detectChanges();
               expect(getWindow(fixture)).toBeNull();
             });
       })));
  });


  describe('positioning', () => {

    it('should use requested position', async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
         tcb.overrideTemplate(TestCmpt, `<div ngbPopover="Great tip!" placement="left"></div>`)
             .createAsync(TestCmpt)
             .then((fixture: ComponentFixture<TestCmpt>) => {
               fixture.detectChanges();
               const directive = fixture.debugElement.query(By.directive(NgbPopover));

               directive.triggerEventHandler('click', {});
               fixture.detectChanges();
               const windowEl = getWindow(fixture);

               expect(windowEl).toHaveCssClass('popover');
               expect(windowEl).toHaveCssClass('popover-left');
               expect(windowEl.textContent.trim()).toBe('Great tip!');
             });
       })));
  });

  describe('triggers', () => {

    it('should support toggle triggers', async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
         tcb.overrideTemplate(TestCmpt, `<div ngbPopover="Great tip!" triggers="click"></div>`)
             .createAsync(TestCmpt)
             .then((fixture: ComponentFixture<TestCmpt>) => {
               fixture.detectChanges();
               const directive = fixture.debugElement.query(By.directive(NgbPopover));

               directive.triggerEventHandler('click', {});
               fixture.detectChanges();
               expect(getWindow(fixture)).not.toBeNull();

               directive.triggerEventHandler('click', {});
               fixture.detectChanges();
               expect(getWindow(fixture)).toBeNull();
             });
       })));

    it('should non-default toggle triggers', async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
         tcb.overrideTemplate(TestCmpt, `<div ngbPopover="Great tip!" triggers="mouseenter:click"></div>`)
             .createAsync(TestCmpt)
             .then((fixture: ComponentFixture<TestCmpt>) => {
               fixture.detectChanges();
               const directive = fixture.debugElement.query(By.directive(NgbPopover));

               directive.triggerEventHandler('mouseenter', {});
               fixture.detectChanges();
               expect(getWindow(fixture)).not.toBeNull();

               directive.triggerEventHandler('click', {});
               fixture.detectChanges();
               expect(getWindow(fixture)).toBeNull();
             });
       })));

    it('should support multiple triggers', async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
         tcb.overrideTemplate(TestCmpt, `<div ngbPopover="Great tip!" triggers="mouseenter:mouseleave click"></div>`)
             .createAsync(TestCmpt)
             .then((fixture: ComponentFixture<TestCmpt>) => {
               fixture.detectChanges();
               const directive = fixture.debugElement.query(By.directive(NgbPopover));

               directive.triggerEventHandler('mouseenter', {});
               fixture.detectChanges();
               expect(getWindow(fixture)).not.toBeNull();

               directive.triggerEventHandler('click', {});
               fixture.detectChanges();
               expect(getWindow(fixture)).toBeNull();
             });
       })));

    it('should not use default for manual triggers',
       async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
         tcb.overrideTemplate(TestCmpt, `<div ngbPopover="Great tip!" triggers="manual"></div>`)
             .createAsync(TestCmpt)
             .then((fixture: ComponentFixture<TestCmpt>) => {
               fixture.detectChanges();
               const directive = fixture.debugElement.query(By.directive(NgbPopover));

               directive.triggerEventHandler('mouseenter', {});
               fixture.detectChanges();
               expect(getWindow(fixture)).toBeNull();
             });
       })));

    it('should allow toggling for manual triggers',
       async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
         tcb.overrideTemplate(TestCmpt, `
                <div ngbPopover="Great tip!" triggers="manual" #t="ngbPopover"></div>
                <button (click)="t.toggle()">T</button>`)
             .createAsync(TestCmpt)
             .then((fixture: ComponentFixture<TestCmpt>) => {
               fixture.detectChanges();
               const button = fixture.nativeElement.querySelector('button');

               button.click();
               fixture.detectChanges();
               expect(getWindow(fixture)).not.toBeNull();

               button.click();
               fixture.detectChanges();
               expect(getWindow(fixture)).toBeNull();
             });
       })));

    it('should allow open / close for manual triggers',
       async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
         tcb.overrideTemplate(TestCmpt, `<div ngbPopover="Great tip!" triggers="manual" #t="ngbPopover"></div>
                <button (click)="t.open()">O</button>
                <button (click)="t.close()">C</button>`)
             .createAsync(TestCmpt)
             .then((fixture: ComponentFixture<TestCmpt>) => {
               fixture.detectChanges();
               const buttons = fixture.nativeElement.querySelectorAll('button');

               buttons[0].click();  // open
               fixture.detectChanges();
               expect(getWindow(fixture)).not.toBeNull();

               buttons[1].click();  // close
               fixture.detectChanges();
               expect(getWindow(fixture)).toBeNull();
             });
       })));

    it('should not throw when open called for manual triggers and open popover',
       async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
         tcb.overrideTemplate(TestCmpt, `
                <div ngbPopover="Great tip!" triggers="manual" #t="ngbPopover"></div>
                <button (click)="t.open()">O</button>`)
             .createAsync(TestCmpt)
             .then((fixture: ComponentFixture<TestCmpt>) => {
               fixture.detectChanges();
               const button = fixture.nativeElement.querySelector('button');

               button.click();  // open
               fixture.detectChanges();
               expect(getWindow(fixture)).not.toBeNull();

               button.click();  // open
               fixture.detectChanges();
               expect(getWindow(fixture)).not.toBeNull();
             });
       })));

    it('should not throw when closed called for manual triggers and closed popover',
       async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
         tcb.overrideTemplate(TestCmpt, `
                <div ngbPopover="Great tip!" triggers="manual" #t="ngbPopover"></div>
                <button (click)="t.close()">C</button>`)
             .createAsync(TestCmpt)
             .then((fixture: ComponentFixture<TestCmpt>) => {
               fixture.detectChanges();
               const button = fixture.nativeElement.querySelector('button');

               button.click();  // close
               fixture.detectChanges();
               expect(getWindow(fixture)).toBeNull();
             });
       })));
  });
});

@Component({selector: 'test-cmpt', template: ``})
export class TestCmpt {
  name = 'World';
  show = true;
}
