import {TestBed, ComponentFixture, async, fakeAsync, tick} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {createGenericTestComponent} from '../test/common';

import {Component} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {NgbButtonsModule} from './buttons.module';
import {NgbCheckBox} from './checkbox';

const createTestComponent = (html: string) =>
    createGenericTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;

function getLabel(nativeEl: HTMLElement): HTMLElement {
  return <HTMLElement>nativeEl.querySelector('label');
}

function getInput(nativeEl: HTMLElement): HTMLInputElement {
  return <HTMLInputElement>nativeEl.querySelector('input');
}

describe('NgbCheckBox', () => {

  beforeEach(() => {
    TestBed.configureTestingModule(
        {declarations: [TestComponent], imports: [NgbButtonsModule, FormsModule, ReactiveFormsModule]});
  });

  describe('bindings', () => {

    it('should mark input as checked / unchecked based on model change (default values)', fakeAsync(() => {
         const fixture =
             createTestComponent(`<label ngbButtonLabel><input type="checkbox" ngbButton [ngModel]="model"></label>`);

         fixture.componentInstance.model = true;
         fixture.detectChanges();
         tick();
         fixture.detectChanges();
         expect(getInput(fixture.debugElement.nativeElement).checked).toBeTruthy();
         expect(getLabel(fixture.debugElement.nativeElement)).toHaveCssClass('active');

         fixture.componentInstance.model = false;
         fixture.detectChanges();
         tick();
         fixture.detectChanges();
         expect(getInput(fixture.debugElement.nativeElement).checked).toBeFalsy();
         expect(getLabel(fixture.debugElement.nativeElement)).not.toHaveCssClass('active');
       }));


    it('should mark input as checked / unchecked based on model change (custom values)', fakeAsync(() => {
         const fixture = createTestComponent(`
        <label ngbButtonLabel>
          <input type="checkbox" ngbButton [ngModel]="model" [valueChecked]="'foo'">
        </label>
      `);

         fixture.componentInstance.model = 'foo';
         fixture.detectChanges();
         tick();
         fixture.detectChanges();
         expect(getInput(fixture.debugElement.nativeElement).checked).toBeTruthy();
         expect(getLabel(fixture.debugElement.nativeElement)).toHaveCssClass('active');

         fixture.componentInstance.model = 'sth else';
         fixture.detectChanges();
         tick();
         fixture.detectChanges();
         expect(getInput(fixture.debugElement.nativeElement).checked).toBeFalsy();
         expect(getLabel(fixture.debugElement.nativeElement)).not.toHaveCssClass('active');
       }));

    it('should mark input as disabled / enabled based on binding change', fakeAsync(() => {
         const fixture = createTestComponent(`
        <label ngbButtonLabel>
          <input type="checkbox" ngbButton [ngModel]="model" [disabled]="disabled">
        </label>
      `);

         fixture.componentInstance.disabled = true;
         fixture.detectChanges();
         tick();
         fixture.detectChanges();
         expect(getInput(fixture.debugElement.nativeElement).disabled).toBeTruthy();
         expect(getLabel(fixture.debugElement.nativeElement)).toHaveCssClass('disabled');

         fixture.componentInstance.disabled = false;
         fixture.detectChanges();
         tick();
         fixture.detectChanges();
         expect(getInput(fixture.debugElement.nativeElement).disabled).toBeFalsy();
         expect(getLabel(fixture.debugElement.nativeElement)).not.toHaveCssClass('disabled');
       }));
  });

  describe('user interactions', () => {

    it('should bind model value on change (default values)', fakeAsync(() => {
         const fixture = createTestComponent(`
        <label ngbButtonLabel>
          <input type="checkbox" ngbButton [(ngModel)]="model">
        </label>
      `);

         const inputDebugEl = fixture.debugElement.query(By.directive(NgbCheckBox));

         inputDebugEl.triggerEventHandler('change', {target: {checked: true}});
         tick();
         expect(fixture.componentInstance.model).toBe(true);

         inputDebugEl.triggerEventHandler('change', {target: {checked: false}});
         tick();
         expect(fixture.componentInstance.model).toBe(false);
       }));

    it('should bind model value on change (custom values)', fakeAsync(() => {
         const fixture = createTestComponent(`
        <label ngbButtonLabel>
          <input type="checkbox" ngbButton [(ngModel)]="model" [valueChecked]="'foo'" [valueUnChecked]="'bar'">
        </label>
      `);

         const inputDebugEl = fixture.debugElement.query(By.directive(NgbCheckBox));

         inputDebugEl.triggerEventHandler('change', {target: {checked: true}});
         tick();
         expect(fixture.componentInstance.model).toBe('foo');

         inputDebugEl.triggerEventHandler('change', {target: {checked: false}});
         tick();
         expect(fixture.componentInstance.model).toBe('bar');
       }));

    it('should mark label as focused based on input focus', () => {
      const fixture = createTestComponent(`
        <label ngbButtonLabel>
          <input type="checkbox" ngbButton>
        </label>
      `);

      const inputDebugEl = fixture.debugElement.query(By.directive(NgbCheckBox));

      inputDebugEl.triggerEventHandler('focus', {});
      fixture.detectChanges();
      expect(getLabel(fixture.debugElement.nativeElement)).toHaveCssClass('focus');

      inputDebugEl.triggerEventHandler('blur', {});
      fixture.detectChanges();
      expect(getLabel(fixture.debugElement.nativeElement)).not.toHaveCssClass('focus');
    });

  });

});

@Component({selector: 'test-cmp', template: ''})
class TestComponent {
  disabled;
  model;
}
