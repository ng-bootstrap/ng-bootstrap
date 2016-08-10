import {async, TestBed, ComponentFixture} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {Component} from '@angular/core';

import {NgbTooltipModule} from './index';
import {NgbTooltipWindow, NgbTooltip} from './tooltip';

function createTestComponentFixture(html: string): ComponentFixture<TestComponent> {
  TestBed.overrideComponent(TestComponent, {set: {template: html}});
  const fixture = TestBed.createComponent(TestComponent);
  fixture.detectChanges();
  return fixture;
}

describe('ngb-tooltip-window', () => {
  beforeEach(() => { TestBed.configureTestingModule({imports: [NgbTooltipModule]}); });

  it('should render tooltip on top by default', async(() => {
       const fixture = TestBed.createComponent(NgbTooltipWindow);
       fixture.detectChanges();

       expect(fixture.nativeElement).toHaveCssClass('tooltip');
       expect(fixture.nativeElement).toHaveCssClass('tooltip-top');
       expect(fixture.nativeElement.getAttribute('role')).toBe('tooltip');
     }));

  it('should position tooltips as requested', async(() => {
       const fixture = TestBed.createComponent(NgbTooltipWindow);
       fixture.componentInstance.placement = 'left';
       fixture.detectChanges();
       expect(fixture.nativeElement).toHaveCssClass('tooltip-left');
     }));
});

