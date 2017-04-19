import {TestBed, ComponentFixture, async} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {createGenericTestComponent} from '../test/common';

import {Component} from '@angular/core';
import {Validators, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';

import {NgbButtonsModule} from './radio.module';

const createTestComponent = (html: string) =>
    createGenericTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;

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

function getLabel(nativeEl: HTMLElement, idx: number): HTMLElement {
  return <HTMLElement>nativeEl.querySelectorAll('label')[idx];
}

describe('NgbActiveLabel', () => {
  beforeEach(() => {
    TestBed.configureTestingModule(
        {declarations: [TestComponent], imports: [NgbButtonsModule, FormsModule, ReactiveFormsModule]});
  });

  it('should not touch active class on labels not part of a group', () => {
    const fixture = createTestComponent('<label class="btn" [class.active]="true"></label>');
    expect(fixture.nativeElement.children[0]).toHaveCssClass('active');
  });
});

describe('ngbRadioGroup', () => {
  const defaultHtml = `<div [(ngModel)]="model" ngbRadioGroup>
      <label class="btn">
        <input type="radio" name="radio" [value]="values[0]"/> {{ values[0] }}
      </label>
      <label class="btn">
        <input type="radio" name="radio" [value]="values[1]"/> {{ values[1] }}
      </label>
    </div>`;

  beforeEach(() => {
    TestBed.configureTestingModule(
        {declarations: [TestComponent], imports: [NgbButtonsModule, FormsModule, ReactiveFormsModule]});
    TestBed.overrideComponent(TestComponent, {set: {template: defaultHtml}});
  });

  it('toggles radio inputs based on model changes', async(() => {
       const fixture = TestBed.createComponent(TestComponent);

       let values = fixture.componentInstance.values;

       // checking initial values
       fixture.detectChanges();
       expectRadios(fixture.nativeElement, [0, 0]);
       expect(getInput(fixture.nativeElement, 0).value).toEqual(values[0]);
       expect(getInput(fixture.nativeElement, 1).value).toEqual(values[1]);

       // checking null
       fixture.componentInstance.model = null;
       fixture.detectChanges();
       fixture.whenStable()
           .then(() => {
             fixture.detectChanges();
             expectRadios(fixture.nativeElement, [0, 0]);

             // checking first radio
             fixture.componentInstance.model = values[0];
             fixture.detectChanges();
             return fixture.whenStable();
           })
           .then(() => {
             fixture.detectChanges();
             expectRadios(fixture.nativeElement, [1, 0]);

             // checking second radio
             fixture.componentInstance.model = values[1];
             fixture.detectChanges();
             return fixture.whenStable();
           })
           .then(() => {
             fixture.detectChanges();
             expectRadios(fixture.nativeElement, [0, 1]);

             // checking non-matching value
             fixture.componentInstance.model = values[3];
             fixture.detectChanges();
             return fixture.whenStable();
           })
           .then(() => {
             fixture.detectChanges();
             expectRadios(fixture.nativeElement, [0, 0]);
           });
     }));

  it('updates model based on radio input clicks', async(() => {
       const fixture = TestBed.createComponent(TestComponent);

       fixture.detectChanges();
       expectRadios(fixture.nativeElement, [0, 0]);

       fixture.whenStable()
           .then(() => {
             // clicking first radio
             getInput(fixture.nativeElement, 0).click();
             fixture.detectChanges();
             expectRadios(fixture.nativeElement, [1, 0]);
             expect(fixture.componentInstance.model).toBe('one');
             return fixture.whenStable();
           })
           .then(() => {
             // clicking second radio
             getInput(fixture.nativeElement, 1).click();
             fixture.detectChanges();
             expectRadios(fixture.nativeElement, [0, 1]);
             expect(fixture.componentInstance.model).toBe('two');
           });
     }));

  it('can be used with objects as values', async(() => {
       const fixture = TestBed.createComponent(TestComponent);

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
       fixture.whenStable().then(() => {
         fixture.detectChanges();
         expectRadios(fixture.nativeElement, [1, 0]);

         // checking radio click -> model
         getInput(fixture.nativeElement, 1).click();
         fixture.detectChanges();
         expectRadios(fixture.nativeElement, [0, 1]);
         expect(fixture.componentInstance.model).toBe(two);
       });
     }));

  it('updates radio input values dynamically', async(() => {
       const fixture = TestBed.createComponent(TestComponent);

       let values = fixture.componentInstance.values;

       // checking first radio
       fixture.componentInstance.model = values[0];
       fixture.detectChanges();
       fixture.whenStable().then(() => {
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
     }));

  it('can be used with ngFor', async(() => {

       const forHtml = `<div [(ngModel)]="model" ngbRadioGroup>
          <label *ngFor="let v of values" class="btn">
            <input type="radio" name="radio" [value]="v"/> {{ v }}
          </label>
        </div>`;

       const fixture = createTestComponent(forHtml);
       let values = fixture.componentInstance.values;

       expectRadios(fixture.nativeElement, [0, 0, 0]);

       fixture.componentInstance.model = values[1];
       fixture.detectChanges();
       fixture.whenStable().then(() => {
         fixture.detectChanges();
         expectRadios(fixture.nativeElement, [0, 1, 0]);
       });
     }));

  it('cleans up the model when radio inputs are added / removed', async(() => {

       const ifHtml = `<div [(ngModel)]="model" ngbRadioGroup>
        <label class="btn">
          <input type="radio" name="radio" [value]="values[0]"/> {{ values[0] }}
        </label>
        <label *ngIf="shown" class="btn">
          <input type="radio" name="radio" [value]="values[1]"/> {{ values[1] }}
        </label>
      </div>`;
       const fixture = createTestComponent(ifHtml);

       let values = fixture.componentInstance.values;

       // hiding/showing non-selected radio -> expecting initial model value
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
       fixture.whenStable().then(() => {
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
     }));

  it('should add data-toggle="buttons" and "btn-group" CSS class to button group', () => {
    // Bootstrap for uses presence of data-toggle="buttons" to style radio buttons
    const html = `<div class="foo" ngbRadioGroup></div>`;

    const fixture = createTestComponent(html);

    expect(fixture.nativeElement.children[0].getAttribute('data-toggle')).toBe('buttons');
    expect(fixture.nativeElement.children[0]).toHaveCssClass('btn-group');
  });

  it('should work with template-driven form validation', async(() => {
       const html = `
        <form>
          <div ngbRadioGroup [(ngModel)]="model" name="control" required>
            <label class="btn">
              <input type="radio" value="foo"/>
            </label>          
          </div>
        </form>`;

       const fixture = createTestComponent(html);

       fixture.whenStable().then(() => {
         fixture.detectChanges();
         expect(getGroupElement(fixture.nativeElement)).toHaveCssClass('ng-invalid');
         expect(getGroupElement(fixture.nativeElement)).not.toHaveCssClass('ng-valid');

         getInput(fixture.nativeElement, 0).click();
         fixture.detectChanges();
         expect(getGroupElement(fixture.nativeElement)).toHaveCssClass('ng-valid');
         expect(getGroupElement(fixture.nativeElement)).not.toHaveCssClass('ng-invalid');
       });
     }));

  it('should work with model-driven form validation', () => {
    const html = `
        <form [formGroup]="form">
          <div ngbRadioGroup formControlName="control">
            <label class="btn">
              <input type="radio" value="foo"/>
            </label>          
          </div>
        </form>`;

    const fixture = createTestComponent(html);

    expect(getGroupElement(fixture.nativeElement)).toHaveCssClass('ng-invalid');
    expect(getGroupElement(fixture.nativeElement)).not.toHaveCssClass('ng-valid');

    getInput(fixture.nativeElement, 0).click();
    fixture.detectChanges();
    expect(getGroupElement(fixture.nativeElement)).toHaveCssClass('ng-valid');
    expect(getGroupElement(fixture.nativeElement)).not.toHaveCssClass('ng-invalid');
  });

  it('should disable label and input when it is disabled using reactive forms', () => {
    const html = `
      <form [formGroup]="disabledForm">
        <div ngbRadioGroup formControlName="control">
          <label class="btn">
            <input type="radio" value="foo"/>
          </label>          
        </div>
      </form>`;

    const fixture = createTestComponent(html);

    expect(getLabel(fixture.nativeElement, 0)).toHaveCssClass('disabled');
    expect(getInput(fixture.nativeElement, 0).hasAttribute('disabled')).toBeTruthy();

    fixture.componentInstance.disabledControl.enable();
    fixture.detectChanges();
    expect(getLabel(fixture.nativeElement, 0)).not.toHaveCssClass('disabled');
    expect(getInput(fixture.nativeElement, 0).hasAttribute('disabled')).toBeFalsy();
  });

  it('should disable label and input when it is disabled using template-driven forms', async(() => {
       const html = `
      <form>
        <div ngbRadioGroup [(ngModel)]="model" name="control" [disabled]="disabled">
          <label class="btn">
            <input type="radio" value="foo"/>
          </label>          
        </div>
      </form>`;

       const fixture = createTestComponent(html);

       fixture.whenStable()
           .then(() => {
             fixture.detectChanges();
             expect(getLabel(fixture.nativeElement, 0)).toHaveCssClass('disabled');
             expect(getInput(fixture.nativeElement, 0).hasAttribute('disabled')).toBeTruthy();

             fixture.componentInstance.disabled = false;
             fixture.detectChanges();
             return fixture.whenStable();
           })
           .then(() => {
             fixture.detectChanges();
             expect(getLabel(fixture.nativeElement, 0)).not.toHaveCssClass('disabled');
             expect(getInput(fixture.nativeElement, 0).hasAttribute('disabled')).toBeFalsy();
           });
     }));

  it('should disable individual label and input using template-driven forms', async(() => {
       const html = `
      <form>
        <div ngbRadioGroup [(ngModel)]="model" name="control">
          <label class="btn">
            <input type="radio" value="foo" [disabled]="disabled"/>
          </label>          
        </div>
      </form>`;

       const fixture = createTestComponent(html);

       fixture.whenStable()
           .then(() => {
             fixture.componentInstance.disabled = true;
             fixture.detectChanges();
             expect(getLabel(fixture.nativeElement, 0)).toHaveCssClass('disabled');
             expect(getInput(fixture.nativeElement, 0).hasAttribute('disabled')).toBeTruthy();

             fixture.componentInstance.disabled = false;
             fixture.detectChanges();
             return fixture.whenStable();
           })
           .then(() => {
             fixture.detectChanges();
             expect(getLabel(fixture.nativeElement, 0)).not.toHaveCssClass('disabled');
             expect(getInput(fixture.nativeElement, 0).hasAttribute('disabled')).toBeFalsy();
           });
     }));

  it('disable all radio buttons when group is disabled regardless of button disabled state', async(() => {
       const html = `
      <form>
        <div ngbRadioGroup [(ngModel)]="model" name="control" [disabled]="groupDisabled">
          <label class="btn">
            <input type="radio" value="foo" [disabled]="disabled"/>
          </label>          
        </div>
      </form>`;

       const fixture = createTestComponent(html);

       fixture.whenStable()
           .then(() => {
             expect(getLabel(fixture.nativeElement, 0)).toHaveCssClass('disabled');
             expect(getInput(fixture.nativeElement, 0).hasAttribute('disabled')).toBeTruthy();

             fixture.componentInstance.disabled = false;
             fixture.detectChanges();
             return fixture.whenStable();
           })
           .then(() => {
             fixture.detectChanges();
             expect(getLabel(fixture.nativeElement, 0)).toHaveCssClass('disabled');
             expect(getInput(fixture.nativeElement, 0).hasAttribute('disabled')).toBeTruthy();
           });
     }));

  it('button stays disabled when group is enabled', async(() => {
       const html = `
      <form>
        <div ngbRadioGroup [(ngModel)]="model" name="control" [disabled]="groupDisabled">
          <label class="btn">
            <input type="radio" value="foo" [disabled]="disabled"/>
          </label>          
        </div>
      </form>`;

       const fixture = createTestComponent(html);

       fixture.whenStable()
           .then(() => {
             expect(getLabel(fixture.nativeElement, 0)).toHaveCssClass('disabled');
             expect(getInput(fixture.nativeElement, 0).hasAttribute('disabled')).toBeTruthy();

             fixture.componentInstance.groupDisabled = false;
             fixture.detectChanges();
             return fixture.whenStable();
           })
           .then(() => {
             fixture.detectChanges();
             expect(getLabel(fixture.nativeElement, 0)).toHaveCssClass('disabled');
             expect(getInput(fixture.nativeElement, 0).hasAttribute('disabled')).toBeTruthy();
           });
     }));

  it('should select a radio button when checked attribute is used', () => {
    const html1 = `
      <input type="radio" name="State" value="0" /> Foo <br>
      <input type="radio" name="State" [value]="1" checked /> Foo Foo <br>`;

    const fixture = createTestComponent(html1);
    // checking initial values
    fixture.detectChanges();

    expect(getInput(fixture.nativeElement, 0).checked).toBeFalsy();
    expect(getInput(fixture.nativeElement, 1).checked).toBeTruthy();
  });

  it('should select a radio button when checked attribute with value is used', () => {
    const html1 = `
      <input type="radio" name="State" value="0" checked="checked"/> Foo <br>
      <input type="radio" name="State" [value]="1"  /> Foo Foo <br>`;

    const fixture = createTestComponent(html1);
    // checking initial values
    fixture.detectChanges();

    expect(getInput(fixture.nativeElement, 0).checked).toBeTruthy();
    expect(getInput(fixture.nativeElement, 1).checked).toBeFalsy();

  });

  it('should disable a radio button when disabled attribute is used', () => {
    const html1 = `
      <input type="radio" name="State" value="0" /> Foo <br>
      <input type="radio" name="State" [value]="1" disabled /> Foo Foo <br>`;

    const fixture = createTestComponent(html1);
    // checking initial values
    fixture.detectChanges();

    expect(getInput(fixture.nativeElement, 0).disabled).toBeFalsy();
    expect(getInput(fixture.nativeElement, 1).disabled).toBeTruthy();
  });

  it('should disable a radio button when disabled attribute with value is used', () => {
    const html1 = `
      <input type="radio" name="State" value="0" disabled="disabled"/> Foo <br>
      <input type="radio" name="State" [value]="1"  /> Foo Foo <br>`;

    const fixture = createTestComponent(html1);
    // checking initial values
    fixture.detectChanges();

    expect(getInput(fixture.nativeElement, 0).disabled).toBeTruthy();
    expect(getInput(fixture.nativeElement, 1).disabled).toBeFalsy();
  });

  it('handle multiple cases for binded checked attribute.', () => {
    const html1 = `
      <input type="radio" name="State" value="0" [checked]="checked"/> Foo <br>
      <input type="radio" name="State" [value]="1" /> Foo Foo <br>`;

    const fixture = createTestComponent(html1);

    // checking initial values which is undefined
    fixture.detectChanges();
    expect(getInput(fixture.nativeElement, 0).checked).toBeFalsy();
    expect(getInput(fixture.nativeElement, 1).checked).toBeFalsy();

    // put checked to false
    fixture.componentInstance.checked = false;
    fixture.detectChanges();
    expect(getInput(fixture.nativeElement, 0).checked).toBeFalsy();
    expect(getInput(fixture.nativeElement, 1).checked).toBeFalsy();

    // put checked to null
    fixture.componentInstance.checked = null;
    fixture.detectChanges();
    expect(getInput(fixture.nativeElement, 0).checked).toBeFalsy();
    expect(getInput(fixture.nativeElement, 1).checked).toBeFalsy();

    // put checked to empty string
    fixture.componentInstance.checked = '';
    fixture.detectChanges();
    expect(getInput(fixture.nativeElement, 0).checked).toBeFalsy();
    expect(getInput(fixture.nativeElement, 1).checked).toBeFalsy();

    // put checked to a string value
    fixture.componentInstance.checked = 'false';
    fixture.detectChanges();
    // it should be true, anything else than "" is true
    expect(getInput(fixture.nativeElement, 0).checked).toBeTruthy();
    expect(getInput(fixture.nativeElement, 1).checked).toBeFalsy();

  });

  it('should add / remove "focus" class on labels', () => {
    const fixture = createTestComponent(`
      <div [(ngModel)]="model" ngbRadioGroup>
        <label class="btn">
          <input type="radio" name="radio" [value]="values[0]"/> {{ values[0] }}
        </label>
        <label class="btn">
          <input type="radio" name="radio" [value]="values[1]"/> {{ values[1] }}
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

  it('should do nothing when a standalone radio button is focused', () => {
    const fixture = createTestComponent(`<input type="radio" name="state" value="0"/> Foo <br>`);
    fixture.detectChanges();

    expect(() => { fixture.debugElement.query(By.css('Input')).triggerEventHandler('focus', {}); }).not.toThrow();
  });

  describe('accessibility', () => {
    it('should have "group" role', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();

      expect(getGroupElement(fixture.nativeElement).getAttribute('role')).toBe('group');
    });
  });
});

@Component({selector: 'test-cmp', template: ''})
class TestComponent {
  form = new FormGroup({control: new FormControl('', Validators.required)});
  disabledControl = new FormControl({value: '', disabled: true});
  disabledForm = new FormGroup({control: this.disabledControl});

  model;
  values: any = ['one', 'two', 'three'];
  shown = true;
  disabled = true;
  groupDisabled = true;
  checked: any;
}
