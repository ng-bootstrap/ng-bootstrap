import {inject, async} from '@angular/core/testing';
import {TestComponentBuilder} from '@angular/compiler/testing';
import {Component} from '@angular/core';
import {NgbTypeaheadValueAccessor} from './typeahead-valueaccessor';


function expectInputValue(element: HTMLElement, value: string) {
  expect((<HTMLInputElement>element.querySelector('input')).value).toBe(value);
}

describe('ngb-typeahead-valueaccessor', () => {

  it('should format values when no formatter provided', async(inject([TestComponentBuilder], (tcb) => {
       const html = '<input [(ngModel)]="model" ngbTypeahead />';

       tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();
         const el = fixture.nativeElement;
         const comp = fixture.componentInstance;
         expectInputValue(el, '');

         comp.model = 'text';
         fixture.detectChanges();
         expectInputValue(el, 'text');

         comp.model = null;
         fixture.detectChanges();
         expectInputValue(el, '');

         comp.model = {};
         fixture.detectChanges();
         expectInputValue(el, '[object Object]');
       });
     })));

  it('should format values with custom formatter provided', async(inject([TestComponentBuilder], (tcb) => {
       const html = '<input [(ngModel)]="model" ngbTypeahead [inputFormatter]="formatter"/>';

       tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();
         const el = fixture.nativeElement;
         const comp = fixture.componentInstance;
         expectInputValue(el, '');

         comp.model = null;
         fixture.detectChanges();
         expectInputValue(el, '');

         comp.model = {value: 'text'};
         fixture.detectChanges();
         expectInputValue(el, 'TEXT');
       });
     })));
});

@Component({selector: 'test-cmp', directives: [NgbTypeaheadValueAccessor], template: ''})
class TestComponent {
  model = '';

  formatter = (result: {value: string}) => { return result.value.toUpperCase(); };
}
