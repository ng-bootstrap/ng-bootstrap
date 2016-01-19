import {
  iit,
  it,
  ddescribe,
  describe,
  expect,
  inject,
  injectAsync,
  TestComponentBuilder,
} from 'angular2/testing';

import {Component} from 'angular2/core';

import {NgbAlert} from './alert';

function getAlertElement(element: HTMLElement): HTMLDivElement {
  return <HTMLDivElement>element.querySelector('.alert');
}

function getCloseButton(element: HTMLElement): HTMLButtonElement {
  return <HTMLButtonElement>element.querySelector('button');
}

describe('ngb-alert', () => {

  it('should have type warning and by dismissible by default', injectAsync([TestComponentBuilder], (tcb) => {
       return tcb.overrideTemplate(TestComponent, '<ngb-alert>Watch out!</ngb-alert>')
           .createAsync(TestComponent)
           .then((fixture) => {
             fixture.detectChanges();

             const alertEl = getAlertElement(fixture.nativeElement);

             expect(alertEl).toHaveCssClass('alert-warning');
             expect(alertEl.getAttribute('role')).toEqual('alert');
             expect(getCloseButton(alertEl)).toBeTruthy();
           });
     }));

  it('should allow specifying alert type', injectAsync([TestComponentBuilder], (tcb) => {
       return tcb.overrideTemplate(TestComponent, '<ngb-alert type="success">Cool!</ngb-alert>')
           .createAsync(TestComponent)
           .then((fixture) => {
             fixture.detectChanges();
             expect(getAlertElement(fixture.nativeElement)).toHaveCssClass('alert-success');
           });
     }));

  it('should render close button only if dismissible', injectAsync([TestComponentBuilder], (tcb) => {
       return tcb.overrideTemplate(TestComponent, '<ngb-alert [dismissible]="false">Don\'t close!</ngb-alert>')
           .createAsync(TestComponent)
           .then((fixture) => {
             fixture.detectChanges();
             expect(getCloseButton(getAlertElement(fixture.nativeElement))).toBeFalsy();
           });
     }));
});

@Component({selector: 'test-cmp', directives: [NgbAlert], template: ''})
class TestComponent {
}
