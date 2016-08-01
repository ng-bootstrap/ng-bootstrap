import {inject, async, TestComponentBuilder} from '@angular/core/testing';

import {Component} from '@angular/core';

import {NgbTypeaheadWindow} from './typeahead-window';
import {expectResults, getWindowLinks} from './test-common';


describe('ngb-typeahead-window', () => {

  describe('display', () => {

    it('should display results with the first row active', async(inject([TestComponentBuilder], (tcb) => {
         const html = '<ngb-typeahead-window [results]="results" [term]="term"></ngb-typeahead-window>';

         tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.detectChanges();
           expectResults(fixture.nativeElement, ['+bar', 'baz']);
         });
       })));

    it('should use a formatting function to display results', async(inject([TestComponentBuilder], (tcb) => {
         const html =
             '<ngb-typeahead-window [results]="results" [term]="term" [formatter]="formatterFn"></ngb-typeahead-window>';

         tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.detectChanges();
           expectResults(fixture.nativeElement, ['+BAR', 'BAZ']);
         });
       })));

    it('should use a custom template if provided', async(inject([TestComponentBuilder], (tcb) => {
         const html = `<template #rt let-r="result" let-t="term">{{r.toUpperCase()}}-{{t}}</template>
         <ngb-typeahead-window [results]="results" [term]="term" [resultTemplate]="rt"></ngb-typeahead-window>`;

         tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.detectChanges();
           expectResults(fixture.nativeElement, ['+BAR-ba', 'BAZ-ba']);
         });
       })));
  });

  describe('active row', () => {

    it('should change active row on prev / next method call', async(inject([TestComponentBuilder], (tcb) => {
         const html = `
      <button (click)="w.next()">+</button>
      <button (click)="w.prev()">-</button>
      <ngb-typeahead-window [results]="results" [term]="term" #w="ngbTypeaheadWindow"></ngb-typeahead-window>`;

         tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.detectChanges();
           const buttons = fixture.nativeElement.querySelectorAll('button');

           expectResults(fixture.nativeElement, ['+bar', 'baz']);

           buttons[0].click();
           fixture.detectChanges();
           expectResults(fixture.nativeElement, ['bar', '+baz']);

           buttons[1].click();
           fixture.detectChanges();
           expectResults(fixture.nativeElement, ['+bar', 'baz']);
         });
       })));

    it('should wrap active row on prev / next method call', async(inject([TestComponentBuilder], (tcb) => {
         const html = `
      <button (click)="w.next()">+</button>
      <button (click)="w.prev()">-</button>
      <ngb-typeahead-window [results]="results" [term]="term" #w="ngbTypeaheadWindow"></ngb-typeahead-window>`;

         tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.detectChanges();
           const buttons = fixture.nativeElement.querySelectorAll('button');

           expectResults(fixture.nativeElement, ['+bar', 'baz']);

           buttons[1].click();
           fixture.detectChanges();
           expectResults(fixture.nativeElement, ['bar', '+baz']);

           buttons[0].click();
           fixture.detectChanges();
           expectResults(fixture.nativeElement, ['+bar', 'baz']);
         });
       })));

    it('should change active row on mouseenter', async(inject([TestComponentBuilder], (tcb) => {
         const html = `<ngb-typeahead-window [results]="results" [term]="term"></ngb-typeahead-window>`;

         tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.detectChanges();
           const links = getWindowLinks(fixture.debugElement);

           expectResults(fixture.nativeElement, ['+bar', 'baz']);

           links[1].triggerEventHandler('mouseenter', {});
           fixture.detectChanges();
           expectResults(fixture.nativeElement, ['bar', '+baz']);
         });
       })));
  });

  describe('result selection', () => {
    it('should select a given row on click', async(inject([TestComponentBuilder], (tcb) => {
         const html =
             '<ngb-typeahead-window [results]="results" [term]="term" (select)="selected = $event"></ngb-typeahead-window>';

         tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.detectChanges();
           const links = getWindowLinks(fixture.debugElement);

           expectResults(fixture.nativeElement, ['+bar', 'baz']);

           links[1].triggerEventHandler('click', {});
           fixture.detectChanges();
           expect(fixture.componentInstance.selected).toBe('baz');
         });
       })));

    it('should return selected row via getActive()', async(inject([TestComponentBuilder], (tcb) => {
         const html = `
        <button (click)="active = w.getActive()">getActive</button>
        <button (click)="w.next()">+</button>
        <ngb-typeahead-window [results]="results" [term]="term" #w="ngbTypeaheadWindow"></ngb-typeahead-window>`;

         tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.detectChanges();
           const buttons = fixture.nativeElement.querySelectorAll('button');
           const activeBtn = buttons[0];
           const nextBtn = buttons[1];

           activeBtn.click();
           expectResults(fixture.nativeElement, ['+bar', 'baz']);
           expect(fixture.componentInstance.active).toBe('bar');

           nextBtn.click();
           activeBtn.click();
           fixture.detectChanges();
           expectResults(fixture.nativeElement, ['bar', '+baz']);
           expect(fixture.componentInstance.active).toBe('baz');
         });
       })));
  });

});

@Component({selector: 'test-cmp', directives: [NgbTypeaheadWindow], template: ''})
class TestComponent {
  active: string;
  results = ['bar', 'baz'];
  term = 'ba';
  selected: string;

  formatterFn = (result) => { return result.toUpperCase(); };
}
