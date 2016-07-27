import {inject, async} from '@angular/core/testing';
import {TestComponentBuilder} from '@angular/compiler/testing';
import {Component} from '@angular/core';

import {NGB_RADIO_DIRECTIVES} from './radio';
import {Control, Validators, FormBuilder} from '@angular/common';


function expectRadios(element: HTMLElement, states: number[]) {
  const labels = element.querySelectorAll('label');
  expect(labels.length).toEqual(states.length);

  for (let i = 0; i < states.length; i++) {
    let state = states[i];

    if (state === 1) {
      expect(labels[i]).toHaveCssClass('active');
    } else if (state === 0) {
      expect(labels[i]).not.toHaveCssClass('active');
    }
  }
}

function getGroupElement(nativeEl: HTMLElement): HTMLDivElement {
  return <HTMLDivElement>nativeEl.querySelector('div[ngbRadioGroup]');
}

function getInput(nativeEl: HTMLElement, idx: number): HTMLInputElement {
  return <HTMLInputElement>nativeEl.querySelectorAll('input')[idx];
}

describe('ngbRadioGroup', () => {
  const defaultHtml = `<div [(ngModel)]="model" ngbRadioGroup>
      <label class="btn">
        <input type="radio" name="radio" [value]="values[0]"/> {{ values[0] }}
      </label>
      <label class="btn">
        <input type="radio" name="radio" [value]="values[1]"/> {{ values[1] }}
      </label>
    </div>`;

  it('toggles radio inputs based on model changes', async(inject([TestComponentBuilder], (tcb) => {
       tcb.overrideTemplate(TestComponent, defaultHtml).createAsync(TestComponent).then((fixture) => {

         let values = fixture.componentInstance.values;

         // checking initial values
         fixture.detectChanges();
         expectRadios(fixture.nativeElement, [0, 0]);
         expect(getInput(fixture.nativeElement, 0).value).toEqual(values[0]);
         expect(getInput(fixture.nativeElement, 1).value).toEqual(values[1]);

         // checking null
         fixture.componentInstance.model = null;
         fixture.detectChanges();
         expectRadios(fixture.nativeElement, [0, 0]);

         // checking first radio
         fixture.componentInstance.model = values[0];
         fixture.detectChanges();
         expectRadios(fixture.nativeElement, [1, 0]);

         // checking second radio
         fixture.componentInstance.model = values[1];
         fixture.detectChanges();
         expectRadios(fixture.nativeElement, [0, 1]);

         // checking non-matching value
         fixture.componentInstance.model = values[3];
         fixture.detectChanges();
         expectRadios(fixture.nativeElement, [0, 0]);
       });
     })));

  it('updates model based on radio input clicks', async(inject([TestComponentBuilder], (tcb) => {
       tcb.overrideTemplate(TestComponent, defaultHtml).createAsync(TestComponent).then((fixture) => {

         fixture.detectChanges();
         expectRadios(fixture.nativeElement, [0, 0]);

         // clicking first radio
         getInput(fixture.nativeElement, 0).click();
         fixture.detectChanges();
         expectRadios(fixture.nativeElement, [1, 0]);
         expect(fixture.componentInstance.model).toBe('one');

         // clicking second radio
         getInput(fixture.nativeElement, 1).click();
         fixture.detectChanges();
         expectRadios(fixture.nativeElement, [0, 1]);
         expect(fixture.componentInstance.model).toBe('two');
       });
     })));

  it('can be used with objects as values', async(inject([TestComponentBuilder], (tcb) => {
       tcb.overrideTemplate(TestComponent, defaultHtml).createAsync(TestComponent).then((fixture) => {

         let [one, two] = [{one: 'one'}, {two: 'two'}];

         fixture.componentInstance.values[0] = one;
         fixture.componentInstance.values[1] = two;

         // checking initial values
         fixture.detectChanges();
         expectRadios(fixture.nativeElement, [0, 0]);
         expect(getInput(fixture.nativeElement, 0).value).toEqual({}.toString());
         expect(getInput(fixture.nativeElement, 1).value).toEqual({}.toString());

         // checking model -> radio input
         fixture.componentInstance.model = one;
         fixture.detectChanges();
         expectRadios(fixture.nativeElement, [1, 0]);

         // checking radio click -> model
         getInput(fixture.nativeElement, 1).click();
         fixture.detectChanges();
         expectRadios(fixture.nativeElement, [0, 1]);
         expect(fixture.componentInstance.model).toBe(two);
       });
     })));

  it('updates radio input values dynamically', async(inject([TestComponentBuilder], (tcb) => {
       tcb.overrideTemplate(TestComponent, defaultHtml).createAsync(TestComponent).then((fixture) => {

         let values = fixture.componentInstance.values;

         // checking first radio
         fixture.componentInstance.model = values[0];
         fixture.detectChanges();
         expectRadios(fixture.nativeElement, [1, 0]);
         expect(fixture.componentInstance.model).toEqual(values[0]);

         // updating first radio value -> expecting none selected
         let initialValue = values[0];
         values[0] = 'ten';
         fixture.detectChanges();
         expectRadios(fixture.nativeElement, [0, 0]);
         expect(getInput(fixture.nativeElement, 0).value).toEqual('ten');
         expect(fixture.componentInstance.model).toEqual(initialValue);

         // updating values back -> expecting initial state
         values[0] = initialValue;
         fixture.detectChanges();
         expectRadios(fixture.nativeElement, [1, 0]);
         expect(getInput(fixture.nativeElement, 0).value).toEqual(values[0]);
         expect(fixture.componentInstance.model).toEqual(values[0]);
       });
     })));

  it('can be used with ngFor', async(inject([TestComponentBuilder], (tcb) => {

       const forHtml = `<div [(ngModel)]="model" ngbRadioGroup>
          <label *ngFor="let v of values" class="btn">
            <input type="radio" name="radio" [value]="v"/> {{ v }}
          </label>
        </div>`;

       tcb.overrideTemplate(TestComponent, forHtml).createAsync(TestComponent).then((fixture) => {

         let values = fixture.componentInstance.values;

         fixture.detectChanges();
         expectRadios(fixture.nativeElement, [0, 0, 0]);

         fixture.componentInstance.model = values[1];
         fixture.detectChanges();
         expectRadios(fixture.nativeElement, [0, 1, 0]);
       });
     })));

  it('cleans up the model when radio inputs are added / removed', async(inject([TestComponentBuilder], (tcb) => {

       const ifHtml = `<div [(ngModel)]="model" ngbRadioGroup>
        <label class="btn">
          <input type="radio" name="radio" [value]="values[0]"/> {{ values[0] }}
        </label>
        <label *ngIf="shown" class="btn">
          <input type="radio" name="radio" [value]="values[1]"/> {{ values[1] }}
        </label>
      </div>`;

       tcb.overrideTemplate(TestComponent, ifHtml).createAsync(TestComponent).then((fixture) => {

         let values = fixture.componentInstance.values;

         // hiding/showing non-selected radio -> expecting initial model value
         fixture.detectChanges();
         expectRadios(fixture.nativeElement, [0, 0]);

         fixture.componentInstance.shown = false;
         fixture.detectChanges();
         expectRadios(fixture.nativeElement, [0]);
         expect(fixture.componentInstance.model).toBeUndefined();

         fixture.componentInstance.shown = true;
         fixture.detectChanges();
         expectRadios(fixture.nativeElement, [0, 0]);
         expect(fixture.componentInstance.model).toBeUndefined();

         // hiding/showing selected radio -> expecting model to unchange, but none selected
         fixture.componentInstance.model = values[1];
         fixture.detectChanges();
         expectRadios(fixture.nativeElement, [0, 1]);

         fixture.componentInstance.shown = false;
         fixture.detectChanges();
         expectRadios(fixture.nativeElement, [0]);
         expect(fixture.componentInstance.model).toEqual(values[1]);

         fixture.componentInstance.shown = true;
         fixture.detectChanges();
         expectRadios(fixture.nativeElement, [0, 1]);
         expect(fixture.componentInstance.model).toEqual(values[1]);
       });
     })));

  it('should add data-toggle="buttons" and "btn-group" CSS class to button group',
     async(inject([TestComponentBuilder], (tcb) => {
       // Bootstrap for uses presence of data-toggle="buttons" to style radio buttons
       const html = `<div class="foo" ngbRadioGroup></div>`;

       tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         expect(fixture.nativeElement.children[0].getAttribute('data-toggle')).toBe('buttons');
         expect(fixture.nativeElement.children[0]).toHaveCssClass('btn-group');
       });
     })));

  it('should work with template-driven form validation', async(inject([TestComponentBuilder], (tcb) => {
       const html = `
        <form>
          <div ngbRadioGroup [(ngModel)]="model" required>
            <label class="btn">
              <input type="radio" value="foo"/>
            </label>          
          </div>
        </form>`;

       tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();
         expect(getGroupElement(fixture.nativeElement)).toHaveCssClass('ng-invalid');
         expect(getGroupElement(fixture.nativeElement)).not.toHaveCssClass('ng-valid');

         getInput(fixture.nativeElement, 0).click();
         fixture.detectChanges();
         expect(getGroupElement(fixture.nativeElement)).toHaveCssClass('ng-valid');
         expect(getGroupElement(fixture.nativeElement)).not.toHaveCssClass('ng-invalid');
       });
     })));

  it('should work with model-driven form validation', async(inject([TestComponentBuilder], (tcb) => {
       const html = `
        <form [ngFormModel]="form">
          <div ngbRadioGroup ngControl="control">
            <label class="btn">
              <input type="radio" value="foo"/>
            </label>          
          </div>
        </form>`;

       tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();
         expect(getGroupElement(fixture.nativeElement)).toHaveCssClass('ng-invalid');
         expect(getGroupElement(fixture.nativeElement)).not.toHaveCssClass('ng-valid');

         getInput(fixture.nativeElement, 0).click();
         fixture.detectChanges();
         expect(getGroupElement(fixture.nativeElement)).toHaveCssClass('ng-valid');
         expect(getGroupElement(fixture.nativeElement)).not.toHaveCssClass('ng-invalid');
       });
     })));
});

@Component({selector: 'test-cmp', directives: [NGB_RADIO_DIRECTIVES], template: ''})
class TestComponent {
  form = this._builder.group({control: new Control('', Validators.required)});

  model;
  values = ['one', 'two', 'three'];
  shown = true;

  constructor(private _builder: FormBuilder) {}
}
