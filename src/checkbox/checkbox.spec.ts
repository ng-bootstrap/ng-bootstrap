import {Component, DebugElement} from '@angular/core';
import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {By} from '@angular/platform-browser';
import {createGenericTestComponent} from '../test/common';
import {NgbCheckbox} from './checkbox';
import {NgbCheckboxModule} from './checkbox.module';

const createTestComponent = (html: string) =>
    createGenericTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;

function getCheckboxLabel(fixture: ComponentFixture<TestComponent>): DebugElement {
  return fixture.debugElement.query(By.directive(NgbCheckbox)).query(By.css('label'));
}

function getCheckboxInput(fixture: ComponentFixture<TestComponent>): DebugElement {
  return fixture.debugElement.query(By.directive(NgbCheckbox)).query(By.css('input'));
}

function getCheckboxElement(fixture: ComponentFixture<TestComponent>): DebugElement {
  return fixture.debugElement.query(By.directive(NgbCheckbox));
}

function getCheckboxComponent(fixture: ComponentFixture<TestComponent>): NgbCheckbox {
  return getCheckboxElement(fixture).componentInstance;
}

describe('ngb-checkbox', () => {
  beforeEach(() => {
    TestBed.configureTestingModule(
        {declarations: [TestComponent], imports: [NgbCheckboxModule, FormsModule, ReactiveFormsModule]});
  });

  it('should initialize inputs with default values', () => {
    const checkbox = new NgbCheckbox(null);
    expect(checkbox.disabled).toBe(false);
    expect(checkbox.readonly).toBe(false);
    expect(checkbox.value).toBe(false);
  });

  it('handles correctly the click event', fakeAsync(() => {
       const fixture = createTestComponent('<ngb-checkbox [(value)]="value"></ngb-checkbox>');
       const checkbox = getCheckboxComponent(fixture);
       const checkboxLabel = getCheckboxLabel(fixture).nativeElement;

       expect(checkbox.value).toEqual(false);

       // click on label
       checkboxLabel.click();
       fixture.detectChanges();
       expect(checkbox.value).toEqual(true);
       expect(fixture.componentInstance.value).toBe(true);

       // second click on label
       checkboxLabel.click();
       fixture.detectChanges();
       expect(checkbox.value).toEqual(false);
       expect(fixture.componentInstance.value).toBe(false);
     }));

  it('ignores the click event on a readonly checkbox', () => {
    const fixture = createTestComponent('<ngb-checkbox [(value)]="value" [readonly]="true"></ngb-checkbox>');
    const checkbox = getCheckboxComponent(fixture);
    const checkboxLabel = getCheckboxLabel(fixture).nativeElement;

    expect(checkbox.value).toEqual(false);

    // click on label
    checkboxLabel.click();
    fixture.detectChanges();
    expect(checkbox.value).toEqual(false);
    expect(fixture.componentInstance.value).toBe(false);
  });

  it('ignores the click event on a disabled checkbox', () => {
    const fixture = createTestComponent('<ngb-checkbox [(value)]="value" [disabled]="true"></ngb-checkbox>');
    const checkbox = getCheckboxComponent(fixture);
    const checkboxLabel = getCheckboxLabel(fixture).nativeElement;

    expect(checkbox.value).toEqual(false);

    // click on label
    checkboxLabel.click();
    fixture.detectChanges();
    expect(checkbox.value).toEqual(false);
    expect(fixture.componentInstance.value).toBe(false);
  });

  describe('forms', () => {
    it('should work with reactive form validation', () => {
      const html = `
        <form [formGroup]="form">
          <ngb-checkbox formControlName="checkbox"></ngb-checkbox>
        </form>`;

      const fixture = createTestComponent(html);
      const element = getCheckboxElement(fixture);
      const checkbox = getCheckboxComponent(fixture);

      expect(checkbox.value).toEqual(false);
      expect(element.nativeElement).toHaveCssClass('ng-invalid');
      expect(element.nativeElement).toHaveCssClass('ng-untouched');

      fixture.componentInstance.form.patchValue({checkbox: true});
      fixture.detectChanges();
      expect(checkbox.value).toEqual(true);
      expect(element.nativeElement).toHaveCssClass('ng-valid');
      expect(element.nativeElement).toHaveCssClass('ng-untouched');

      fixture.componentInstance.form.patchValue({checkbox: false});
      fixture.detectChanges();
      expect(checkbox.value).toEqual(false);
      expect(element.nativeElement).toHaveCssClass('ng-invalid');
      expect(element.nativeElement).toHaveCssClass('ng-untouched');
    });

    it('should handle clicks and update form control', () => {
      const html = `
        <form [formGroup]="form">
          <ngb-checkbox formControlName="checkbox"></ngb-checkbox>
        </form>`;

      const fixture = createTestComponent(html);
      const element = getCheckboxElement(fixture);
      const checkbox = getCheckboxComponent(fixture);
      const label = getCheckboxLabel(fixture);

      expect(checkbox.value).toEqual(false);
      expect(element.nativeElement).toHaveCssClass('ng-invalid');
      expect(element.nativeElement).toHaveCssClass('ng-pristine');
      expect(element.nativeElement).toHaveCssClass('ng-untouched');

      label.nativeElement.click();
      fixture.detectChanges();
      expect(checkbox.value).toEqual(true);
      expect(element.nativeElement).toHaveCssClass('ng-valid');
      expect(element.nativeElement).toHaveCssClass('ng-dirty');
      expect(element.nativeElement).toHaveCssClass('ng-untouched');
    });

    it('should work with both value input and form control', fakeAsync(() => {
         const html = `
        <form [formGroup]="form">
          <ngb-checkbox [(value)]="value" formControlName="checkbox"></ngb-checkbox>
        </form>`;

         const fixture = createTestComponent(html);
         const element = getCheckboxElement(fixture);
         const checkbox = getCheckboxComponent(fixture);
         const label = getCheckboxLabel(fixture);

         expect(checkbox.value).toEqual(false);
         expect(element.nativeElement).toHaveCssClass('ng-invalid');

         label.nativeElement.click();
         fixture.detectChanges();
         tick();
         expect(checkbox.value).toEqual(true);
         expect(fixture.componentInstance.value).toBe(true);
         expect(element.nativeElement).toHaveCssClass('ng-valid');

         fixture.componentInstance.value = false;
         fixture.detectChanges();
         tick();
         expect(checkbox.value).toEqual(false);
         expect(fixture.componentInstance.form.get('checkbox').value).toBe(false);
         expect(element.nativeElement).toHaveCssClass('ng-invalid');
       }));

    it('should disable widget when a control is disabled', fakeAsync(() => {
         const html = `
        <form [formGroup]="form">
          <ngb-checkbox formControlName="checkbox"></ngb-checkbox>
        </form>`;

         const fixture = createTestComponent(html);
         const checkbox = getCheckboxComponent(fixture);
         const label = getCheckboxLabel(fixture);

         expect(checkbox.value).toEqual(false);
         expect(fixture.componentInstance.form.get('checkbox').disabled).toBeFalsy();

         fixture.componentInstance.form.get('checkbox').disable();
         fixture.detectChanges();
         expect(fixture.componentInstance.form.get('checkbox').disabled).toBeTruthy();

         label.nativeElement.click();
         fixture.detectChanges();
         expect(checkbox.value).toEqual(false);
       }));

    it('should mark control as touched when blurred', fakeAsync(() => {
         const html = `
     <form [formGroup]="form">
       <ngb-checkbox formControlName="checkbox"></ngb-checkbox>
     </form>
     `;

         const fixture = createTestComponent(html);
         const checkbox = getCheckboxElement(fixture);
         const input = getCheckboxInput(fixture);

         input.triggerEventHandler('blur', {});
         fixture.detectChanges();
         tick();
         fixture.detectChanges();

         expect(checkbox.nativeElement).toHaveCssClass('ng-touched');
       }));
  });
});

@Component({selector: 'test-cmp', template: ''})
class TestComponent {
  changed = false;
  form = new FormGroup({checkbox: new FormControl(null, Validators.requiredTrue)});
  model;
  value = false;
}
