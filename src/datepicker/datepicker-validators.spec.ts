import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {FormsModule, NgForm} from '@angular/forms';
import {NgbDatepickerModule, NgbDateStruct} from './datepicker.module';
import {createGenericTestComponent} from '../test/common';
import {Component} from '@angular/core';

const createTestCmpt = (html: string) =>
    createGenericTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;

describe('validation', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [TestComponent], imports: [NgbDatepickerModule, FormsModule]});
  });

  describe('values set from model', () => {

    it('should not return errors for valid model', fakeAsync(() => {
         const fixture = createTestCmpt(
             `<form><input ngbDatepicker [ngModel]="{year: 2017, month: 04, day: 04}" name="dp"></form>`);
         const form = fixture.debugElement.query(By.directive(NgForm)).injector.get(NgForm);

         fixture.detectChanges();
         tick();
         expect(form.control.valid).toBeTruthy();
         expect(form.control.hasError('ngbDate', ['dp'])).toBeFalsy();
       }));

    it('should not return errors for empty model', fakeAsync(() => {
         const fixture = createTestCmpt(`<form><input ngbDatepicker [ngModel]="date" name="dp"></form>`);
         const form = fixture.debugElement.query(By.directive(NgForm)).injector.get(NgForm);

         fixture.detectChanges();
         tick();
         expect(form.control.valid).toBeTruthy();
       }));

    it('should return "invalid" errors for invalid model', fakeAsync(() => {
         const fixture = createTestCmpt(`<form><input ngbDatepicker [ngModel]="5" name="dp"></form>`);
         const form = fixture.debugElement.query(By.directive(NgForm)).injector.get(NgForm);

         fixture.detectChanges();
         tick();
         expect(form.control.invalid).toBeTruthy();
         expect(form.control.getError('ngbDate', ['dp']).invalid).toBe(5);
       }));

    it('should return "requiredBefore" errors for dates before minimal date', fakeAsync(() => {
         const fixture = createTestCmpt(`<form>
          <input ngbDatepicker [ngModel]="{year: 2017, month: 04, day: 04}" [minDate]="{year: 2017, month: 6, day: 4}" name="dp">
        </form>`);
         const form = fixture.debugElement.query(By.directive(NgForm)).injector.get(NgForm);

         fixture.detectChanges();
         tick();
         expect(form.control.invalid).toBeTruthy();
         expect(form.control.getError('ngbDate', ['dp']).requiredBefore).toEqual({year: 2017, month: 6, day: 4});
       }));

    it('should return "requiredAfter" errors for dates after maximal date', fakeAsync(() => {
         const fixture = createTestCmpt(`<form>
          <input ngbDatepicker [ngModel]="{year: 2017, month: 04, day: 04}" [maxDate]="{year: 2017, month: 2, day: 4}" name="dp">
        </form>`);
         const form = fixture.debugElement.query(By.directive(NgForm)).injector.get(NgForm);

         fixture.detectChanges();
         tick();
         expect(form.control.invalid).toBeTruthy();
         expect(form.control.getError('ngbDate', ['dp']).requiredAfter).toEqual({year: 2017, month: 2, day: 4});
       }));

    it('should update validity status when model changes', fakeAsync(() => {
         const fixture = createTestCmpt(`<form><input ngbDatepicker [ngModel]="date" name="dp"></form>`);
         const form = fixture.debugElement.query(By.directive(NgForm)).injector.get(NgForm);

         fixture.componentRef.instance.date = <any>'invalid';
         fixture.detectChanges();
         tick();
         expect(form.control.invalid).toBeTruthy();

         fixture.componentRef.instance.date = {year: 2015, month: 7, day: 3};
         fixture.detectChanges();
         tick();
         expect(form.control.valid).toBeTruthy();
       }));

    it('should update validity status when minDate changes', fakeAsync(() => {
         const fixture = createTestCmpt(`<form>
          <input ngbDatepicker [ngModel]="{year: 2017, month: 2, day: 4}" [minDate]="date" name="dp">
        </form>`);
         const form = fixture.debugElement.query(By.directive(NgForm)).injector.get(NgForm);

         fixture.detectChanges();
         tick();
         expect(form.control.valid).toBeTruthy();

         fixture.componentRef.instance.date = {year: 2018, month: 7, day: 3};
         fixture.detectChanges();
         tick();
         expect(form.control.invalid).toBeTruthy();
       }));

    it('should update validity status when maxDate changes', fakeAsync(() => {
         const fixture = createTestCmpt(`<form>
          <input ngbDatepicker [ngModel]="{year: 2017, month: 2, day: 4}" [maxDate]="date" name="dp">
        </form>`);
         const form = fixture.debugElement.query(By.directive(NgForm)).injector.get(NgForm);

         fixture.detectChanges();
         tick();
         expect(form.control.valid).toBeTruthy();

         fixture.componentRef.instance.date = {year: 2015, month: 7, day: 3};
         fixture.detectChanges();
         tick();
         expect(form.control.invalid).toBeTruthy();
       }));

    it('should update validity for manually entered dates', fakeAsync(() => {
         const fixture = createTestCmpt(`<form><input ngbDatepicker [(ngModel)]="date" name="dp"></form>`);
         const inputDebugEl = fixture.debugElement.query(By.css('input'));
         const form = fixture.debugElement.query(By.directive(NgForm)).injector.get(NgForm);

         inputDebugEl.triggerEventHandler('input', {target: {value: '2016-09-10'}});
         fixture.detectChanges();
         tick();
         expect(form.control.valid).toBeTruthy();

         inputDebugEl.triggerEventHandler('input', {target: {value: 'invalid'}});
         fixture.detectChanges();
         tick();
         expect(form.control.invalid).toBeTruthy();
       }));

    it('should consider empty strings as valid', fakeAsync(() => {
         const fixture = createTestCmpt(`<form><input ngbDatepicker [(ngModel)]="date" name="dp"></form>`);
         const inputDebugEl = fixture.debugElement.query(By.css('input'));
         const form = fixture.debugElement.query(By.directive(NgForm)).injector.get(NgForm);

         inputDebugEl.triggerEventHandler('change', {target: {value: '2016-09-10'}});
         fixture.detectChanges();
         tick();
         expect(form.control.valid).toBeTruthy();

         inputDebugEl.triggerEventHandler('change', {target: {value: ''}});
         fixture.detectChanges();
         tick();
         expect(form.control.valid).toBeTruthy();
       }));
  });

});

@Component({selector: 'test-cmp', template: ''})
class TestComponent {
  date: NgbDateStruct;
}
