import {inject, async} from '@angular/core/testing';
import {TestComponentBuilder} from '@angular/compiler/testing';
import {By} from '@angular/platform-browser';

import {Component} from '@angular/core';

import {NgbTypeaheadWindow} from './typeahead-window';

function normalizeText(txt: string): string {
  return txt.trim().replace(/\s+/g, ' ');
}

function expectResults(nativeEl: HTMLElement, resultsDef: string[]): void {
  const pages = nativeEl.querySelectorAll('a');

  expect(pages.length).toEqual(resultsDef.length);

  for (let i = 0; i < resultsDef.length; i++) {
    let resultDef = resultsDef[i];
    let classIndicator = resultDef.charAt(0);

    expect(pages[i]).toHaveCssClass('dropdown-item');
    if (classIndicator === '+') {
      expect(pages[i]).toHaveCssClass('active');
      expect(normalizeText(pages[i].textContent)).toEqual(resultDef.substr(1));
    } else {
      expect(pages[i]).not.toHaveCssClass('active');
      expect(normalizeText(pages[i].textContent)).toEqual(resultDef);
    }
  }
}

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
           const rowDebugEls = fixture.debugElement.queryAll(By.css('a'));

           expectResults(fixture.nativeElement, ['+bar', 'baz']);

           rowDebugEls[1].triggerEventHandler('mouseenter', {});
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
           const rowDebugEls = fixture.debugElement.queryAll(By.css('a'));

           expectResults(fixture.nativeElement, ['+bar', 'baz']);

           rowDebugEls[1].triggerEventHandler('click', {});
           fixture.detectChanges();
           expect(fixture.componentInstance.selected).toBe('baz');
         });
       })));
  });

});

@Component({selector: 'test-cmp', directives: [NgbTypeaheadWindow], template: ''})
class TestComponent {
  results = ['bar', 'baz'];
  term = 'ba';
  selected: string;

  formatterFn = (result) => { return result.toUpperCase(); };
}
