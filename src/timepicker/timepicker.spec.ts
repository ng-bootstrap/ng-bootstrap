import {Component} from '@angular/core';

import {TestBed, ComponentFixture} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

import {Validators, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';

import {NgbTimepickerModule} from './index';

function getTimepicker(el: HTMLElement) {
  return el.querySelector('ngb-timepicker');
}

function getInputs(el: HTMLElement) {
  return el.querySelectorAll('input');
}

function getButtons(nativeEl: HTMLElement) {
  return nativeEl.querySelectorAll('button.btn-link');
}

function getFieldsetElement(element: HTMLElement): HTMLFieldSetElement {
  return <HTMLFieldSetElement>element.querySelector('fieldset');
}

function getMeridianButton(nativeEl: HTMLElement) {
  return nativeEl.querySelector('button.btn-outline-primary');
}

function createChangeEvent(value: string) {
  return {target: {value: value}};
}

function expectToDisplayTime(el: HTMLElement, time: string) {
  const inputs = getInputs(el);
  const timeParts = time.split(':');
  let timeInInputs = [];

  expect(inputs.length).toBe(timeParts.length);

  for (let i = 0; i < inputs.length; i++) {
    timeInInputs.push((<HTMLInputElement>inputs[i]).value);
  }

  expect(timeInInputs.join(':')).toBe(time);
}

function createTestComponent(html: string): ComponentFixture<TestComponent> {
  TestBed.overrideComponent(TestComponent, {set: {template: html}});
  const fixture = TestBed.createComponent(TestComponent);
  fixture.detectChanges();
  return fixture;
}

describe('ngb-timepicker', () => {

  beforeEach(() => {
    TestBed.configureTestingModule(
        {declarations: [TestComponent], imports: [NgbTimepickerModule, FormsModule, ReactiveFormsModule]});
  });

  describe('rendering based on model', () => {

    // TODO: remove 'whenStable' once 'core/testing' is fixed
    it('should render hour and minute inputs', () => {
      const html = `<ngb-timepicker [ngModel]="model"></ngb-timepicker>`;

      const fixture = createTestComponent(html);
      fixture.componentInstance.model = {hour: 13, minute: 30};
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => { expectToDisplayTime(fixture.nativeElement, '13:30'); });
      });
    });

    // TODO: remove 'whenStable' once 'core/testing' is fixed
    it('should update inputs value on model change', () => {
      const html = `<ngb-timepicker [ngModel]="model"></ngb-timepicker>`;

      const fixture = createTestComponent(html);
      fixture.componentInstance.model = {hour: 13, minute: 30};
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          expectToDisplayTime(fixture.nativeElement, '13:30');

          fixture.componentInstance.model = {hour: 14, minute: 40};
          fixture.detectChanges();
          fixture.whenStable().then(() => {
            fixture.detectChanges();
            fixture.whenStable().then(() => { expectToDisplayTime(fixture.nativeElement, '14:40'); });
          });
        });
      });
    });

    // TODO: remove 'whenStable' once 'core/testing' is fixed
    it('should render hour and minute inputs with padding', () => {
      const html = `<ngb-timepicker [ngModel]="model"></ngb-timepicker>`;

      const fixture = createTestComponent(html);
      fixture.componentInstance.model = {hour: 1, minute: 3};
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => { expectToDisplayTime(fixture.nativeElement, '01:03'); });
      });
    });

    // TODO: remove 'whenStable' once 'core/testing' is fixed
    it('should render hour, minute and seconds inputs with padding', () => {
      const html = `<ngb-timepicker [ngModel]="model" [seconds]="true"></ngb-timepicker>`;

      const fixture = createTestComponent(html);
      fixture.componentInstance.model = {hour: 10, minute: 3, second: 4};
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => { expectToDisplayTime(fixture.nativeElement, '10:03:04'); });
      });
    });

    // TODO: remove 'whenStable' once 'core/testing' is fixed
    it('should render invalid or empty hour and minute as blank string', () => {
      const html = `<ngb-timepicker [ngModel]="model"></ngb-timepicker>`;

      const fixture = createTestComponent(html);
      fixture.componentInstance.model = {hour: undefined, minute: 'aaa'};
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => { expectToDisplayTime(fixture.nativeElement, ':'); });
      });
    });

    // TODO: remove 'whenStable' once 'core/testing' is fixed
    it('should render invalid or empty second as blank string', () => {
      const html = `<ngb-timepicker [ngModel]="model" [seconds]="true"></ngb-timepicker>`;

      const fixture = createTestComponent(html);
      fixture.componentInstance.model = {hour: 10, minute: 20, second: false};
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => { expectToDisplayTime(fixture.nativeElement, '10:20:'); });
      });
    });

    // TODO: remove 'whenStable' once 'core/testing' is fixed
    it('should render empty fields on null model', () => {
      const html = `<ngb-timepicker [ngModel]="model" [seconds]="true"></ngb-timepicker>`;

      const fixture = createTestComponent(html);
      fixture.componentInstance.model = null;
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => { expectToDisplayTime(fixture.nativeElement, '::'); });
      });
    });
  });


  describe('model updates in response to increment / decrement button clicks', () => {

    // TODO: remove 'whenStable' once 'core/testing' is fixed
    it('should increment / decrement hours', () => {
      const html = `<ngb-timepicker [(ngModel)]="model"></ngb-timepicker>`;

      const fixture = createTestComponent(html);
      fixture.componentInstance.model = {hour: 10, minute: 30, second: 0};
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {

          const buttons = getButtons(fixture.nativeElement);

          expectToDisplayTime(fixture.nativeElement, '10:30');
          expect(fixture.componentInstance.model).toEqual({hour: 10, minute: 30, second: 0});

          (<HTMLButtonElement>buttons[0]).click();  // H+
          fixture.detectChanges();
          expectToDisplayTime(fixture.nativeElement, '11:30');
          expect(fixture.componentInstance.model).toEqual({hour: 11, minute: 30, second: 0});


          (<HTMLButtonElement>buttons[2]).click();  // H-
          fixture.detectChanges();
          expectToDisplayTime(fixture.nativeElement, '10:30');
          expect(fixture.componentInstance.model).toEqual({hour: 10, minute: 30, second: 0});
        });
      });
    });

    // TODO: remove 'whenStable' once 'core/testing' is fixed
    it('should wrap hours', () => {
      const html = `<ngb-timepicker [(ngModel)]="model"></ngb-timepicker>`;

      const fixture = createTestComponent(html);
      fixture.componentInstance.model = {hour: 23, minute: 30, second: 0};
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {

          const buttons = getButtons(fixture.nativeElement);

          expectToDisplayTime(fixture.nativeElement, '23:30');
          expect(fixture.componentInstance.model).toEqual({hour: 23, minute: 30, second: 0});

          (<HTMLButtonElement>buttons[0]).click();  // H+
          fixture.detectChanges();
          expectToDisplayTime(fixture.nativeElement, '00:30');
          expect(fixture.componentInstance.model).toEqual({hour: 0, minute: 30, second: 0});

          (<HTMLButtonElement>buttons[2]).click();  // H-
          fixture.detectChanges();
          expectToDisplayTime(fixture.nativeElement, '23:30');
          expect(fixture.componentInstance.model).toEqual({hour: 23, minute: 30, second: 0});
        });
      });
    });

    // TODO: remove 'whenStable' once 'core/testing' is fixed
    it('should increment / decrement minutes', () => {
      const html = `<ngb-timepicker [(ngModel)]="model"></ngb-timepicker>`;

      const fixture = createTestComponent(html);
      fixture.componentInstance.model = {hour: 10, minute: 30, second: 0};
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {

          const buttons = getButtons(fixture.nativeElement);

          expectToDisplayTime(fixture.nativeElement, '10:30');
          expect(fixture.componentInstance.model).toEqual({hour: 10, minute: 30, second: 0});

          (<HTMLButtonElement>buttons[1]).click();  // M+
          fixture.detectChanges();
          expectToDisplayTime(fixture.nativeElement, '10:31');
          expect(fixture.componentInstance.model).toEqual({hour: 10, minute: 31, second: 0});

          (<HTMLButtonElement>buttons[3]).click();  // M-
          fixture.detectChanges();
          expectToDisplayTime(fixture.nativeElement, '10:30');
          expect(fixture.componentInstance.model).toEqual({hour: 10, minute: 30, second: 0});
        });
      });
    });

    // TODO: remove 'whenStable' once 'core/testing' is fixed
    it('should wrap minutes', () => {
      const html = `<ngb-timepicker [(ngModel)]="model"></ngb-timepicker>`;

      const fixture = createTestComponent(html);
      fixture.componentInstance.model = {hour: 22, minute: 59, second: 0};
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          const buttons = getButtons(fixture.nativeElement);

          expectToDisplayTime(fixture.nativeElement, '22:59');
          expect(fixture.componentInstance.model).toEqual({hour: 22, minute: 59, second: 0});

          (<HTMLButtonElement>buttons[1]).click();  // M+
          fixture.detectChanges();
          expect(fixture.componentInstance.model).toEqual({hour: 23, minute: 0, second: 0});

          (<HTMLButtonElement>buttons[3]).click();  // M-
          fixture.detectChanges();
          expectToDisplayTime(fixture.nativeElement, '22:59');
          expect(fixture.componentInstance.model).toEqual({hour: 22, minute: 59, second: 0});
        });
      });
    });

    // TODO: remove 'whenStable' once 'core/testing' is fixed
    it('should increment / decrement seconds', () => {
      const html = `<ngb-timepicker [(ngModel)]="model" [seconds]="true"></ngb-timepicker>`;

      const fixture = createTestComponent(html);
      fixture.componentInstance.model = {hour: 10, minute: 30, second: 0};
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          const buttons = getButtons(fixture.nativeElement);

          expectToDisplayTime(fixture.nativeElement, '10:30:00');
          expect(fixture.componentInstance.model).toEqual({hour: 10, minute: 30, second: 0});

          (<HTMLButtonElement>buttons[2]).click();  // S+
          fixture.detectChanges();
          expectToDisplayTime(fixture.nativeElement, '10:30:01');
          expect(fixture.componentInstance.model).toEqual({hour: 10, minute: 30, second: 1});

          (<HTMLButtonElement>buttons[5]).click();  // S-
          fixture.detectChanges();
          expectToDisplayTime(fixture.nativeElement, '10:30:00');
          expect(fixture.componentInstance.model).toEqual({hour: 10, minute: 30, second: 0});
        });
      });
    });

    // TODO: remove 'whenStable' once 'core/testing' is fixed
    it('should wrap seconds', () => {
      const html = `<ngb-timepicker [(ngModel)]="model" [seconds]="true"></ngb-timepicker>`;

      const fixture = createTestComponent(html);
      fixture.componentInstance.model = {hour: 10, minute: 30, second: 59};
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {

          const buttons = getButtons(fixture.nativeElement);

          expectToDisplayTime(fixture.nativeElement, '10:30:59');
          expect(fixture.componentInstance.model).toEqual({hour: 10, minute: 30, second: 59});

          (<HTMLButtonElement>buttons[2]).click();  // S+
          fixture.detectChanges();
          expectToDisplayTime(fixture.nativeElement, '10:31:00');
          expect(fixture.componentInstance.model).toEqual({hour: 10, minute: 31, second: 0});

          (<HTMLButtonElement>buttons[5]).click();  // S-
          fixture.detectChanges();
          expectToDisplayTime(fixture.nativeElement, '10:30:59');
          expect(fixture.componentInstance.model).toEqual({hour: 10, minute: 30, second: 59});
        });
      });
    });
  });

  describe('model updates in response to input field changes', () => {

    // TODO: remove 'whenStable' once 'core/testing' is fixed
    it('should update hours', () => {
      const html = `<ngb-timepicker [(ngModel)]="model"></ngb-timepicker>`;

      const fixture = createTestComponent(html);
      fixture.componentInstance.model = {hour: 10, minute: 30, second: 0};
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {

          const inputs = fixture.debugElement.queryAll(By.css('input'));

          expectToDisplayTime(fixture.nativeElement, '10:30');
          expect(fixture.componentInstance.model).toEqual({hour: 10, minute: 30, second: 0});

          inputs[0].triggerEventHandler('change', createChangeEvent('11'));
          fixture.detectChanges();
          expectToDisplayTime(fixture.nativeElement, '11:30');
          expect(fixture.componentInstance.model).toEqual({hour: 11, minute: 30, second: 0});

          inputs[0].triggerEventHandler('change', createChangeEvent(`${24 + 11}`));
          fixture.detectChanges();
          expectToDisplayTime(fixture.nativeElement, '11:30');
          expect(fixture.componentInstance.model).toEqual({hour: 11, minute: 30, second: 0});

          inputs[0].triggerEventHandler('change', createChangeEvent('aa'));
          fixture.detectChanges();
          expectToDisplayTime(fixture.nativeElement, ':30');
          expect(fixture.componentInstance.model).toEqual(null);
        });
      });
    });

    // TODO: remove 'whenStable' once 'core/testing' is fixed
    it('should update minutes', () => {
      const html = `<ngb-timepicker [(ngModel)]="model"></ngb-timepicker>`;

      const fixture = createTestComponent(html);
      fixture.componentInstance.model = {hour: 10, minute: 30, second: 0};
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {

          const inputs = fixture.debugElement.queryAll(By.css('input'));

          expectToDisplayTime(fixture.nativeElement, '10:30');
          expect(fixture.componentInstance.model).toEqual({hour: 10, minute: 30, second: 0});

          inputs[1].triggerEventHandler('change', createChangeEvent('40'));
          fixture.detectChanges();
          expectToDisplayTime(fixture.nativeElement, '10:40');
          expect(fixture.componentInstance.model).toEqual({hour: 10, minute: 40, second: 0});

          inputs[1].triggerEventHandler('change', createChangeEvent('70'));
          fixture.detectChanges();
          expectToDisplayTime(fixture.nativeElement, '11:10');
          expect(fixture.componentInstance.model).toEqual({hour: 11, minute: 10, second: 0});

          inputs[1].triggerEventHandler('change', createChangeEvent('aa'));
          fixture.detectChanges();
          expectToDisplayTime(fixture.nativeElement, '11:');
          expect(fixture.componentInstance.model).toEqual(null);
        });
      });
    });

    // TODO: remove 'whenStable' once 'core/testing' is fixed
    it('should update seconds', () => {
      const html = `<ngb-timepicker [(ngModel)]="model" [seconds]="true"></ngb-timepicker>`;

      const fixture = createTestComponent(html);
      fixture.componentInstance.model = {hour: 10, minute: 30, second: 0};
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {

          const inputs = fixture.debugElement.queryAll(By.css('input'));

          expectToDisplayTime(fixture.nativeElement, '10:30:00');
          expect(fixture.componentInstance.model).toEqual({hour: 10, minute: 30, second: 0});

          inputs[2].triggerEventHandler('change', createChangeEvent('40'));
          fixture.detectChanges();
          expectToDisplayTime(fixture.nativeElement, '10:30:40');
          expect(fixture.componentInstance.model).toEqual({hour: 10, minute: 30, second: 40});

          inputs[2].triggerEventHandler('change', createChangeEvent('70'));
          fixture.detectChanges();
          expectToDisplayTime(fixture.nativeElement, '10:31:10');
          expect(fixture.componentInstance.model).toEqual({hour: 10, minute: 31, second: 10});

          inputs[2].triggerEventHandler('change', createChangeEvent('aa'));
          fixture.detectChanges();
          expectToDisplayTime(fixture.nativeElement, '10:31:');
          expect(fixture.componentInstance.model).toEqual(null);
        });
      });
    });
  });

  describe('meridian', () => {

    // TODO: remove 'whenStable' once 'core/testing' is fixed
    it('should render meridian button with proper value', () => {
      const html = `<ngb-timepicker [(ngModel)]="model" [seconds]="true" [meridian]="true"></ngb-timepicker>`;

      const fixture = createTestComponent(html);
      fixture.componentInstance.model = {hour: 13, minute: 30, second: 0};
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {

          const meridianButton = getMeridianButton(fixture.nativeElement);

          expectToDisplayTime(fixture.nativeElement, '01:30:00');
          expect(meridianButton.innerHTML).toBe('PM');

          fixture.componentInstance.model = {hour: 1, minute: 30, second: 0};
          fixture.detectChanges();
          fixture.whenStable().then(() => {
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              expectToDisplayTime(fixture.nativeElement, '01:30:00');
              expect(meridianButton.innerHTML).toBe('AM');
            });
          });
        });
      });
    });

    // TODO: remove 'whenStable' once 'core/testing' is fixed
    it('should update model on meridian click', () => {
      const html = `<ngb-timepicker [(ngModel)]="model" [seconds]="true" [meridian]="true"></ngb-timepicker>`;

      const fixture = createTestComponent(html);
      fixture.componentInstance.model = {hour: 13, minute: 30, second: 0};
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {

          const meridianButton = <HTMLButtonElement>getMeridianButton(fixture.nativeElement);

          expectToDisplayTime(fixture.nativeElement, '01:30:00');
          expect(meridianButton.innerHTML).toBe('PM');

          meridianButton.click();
          fixture.detectChanges();
          fixture.whenStable().then(() => {
            expectToDisplayTime(fixture.nativeElement, '01:30:00');
            expect(fixture.componentInstance.model).toEqual({hour: 1, minute: 30, second: 0});
            expect(meridianButton.innerHTML).toBe('AM');
          });
        });
      });
    });
  });

  describe('forms', () => {

    // TODO: remove 'whenStable' once 'core/testing' is fixed
    it('should work with template-driven form validation', () => {
      const html = `
          <form>
            <ngb-timepicker [(ngModel)]="model" name="control" required></ngb-timepicker>
          </form>`;

      const fixture = createTestComponent(html);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          const compiled = fixture.nativeElement;

          expect(getTimepicker(compiled)).toHaveCssClass('ng-invalid');
          expect(getTimepicker(compiled)).not.toHaveCssClass('ng-valid');

          fixture.componentInstance.model = {hour: 12, minute: 0, second: 0};
          fixture.detectChanges();
          fixture.whenStable().then(() => {
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              expect(getTimepicker(compiled)).toHaveCssClass('ng-valid');
              expect(getTimepicker(compiled)).not.toHaveCssClass('ng-invalid');
            });
          });
        });
      });
    });

    // TODO: remove 'whenStable' once 'core/testing' is fixed
    it('should work with model-driven form validation', () => {
      const html = `
          <form [formGroup]="form">
            <ngb-timepicker formControlName="control" required></ngb-timepicker>
          </form>`;

      const fixture = createTestComponent(html);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const compiled = fixture.nativeElement;
        const inputs = fixture.debugElement.queryAll(By.css('input'));

        expect(getTimepicker(compiled)).toHaveCssClass('ng-invalid');
        expect(getTimepicker(compiled)).not.toHaveCssClass('ng-valid');

        inputs[0].triggerEventHandler('change', createChangeEvent('12'));
        inputs[1].triggerEventHandler('change', createChangeEvent('15'));
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          expect(getTimepicker(compiled)).toHaveCssClass('ng-valid');
          expect(getTimepicker(compiled)).not.toHaveCssClass('ng-invalid');
        });
      });
    });

    it('should propagate model changes only if valid - no seconds', () => {
      const html = `<ngb-timepicker [(ngModel)]="model"></ngb-timepicker>`;

      const fixture = createTestComponent(html);
      fixture.componentInstance.model = {hour: 12, minute: 0};
      fixture.detectChanges();

      const inputs = fixture.debugElement.queryAll(By.css('input'));
      inputs[0].triggerEventHandler('change', createChangeEvent('aa'));
      fixture.detectChanges();

      expect(fixture.componentInstance.model).toBeNull();
    });

    it('should propagate model changes only if valid - with seconds', () => {
      const html = `<ngb-timepicker [(ngModel)]="model" [seconds]="true"></ngb-timepicker>`;

      const fixture = createTestComponent(html);
      fixture.componentInstance.model = {hour: 12, minute: 0, second: 0};
      fixture.detectChanges();

      const inputs = fixture.debugElement.queryAll(By.css('input'));
      inputs[2].triggerEventHandler('change', createChangeEvent('aa'));
      fixture.detectChanges();

      expect(fixture.componentInstance.model).toBeNull();
    });
  });

  describe('disabled', () => {

    // TODO: remove 'whenStable' once 'core/testing' is fixed
    it('should not change the value on button click, when it is disabled', () => {
      const html = `<ngb-timepicker [(ngModel)]="model" [seconds]="true" [disabled]="disabled"></ngb-timepicker>`;

      const fixture = createTestComponent(html);
      fixture.componentInstance.model = {hour: 13, minute: 30, second: 0};
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {

          const buttons = getButtons(fixture.nativeElement);

          expectToDisplayTime(fixture.nativeElement, '13:30:00');
          expect(fixture.componentInstance.model).toEqual({hour: 13, minute: 30, second: 0});

          (<HTMLButtonElement>buttons[0]).click();  // H+
          fixture.detectChanges();
          expectToDisplayTime(fixture.nativeElement, '13:30:00');
          expect(fixture.componentInstance.model).toEqual({hour: 13, minute: 30, second: 0});

          (<HTMLButtonElement>buttons[3]).click();  // H-
          fixture.detectChanges();
          expectToDisplayTime(fixture.nativeElement, '13:30:00');
          expect(fixture.componentInstance.model).toEqual({hour: 13, minute: 30, second: 0});

          (<HTMLButtonElement>buttons[1]).click();  // M+
          fixture.detectChanges();
          expectToDisplayTime(fixture.nativeElement, '13:30:00');
          expect(fixture.componentInstance.model).toEqual({hour: 13, minute: 30, second: 0});

          (<HTMLButtonElement>buttons[4]).click();  // M-
          fixture.detectChanges();
          expectToDisplayTime(fixture.nativeElement, '13:30:00');
          expect(fixture.componentInstance.model).toEqual({hour: 13, minute: 30, second: 0});

          (<HTMLButtonElement>buttons[2]).click();  // S+
          fixture.detectChanges();
          expectToDisplayTime(fixture.nativeElement, '13:30:00');
          expect(fixture.componentInstance.model).toEqual({hour: 13, minute: 30, second: 0});

          (<HTMLButtonElement>buttons[5]).click();  // S-
          fixture.detectChanges();
          expectToDisplayTime(fixture.nativeElement, '13:30:00');
          expect(fixture.componentInstance.model).toEqual({hour: 13, minute: 30, second: 0});
        });
      });
    });

    it('should have disabled class, when it is disabled', () => {
      const html = `<ngb-timepicker [(ngModel)]="model" [seconds]="true" [disabled]="disabled"></ngb-timepicker>`;

      const fixture = createTestComponent(html);
      fixture.detectChanges();

      let fieldset = getFieldsetElement(fixture.nativeElement);
      expect(fieldset.hasAttribute('disabled')).toBeTruthy;

      fixture.componentInstance.disabled = false;
      fixture.detectChanges();
      fieldset = getFieldsetElement(fixture.nativeElement);
      expect(fieldset.hasAttribute('disabled')).toBeFalsy;

    });
  });

  describe('readonly', () => {

    // TODO: remove 'whenStable' once 'core/testing' is fixed
    it('should change the value on button click, when it is readonly', () => {
      const html = `<ngb-timepicker [(ngModel)]="model" [seconds]="true" [readonlyInputs]="readonly"></ngb-timepicker>`;

      const fixture = createTestComponent(html);
      fixture.componentInstance.model = {hour: 13, minute: 30, second: 0};
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {

          const buttons = getButtons(fixture.nativeElement);

          expectToDisplayTime(fixture.nativeElement, '13:30:00');
          expect(fixture.componentInstance.model).toEqual({hour: 13, minute: 30, second: 0});

          (<HTMLButtonElement>buttons[0]).click();  // H+
          fixture.detectChanges();
          expectToDisplayTime(fixture.nativeElement, '14:30:00');
          expect(fixture.componentInstance.model).toEqual({hour: 14, minute: 30, second: 0});

          (<HTMLButtonElement>buttons[3]).click();  // H-
          fixture.detectChanges();
          expectToDisplayTime(fixture.nativeElement, '13:30:00');
          expect(fixture.componentInstance.model).toEqual({hour: 13, minute: 30, second: 0});

          (<HTMLButtonElement>buttons[1]).click();  // M+
          fixture.detectChanges();
          expectToDisplayTime(fixture.nativeElement, '13:31:00');
          expect(fixture.componentInstance.model).toEqual({hour: 13, minute: 31, second: 0});

          (<HTMLButtonElement>buttons[4]).click();  // M-
          fixture.detectChanges();
          expectToDisplayTime(fixture.nativeElement, '13:30:00');
          expect(fixture.componentInstance.model).toEqual({hour: 13, minute: 30, second: 0});

          (<HTMLButtonElement>buttons[2]).click();  // S+
          fixture.detectChanges();
          expectToDisplayTime(fixture.nativeElement, '13:30:01');
          expect(fixture.componentInstance.model).toEqual({hour: 13, minute: 30, second: 1});

          (<HTMLButtonElement>buttons[5]).click();  // S-
          fixture.detectChanges();
          expectToDisplayTime(fixture.nativeElement, '13:30:00');
          expect(fixture.componentInstance.model).toEqual({hour: 13, minute: 30, second: 0});
        });
      });
    });

    it('should not change value on input change, when it is readonly', () => {
      const html = `<ngb-timepicker [(ngModel)]="model" [seconds]="true" [readonlyInputs]="readonly"></ngb-timepicker>`;

      const fixture = createTestComponent(html);
      fixture.detectChanges();

      let inputs = getInputs(fixture.nativeElement);
      expect(inputs[0].hasAttribute('readonly')).toBeTruthy();
      expect(inputs[1].hasAttribute('readonly')).toBeTruthy();
      expect(inputs[2].hasAttribute('readonly')).toBeTruthy();

      fixture.componentInstance.readonly = false;
      fixture.detectChanges();
      inputs = getInputs(fixture.nativeElement);
      expect(inputs[0].hasAttribute('readonly')).toBeFalsy();
      expect(inputs[1].hasAttribute('readonly')).toBeFalsy();
      expect(inputs[2].hasAttribute('readonly')).toBeFalsy();
    });
  });

  describe('spinners', () => {

    it('should not have spinners if configured so', () => {
      const html = `<ngb-timepicker [(ngModel)]="model" [seconds]="true" [spinners]="false"></ngb-timepicker>`;

      const fixture = createTestComponent(html);
      const buttons = getButtons(fixture.nativeElement);
      expect(buttons.length).toBe(0);
    });
  });
});


@Component({selector: 'test-cmp', template: ''})
class TestComponent {
  model;
  disabled = true;
  readonly = true;
  form = new FormGroup({control: new FormControl('', Validators.required)});
}
