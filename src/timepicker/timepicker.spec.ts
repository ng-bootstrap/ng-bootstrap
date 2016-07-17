import {inject, async, addProviders} from '@angular/core/testing';

import {TestComponentBuilder} from '@angular/compiler/testing';

import {Component} from '@angular/core';

import {NgbTimepicker} from './timepicker';

function getInput(nativeEl: HTMLElement) {
  return nativeEl.querySelectorAll('input');
}

describe('ngb-timepicker', () => {
  it('should render hour and minute inputs by default', async(inject([TestComponentBuilder], (tcb) => {
       const html = `<ngb-timepicker> </ngb-timepicker>`;

       tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();

         const button = getInput(fixture.nativeElement);
         expect(button.length).toBe(2);
       });
     })));
});

describe('ngb-timepicker', () => {
  it('should have seconds input when it is enabled', async(inject([TestComponentBuilder], (tcb) => {
       const html = `<ngb-timepicker seconds="true"> </ngb-timepicker>`;

       tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();

         const inputElem = getInput(fixture.nativeElement);
         expect(inputElem.length).toBe(3);

       });
     })));
});


@Component({selector: 'test-cmp', directives: [NgbTimepicker], template: ''})
class TestComponent {
}
