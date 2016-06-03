import {inject, async} from '@angular/core/testing';
import {TestComponentBuilder, ComponentFixture} from '@angular/compiler/testing';
import {By} from '@angular/platform-browser';
import {Component} from '@angular/core';

import {NgbTooltipWindow, NgbTooltip} from './tooltip';

describe('ngb-tooltip-window', () => {
  it('should render tooltip on top by default', async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
       tcb.createAsync(NgbTooltipWindow).then((fixture) => {
         fixture.detectChanges();

         expect(fixture.nativeElement).toHaveCssClass('tooltip');
         expect(fixture.nativeElement).toHaveCssClass('tooltip-top');
         expect(fixture.nativeElement.getAttribute('role')).toBe('tooltip');
       });
     })));

  it('should position tooltips as requested', async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
       tcb.createAsync(NgbTooltipWindow).then((fixture) => {
         fixture.componentInstance.placement = 'left';
         fixture.detectChanges();
         expect(fixture.nativeElement).toHaveCssClass('tooltip-left');
       });
     })));
});

describe('ngb-tooltip', () => {

  function getWindow(fixture) { return fixture.nativeElement.querySelector('ngb-tooltip-window'); }

  describe('basic functionality', () => {

    it('should open and close a tooltip - default settings and content as string',
       async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
         tcb.overrideTemplate(TestCmpt, `<div ngbTooltip="Great tip!"></div>`)
             .createAsync(TestCmpt)
             .then((fixture: ComponentFixture<TestCmpt>) => {
               fixture.detectChanges();
               const directive = fixture.debugElement.query(By.directive(NgbTooltip));

               directive.triggerEventHandler('mouseenter', {});
               fixture.detectChanges();
               const windowEl = getWindow(fixture);

               expect(windowEl).toHaveCssClass('tooltip');
               expect(windowEl).toHaveCssClass('tooltip-top');
               expect(windowEl.textContent.trim()).toBe('Great tip!');
               expect(windowEl.getAttribute('role')).toBe('tooltip');

               directive.triggerEventHandler('mouseleave', {});
               fixture.detectChanges();
               expect(getWindow(fixture)).toBeNull();
             });
       })));

    it('should open and close a tooltip - default settings and content from a template',
       async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
         tcb.overrideTemplate(TestCmpt, `<template #t>Hello, {{name}}!</template><div [ngbTooltip]="t"></div>`)
             .createAsync(TestCmpt)
             .then((fixture: ComponentFixture<TestCmpt>) => {
               fixture.detectChanges();
               const directive = fixture.debugElement.query(By.directive(NgbTooltip));

               directive.triggerEventHandler('mouseenter', {});
               fixture.detectChanges();
               const windowEl = getWindow(fixture);

               expect(windowEl).toHaveCssClass('tooltip');
               expect(windowEl).toHaveCssClass('tooltip-top');
               expect(windowEl.textContent.trim()).toBe('Hello, World!');
               expect(windowEl.getAttribute('role')).toBe('tooltip');

               directive.triggerEventHandler('mouseleave', {});
               fixture.detectChanges();
               expect(getWindow(fixture)).toBeNull();
             });
       })));
  });


  describe('positioning', () => {

    it('should use requested position', async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
         tcb.overrideTemplate(TestCmpt, `<div ngbTooltip="Great tip!" placement="left"></div>`)
             .createAsync(TestCmpt)
             .then((fixture: ComponentFixture<TestCmpt>) => {
               fixture.detectChanges();
               const directive = fixture.debugElement.query(By.directive(NgbTooltip));

               directive.triggerEventHandler('mouseenter', {});
               fixture.detectChanges();
               const windowEl = getWindow(fixture);

               expect(windowEl).toHaveCssClass('tooltip');
               expect(windowEl).toHaveCssClass('tooltip-left');
               expect(windowEl.textContent.trim()).toBe('Great tip!');
             });
       })));
  });

  describe('triggers', () => {

    it('should support toggle triggers', async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
         tcb.overrideTemplate(TestCmpt, `<div ngbTooltip="Great tip!" triggers="click"></div>`)
             .createAsync(TestCmpt)
             .then((fixture: ComponentFixture<TestCmpt>) => {
               fixture.detectChanges();
               const directive = fixture.debugElement.query(By.directive(NgbTooltip));

               directive.triggerEventHandler('click', {});
               fixture.detectChanges();
               expect(getWindow(fixture)).not.toBeNull();

               directive.triggerEventHandler('click', {});
               fixture.detectChanges();
               expect(getWindow(fixture)).toBeNull();
             });
       })));

    it('should non-default toggle triggers', async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
         tcb.overrideTemplate(TestCmpt, `<div ngbTooltip="Great tip!" triggers="mouseenter:click"></div>`)
             .createAsync(TestCmpt)
             .then((fixture: ComponentFixture<TestCmpt>) => {
               fixture.detectChanges();
               const directive = fixture.debugElement.query(By.directive(NgbTooltip));

               directive.triggerEventHandler('mouseenter', {});
               fixture.detectChanges();
               expect(getWindow(fixture)).not.toBeNull();

               directive.triggerEventHandler('click', {});
               fixture.detectChanges();
               expect(getWindow(fixture)).toBeNull();
             });
       })));

    it('should support multiple triggers', async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
         tcb.overrideTemplate(TestCmpt, `<div ngbTooltip="Great tip!" triggers="mouseenter:mouseleave click"></div>`)
             .createAsync(TestCmpt)
             .then((fixture: ComponentFixture<TestCmpt>) => {
               fixture.detectChanges();
               const directive = fixture.debugElement.query(By.directive(NgbTooltip));

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
         tcb.overrideTemplate(TestCmpt, `<div ngbTooltip="Great tip!" triggers="manual"></div>`)
             .createAsync(TestCmpt)
             .then((fixture: ComponentFixture<TestCmpt>) => {
               fixture.detectChanges();
               const directive = fixture.debugElement.query(By.directive(NgbTooltip));

               directive.triggerEventHandler('mouseenter', {});
               fixture.detectChanges();
               expect(getWindow(fixture)).toBeNull();
             });
       })));

    it('should allow toggling for manual triggers',
       async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
         tcb.overrideTemplate(TestCmpt, `
                <div ngbTooltip="Great tip!" triggers="manual" #t="ngbTooltip"></div>
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
         tcb.overrideTemplate(TestCmpt, `<div ngbTooltip="Great tip!" triggers="manual" #t="ngbTooltip"></div>
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

    it('should not throw when open called for manual triggers and open tooltip',
       async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
         tcb.overrideTemplate(TestCmpt, `
                <div ngbTooltip="Great tip!" triggers="manual" #t="ngbTooltip"></div>
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

    it('should not throw when closed called for manual triggers and closed tooltip',
       async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
         tcb.overrideTemplate(TestCmpt, `
                <div ngbTooltip="Great tip!" triggers="manual" #t="ngbTooltip"></div>
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


@Component({selector: 'test-cmpt', template: ``, directives: [NgbTooltip], precompile: [NgbTooltipWindow]})
export class TestCmpt {
  name = 'World';
}
