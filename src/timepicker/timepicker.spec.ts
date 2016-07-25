import {inject, async, addProviders} from '@angular/core/testing';
import {TestComponentBuilder} from '@angular/compiler/testing';
import {By} from '@angular/platform-browser';

import {Component} from '@angular/core';

import {NgbTimepicker} from './timepicker';

function getInputs(el: HTMLElement) {
  return el.querySelectorAll('input');
}

function getButtons(nativeEl: HTMLElement) {
  return nativeEl.querySelectorAll('button.btn-link');
}

function getMeridianButton(nativeEl: HTMLElement) {
  return nativeEl.querySelector('button.btn-primary-outline');
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

describe('ngb-timepicker', () => {

  describe('rendering based on model', () => {

    it('should render hour and minute inputs', async(inject([TestComponentBuilder], (tcb) => {
         const html = `<ngb-timepicker [ngModel]="model"></ngb-timepicker>`;

         tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.componentInstance.model = {hour: 13, minute: 30};
           fixture.detectChanges();
           expectToDisplayTime(fixture.nativeElement, '13:30');
         });
       })));

    it('should update inputs value on model change', async(inject([TestComponentBuilder], (tcb) => {
         const html = `<ngb-timepicker [ngModel]="model"></ngb-timepicker>`;

         tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.componentInstance.model = {hour: 13, minute: 30};
           fixture.detectChanges();
           expectToDisplayTime(fixture.nativeElement, '13:30');

           fixture.componentInstance.model = {hour: 14, minute: 40};
           fixture.detectChanges();
           expectToDisplayTime(fixture.nativeElement, '14:40');
         });
       })));

    it('should render hour and minute inputs with padding', async(inject([TestComponentBuilder], (tcb) => {
         const html = `<ngb-timepicker [ngModel]="model"></ngb-timepicker>`;

         tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.componentInstance.model = {hour: 1, minute: 3};
           fixture.detectChanges();
           expectToDisplayTime(fixture.nativeElement, '01:03');
         });
       })));

    it('should render hour, minute and seconds inputs with padding', async(inject([TestComponentBuilder], (tcb) => {
         const html = `<ngb-timepicker [ngModel]="model" [seconds]="true"></ngb-timepicker>`;

         tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.componentInstance.model = {hour: 10, minute: 3, second: 4};
           fixture.detectChanges();
           expectToDisplayTime(fixture.nativeElement, '10:03:04');
         });
       })));

    it('should render invalid or empty hour and minute as blank string', async(inject([TestComponentBuilder], (tcb) => {
         const html = `<ngb-timepicker [ngModel]="model"></ngb-timepicker>`;

         tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.componentInstance.model = {hour: undefined, minute: 'aaa'};
           fixture.detectChanges();
           expectToDisplayTime(fixture.nativeElement, ':');
         });
       })));

    it('should render invalid or empty second as blank string', async(inject([TestComponentBuilder], (tcb) => {
         const html = `<ngb-timepicker [ngModel]="model" [seconds]="true"></ngb-timepicker>`;

         tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.componentInstance.model = {hour: 10, minute: 20, second: false};
           fixture.detectChanges();
           expectToDisplayTime(fixture.nativeElement, '10:20:');
         });
       })));

    it('should render empty fields on null model', async(inject([TestComponentBuilder], (tcb) => {
         const html = `<ngb-timepicker [ngModel]="model" [seconds]="true"></ngb-timepicker>`;

         tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.componentInstance.model = null;
           fixture.detectChanges();
           expectToDisplayTime(fixture.nativeElement, '::');
         });
       })));
  });


  describe('model updates in response to increment / decrement button clicks', () => {

    it('should increment / decrement hours', async(inject([TestComponentBuilder], (tcb) => {
         const html = `<ngb-timepicker [(ngModel)]="model"></ngb-timepicker>`;

         tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.componentInstance.model = {hour: 10, minute: 30, second: 0};
           fixture.detectChanges();

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
       })));

    it('should wrap hours', async(inject([TestComponentBuilder], (tcb) => {
         const html = `<ngb-timepicker [(ngModel)]="model"></ngb-timepicker>`;

         tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.componentInstance.model = {hour: 23, minute: 30, second: 0};
           fixture.detectChanges();

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
       })));

    it('should increment / decrement minutes', async(inject([TestComponentBuilder], (tcb) => {
         const html = `<ngb-timepicker [(ngModel)]="model"></ngb-timepicker>`;

         tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.componentInstance.model = {hour: 10, minute: 30, second: 0};
           fixture.detectChanges();

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
       })));

    it('should wrap minutes', async(inject([TestComponentBuilder], (tcb) => {
         const html = `<ngb-timepicker [(ngModel)]="model"></ngb-timepicker>`;

         tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.componentInstance.model = {hour: 22, minute: 59, second: 0};
           fixture.detectChanges();

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
       })));

    it('should increment / decrement seconds', async(inject([TestComponentBuilder], (tcb) => {
         const html = `<ngb-timepicker [(ngModel)]="model" [seconds]="true"></ngb-timepicker>`;

         tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.componentInstance.model = {hour: 10, minute: 30, second: 0};
           fixture.detectChanges();

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
       })));

    it('should wrap seconds', async(inject([TestComponentBuilder], (tcb) => {
         const html = `<ngb-timepicker [(ngModel)]="model" [seconds]="true"></ngb-timepicker>`;

         tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.componentInstance.model = {hour: 10, minute: 30, second: 59};
           fixture.detectChanges();

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
       })));
  });

  describe('model updates in response to input field changes', () => {

    it('should update hours', async(inject([TestComponentBuilder], (tcb) => {
         const html = `<ngb-timepicker [(ngModel)]="model"></ngb-timepicker>`;

         tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.componentInstance.model = {hour: 10, minute: 30, second: 0};
           fixture.detectChanges();

           const inputs = fixture.debugElement.queryAll(By.css('input'));

           expectToDisplayTime(fixture.nativeElement, '10:30');
           expect(fixture.componentInstance.model).toEqual({hour: 10, minute: 30, second: 0});

           inputs[0].triggerEventHandler('ngModelChange', '11');
           fixture.detectChanges();
           expectToDisplayTime(fixture.nativeElement, '11:30');
           expect(fixture.componentInstance.model).toEqual({hour: 11, minute: 30, second: 0});

           inputs[0].triggerEventHandler('ngModelChange', `${24 + 11}`);
           fixture.detectChanges();
           expectToDisplayTime(fixture.nativeElement, '11:30');
           expect(fixture.componentInstance.model).toEqual({hour: 11, minute: 30, second: 0});

           inputs[0].triggerEventHandler('ngModelChange', 'aa');
           fixture.detectChanges();
           expectToDisplayTime(fixture.nativeElement, '00:30');
           expect(fixture.componentInstance.model).toEqual({hour: 0, minute: 30, second: 0});
         });
       })));

    it('should update minutes', async(inject([TestComponentBuilder], (tcb) => {
         const html = `<ngb-timepicker [(ngModel)]="model"></ngb-timepicker>`;

         tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.componentInstance.model = {hour: 10, minute: 30, second: 0};
           fixture.detectChanges();

           const inputs = fixture.debugElement.queryAll(By.css('input'));

           expectToDisplayTime(fixture.nativeElement, '10:30');
           expect(fixture.componentInstance.model).toEqual({hour: 10, minute: 30, second: 0});

           inputs[1].triggerEventHandler('ngModelChange', '40');
           fixture.detectChanges();
           expectToDisplayTime(fixture.nativeElement, '10:40');
           expect(fixture.componentInstance.model).toEqual({hour: 10, minute: 40, second: 0});

           inputs[1].triggerEventHandler('ngModelChange', '70');
           fixture.detectChanges();
           expectToDisplayTime(fixture.nativeElement, '11:10');
           expect(fixture.componentInstance.model).toEqual({hour: 11, minute: 10, second: 0});

           inputs[1].triggerEventHandler('ngModelChange', 'aa');
           fixture.detectChanges();
           expectToDisplayTime(fixture.nativeElement, '11:00');
           expect(fixture.componentInstance.model).toEqual({hour: 11, minute: 0, second: 0});
         });
       })));

    it('should update seconds', async(inject([TestComponentBuilder], (tcb) => {
         const html = `<ngb-timepicker [(ngModel)]="model" [seconds]="true"></ngb-timepicker>`;

         tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.componentInstance.model = {hour: 10, minute: 30, second: 0};
           fixture.detectChanges();

           const inputs = fixture.debugElement.queryAll(By.css('input'));

           expectToDisplayTime(fixture.nativeElement, '10:30:00');
           expect(fixture.componentInstance.model).toEqual({hour: 10, minute: 30, second: 0});

           inputs[2].triggerEventHandler('ngModelChange', '40');
           fixture.detectChanges();
           expectToDisplayTime(fixture.nativeElement, '10:30:40');
           expect(fixture.componentInstance.model).toEqual({hour: 10, minute: 30, second: 40});

           inputs[2].triggerEventHandler('ngModelChange', '70');
           fixture.detectChanges();
           expectToDisplayTime(fixture.nativeElement, '10:31:10');
           expect(fixture.componentInstance.model).toEqual({hour: 10, minute: 31, second: 10});

           inputs[2].triggerEventHandler('ngModelChange', 'aa');
           fixture.detectChanges();
           expectToDisplayTime(fixture.nativeElement, '10:31:00');
           expect(fixture.componentInstance.model).toEqual({hour: 10, minute: 31, second: 0});
         });
       })));
  });

  describe('meridian', () => {

    it('should render meridian button with proper value', async(inject([TestComponentBuilder], (tcb) => {
         const html = `<ngb-timepicker [(ngModel)]="model" [seconds]="true" [meridian]="true"></ngb-timepicker>`;

         tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.componentInstance.model = {hour: 13, minute: 30, second: 0};
           fixture.detectChanges();

           const meridianButton = getMeridianButton(fixture.nativeElement);

           expectToDisplayTime(fixture.nativeElement, '01:30:00');
           expect(meridianButton.innerHTML).toBe('PM');

           fixture.componentInstance.model = {hour: 1, minute: 30, second: 0};
           fixture.detectChanges();

           expectToDisplayTime(fixture.nativeElement, '01:30:00');
           expect(meridianButton.innerHTML).toBe('AM');
         });
       })));

    it('should update model on meridian click', async(inject([TestComponentBuilder], (tcb) => {
         const html = `<ngb-timepicker [(ngModel)]="model" [seconds]="true" [meridian]="true"></ngb-timepicker>`;

         tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.componentInstance.model = {hour: 13, minute: 30, second: 0};
           fixture.detectChanges();

           const meridianButton = <HTMLButtonElement>getMeridianButton(fixture.nativeElement);

           expectToDisplayTime(fixture.nativeElement, '01:30:00');
           expect(meridianButton.innerHTML).toBe('PM');

           meridianButton.click();
           fixture.detectChanges();

           expectToDisplayTime(fixture.nativeElement, '01:30:00');
           expect(fixture.componentInstance.model).toEqual({hour: 1, minute: 30, second: 0});
           expect(meridianButton.innerHTML).toBe('AM');
         });
       })));

  });
});


@Component({selector: 'test-cmp', directives: [NgbTimepicker], template: ''})
class TestComponent {
  model;
}