describe('ngb-tooltip', () => {

  beforeEach(() => { TestBed.configureTestingModule({declarations: [TestComponent], imports: [NgbTooltipModule]}); });

  function getWindow(fixture) { return fixture.nativeElement.querySelector('ngb-tooltip-window'); }

  describe('basic functionality', () => {

    it('should open and close a tooltip - default settings and content as string', async(() => {
         const fixture = createTestComponentFixture(`<div ngbTooltip="Great tip!"></div>`);
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
       }));

    it('should open and close a tooltip - default settings and content from a template', async(() => {
         const fixture = createTestComponentFixture(`<template #t>Hello, {{name}}!</template><div [ngbTooltip]="t"></div>`);
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
       }));

    it('should allow re-opening previously closed tooltips', async(() => {
         const fixture = createTestComponentFixture(`<div ngbTooltip="Great tip!"></div>`);
         const directive = fixture.debugElement.query(By.directive(NgbTooltip));

         directive.triggerEventHandler('mouseenter', {});
         fixture.detectChanges();
         expect(getWindow(fixture)).not.toBeNull();

         directive.triggerEventHandler('mouseleave', {});
         fixture.detectChanges();
         expect(getWindow(fixture)).toBeNull();

         directive.triggerEventHandler('mouseenter', {});
         fixture.detectChanges();
         expect(getWindow(fixture)).not.toBeNull();
       }));

    it('should not leave dangling tooltips in the DOM', async(() => {
         const fixture = createTestComponentFixture(`<template [ngIf]="show"><div ngbTooltip="Great tip!"></div></template>`);
         const directive = fixture.debugElement.query(By.directive(NgbTooltip));

         directive.triggerEventHandler('mouseenter', {});
         fixture.detectChanges();
         expect(getWindow(fixture)).not.toBeNull();

         fixture.componentInstance.show = false;
         fixture.detectChanges();
         expect(getWindow(fixture)).toBeNull();
       }));

    it('should properly cleanup tooltips with manual triggers', async(() => {
         const fixture = createTestComponentFixture(`
            <template [ngIf]="show">
              <div ngbTooltip="Great tip!" triggers="manual" #t="ngbTooltip" (mouseenter)="t.open()"></div>
            </template>`);
         const directive = fixture.debugElement.query(By.directive(NgbTooltip));

         directive.triggerEventHandler('mouseenter', {});
         fixture.detectChanges();
         expect(getWindow(fixture)).not.toBeNull();

         fixture.componentInstance.show = false;
         fixture.detectChanges();
         expect(getWindow(fixture)).toBeNull();
       }));

    describe('positioning', () => {

      it('should use requested position', async(() => {
           const fixture = createTestComponentFixture(`<div ngbTooltip="Great tip!" placement="left"></div>`);
           const directive = fixture.debugElement.query(By.directive(NgbTooltip));

           directive.triggerEventHandler('mouseenter', {});
           fixture.detectChanges();
           const windowEl = getWindow(fixture);

           expect(windowEl).toHaveCssClass('tooltip');
           expect(windowEl).toHaveCssClass('tooltip-left');
           expect(windowEl.textContent.trim()).toBe('Great tip!');
         }));
    });

    describe('triggers', () => {

      it('should support toggle triggers', async(() => {
           const fixture = createTestComponentFixture(`<div ngbTooltip="Great tip!" triggers="click"></div>`);
           const directive = fixture.debugElement.query(By.directive(NgbTooltip));

           directive.triggerEventHandler('click', {});
           fixture.detectChanges();
           expect(getWindow(fixture)).not.toBeNull();

           directive.triggerEventHandler('click', {});
           fixture.detectChanges();
           expect(getWindow(fixture)).toBeNull();
         }));

      it('should non-default toggle triggers', async(() => {
           const fixture =
               createTestComponentFixture(`<div ngbTooltip="Great tip!" triggers="mouseenter:click"></div>`);
           const directive = fixture.debugElement.query(By.directive(NgbTooltip));

           directive.triggerEventHandler('mouseenter', {});
           fixture.detectChanges();
           expect(getWindow(fixture)).not.toBeNull();

           directive.triggerEventHandler('click', {});
           fixture.detectChanges();
           expect(getWindow(fixture)).toBeNull();
         }));

      it('should support multiple triggers', async(() => {
           const fixture =
               createTestComponentFixture(`<div ngbTooltip="Great tip!" triggers="mouseenter:mouseleave click"></div>`);
           const directive = fixture.debugElement.query(By.directive(NgbTooltip));

           directive.triggerEventHandler('mouseenter', {});
           fixture.detectChanges();
           expect(getWindow(fixture)).not.toBeNull();

           directive.triggerEventHandler('click', {});
           fixture.detectChanges();
           expect(getWindow(fixture)).toBeNull();
         }));

      it('should not use default for manual triggers', async(() => {
           const fixture = createTestComponentFixture(`<div ngbTooltip="Great tip!" triggers="manual"></div>`);
           const directive = fixture.debugElement.query(By.directive(NgbTooltip));

           directive.triggerEventHandler('mouseenter', {});
           fixture.detectChanges();
           expect(getWindow(fixture)).toBeNull();
         }));

      it('should allow toggling for manual triggers', async(() => {
           const fixture = createTestComponentFixture(`
                <div ngbTooltip="Great tip!" triggers="manual" #t="ngbTooltip"></div>
                <button (click)="t.toggle()">T</button>`);
           const button = fixture.nativeElement.querySelector('button');

           button.click();
           fixture.detectChanges();
           expect(getWindow(fixture)).not.toBeNull();

           button.click();
           fixture.detectChanges();
           expect(getWindow(fixture)).toBeNull();
         }));

      it('should allow open / close for manual triggers', async(() => {
           const fixture = createTestComponentFixture(`
                <div ngbTooltip="Great tip!" triggers="manual" #t="ngbTooltip"></div>
                <button (click)="t.open()">O</button>
                <button (click)="t.close()">C</button>`);

           const buttons = fixture.nativeElement.querySelectorAll('button');

           buttons[0].click();  // open
           fixture.detectChanges();
           expect(getWindow(fixture)).not.toBeNull();

           buttons[1].click();  // close
           fixture.detectChanges();
           expect(getWindow(fixture)).toBeNull();
         }));

      it('should not throw when open called for manual triggers and open tooltip', async(() => {
           const fixture = createTestComponentFixture(`
                <div ngbTooltip="Great tip!" triggers="manual" #t="ngbTooltip"></div>
                <button (click)="t.open()">O</button>`);
           const button = fixture.nativeElement.querySelector('button');

           button.click();  // open
           fixture.detectChanges();
           expect(getWindow(fixture)).not.toBeNull();

           button.click();  // open
           fixture.detectChanges();
           expect(getWindow(fixture)).not.toBeNull();
         }));

      it('should not throw when closed called for manual triggers and closed tooltip', async(() => {
           const fixture = createTestComponentFixture(`
                <div ngbTooltip="Great tip!" triggers="manual" #t="ngbTooltip"></div>
                <button (click)="t.close()">C</button>`);

           const button = fixture.nativeElement.querySelector('button');

           button.click();  // close
           fixture.detectChanges();
           expect(getWindow(fixture)).toBeNull();
         }));
    });
  });
});

@Component({selector: 'test-cmpt', template: ``})
export class TestComponent {
  name = 'World';
  show = true;
}
