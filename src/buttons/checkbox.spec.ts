import {TestBed, ComponentFixture, async} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {createGenericTestComponent} from '../test/common';

import {Component} from '@angular/core';
import {Validators, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';

import {NgbButtonsModule} from './radio.module';

const createTestComponent = (html: string) =>
  createGenericTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;

function getInput(nativeEl: HTMLElement, idx: number): HTMLInputElement {
  return <HTMLInputElement>nativeEl.querySelectorAll('input')[idx];
}

function getLabel(nativeEl: HTMLElement, idx: number): HTMLElement {
  return <HTMLElement>nativeEl.querySelectorAll('label')[idx];
}


describe('ngbCheckbox', () => {
  const defaultHtml = `<div class="btn-group" data-toggle="buttons">
    <label class="btn btn-primary" [class.active]="values[0]">
      <input type="checkbox" [(ngModel)]="values[0]"> Foo
    </label>
    <label class="btn btn-primary" [class.active]="values[1]">
      <input type="checkbox" [(ngModel)]="values[1]"> Bar
    </label>
  </div>`;


  beforeEach(() => {
    TestBed.configureTestingModule(
      {declarations: [TestComponent], imports: [NgbButtonsModule, FormsModule, ReactiveFormsModule]});
    TestBed.overrideComponent(TestComponent, {set: {template: defaultHtml}});
  });

  it('should add / remove "focus" class on labels', () => {
    const fixture = createTestComponent(`
      <div [(ngModel)]="model" ngbRadioGroup>
        <label class="btn btn-primary" [class.active]="values[0]">
          <input type="checkbox" [(ngModel)]="values[0]"> Foo
        </label>
        <label class="btn btn-primary" [class.active]="values[1]">
          <input type="checkbox" [(ngModel)]="values[1]"> Bar
        </label>
      </div>
    `);
    fixture.detectChanges();

    const inputDebugEls = fixture.debugElement.queryAll(By.css('Input'));

    inputDebugEls[0].triggerEventHandler('focus', {});
    expect(inputDebugEls[0].nativeElement.parentNode).toHaveCssClass('focus');
    expect(inputDebugEls[1].nativeElement.parentNode).not.toHaveCssClass('focus');

    inputDebugEls[0].triggerEventHandler('blur', {});
    inputDebugEls[1].triggerEventHandler('focus', {});
    expect(inputDebugEls[0].nativeElement.parentNode).not.toHaveCssClass('focus');
    expect(inputDebugEls[1].nativeElement.parentNode).toHaveCssClass('focus');
  });

  it('should do nothing when a standalone checkbox button is focused', () => {
    const fixture = createTestComponent(`<input type="checkbox" [(ngModel)]="values[0]"/> Foo`);
    fixture.detectChanges();

    expect(() => { fixture.debugElement.query(By.css('Input')).triggerEventHandler('focus', {}); }).not.toThrow();
  });


  it('should disable label when input is disabled using template forms', () => {
    const html = `
      <form>
          <label class="btn">
            <input type="checkbox" [disabled]="disabled" /> Foo
          </label>          
       </form>`;

    const fixture = createTestComponent(html);

    expect(getLabel(fixture.nativeElement, 0)).toHaveCssClass('disabled');
    expect(getInput(fixture.nativeElement, 0).hasAttribute('disabled')).toBeTruthy();

    fixture.componentInstance.disabled = false;

    fixture.detectChanges();
    expect(getLabel(fixture.nativeElement, 0)).not.toHaveCssClass('disabled');
    expect(getInput(fixture.nativeElement, 0).hasAttribute('disabled')).toBeFalsy();
  });



});

@Component({selector: 'test-cmp', template: ''})
class TestComponent {
  form = new FormGroup({control: new FormControl('', Validators.required)});
  disabledControl = new FormControl({value: '', disabled: true});
  disabledForm = new FormGroup({control: this.disabledControl});

  model;
  values: any = [false, false];
  shown = true;
  disabled = true;
  checked: any;
}
