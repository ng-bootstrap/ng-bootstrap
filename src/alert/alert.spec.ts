import {inject, async} from '@angular/core/testing';

import {TestComponentBuilder} from '@angular/compiler/testing';

import {Component} from '@angular/core';

import {NgbAlert, NgbDismissibleAlert} from './alert';

function getAlertElement(element: HTMLElement): HTMLDivElement {
  return <HTMLDivElement>element.querySelector('.alert');
}

function getCloseButton(element: HTMLElement): HTMLButtonElement {
  return <HTMLButtonElement>element.querySelector('button');
}

describe('ngb-alert', () => {
  it('should have type warning and by dismissible by default', async(inject([TestComponentBuilder], (tcb) => {
       tcb.overrideTemplate(TestComponent, '<ngb-alert>Watch out!</ngb-alert>')
           .createAsync(TestComponent)
           .then((fixture) => {
             fixture.detectChanges();

             const alertEl = getAlertElement(fixture.nativeElement);

             expect(alertEl).toHaveCssClass('alert-warning');
             expect(alertEl.getAttribute('role')).toEqual('alert');
             expect(getCloseButton(alertEl)).toBeTruthy();
           });
     })));

  it('should allow specifying alert type', async(inject([TestComponentBuilder], (tcb) => {
       tcb.overrideTemplate(TestComponent, '<ngb-alert type="success">Cool!</ngb-alert>')
           .createAsync(TestComponent)
           .then((fixture) => {
             fixture.detectChanges();
             expect(getAlertElement(fixture.nativeElement)).toHaveCssClass('alert-success');
           });
     })));

  it('should render close button only if dismissible', async(inject([TestComponentBuilder], (tcb) => {
       tcb.overrideTemplate(TestComponent, '<ngb-alert [dismissible]="false">Don\'t close!</ngb-alert>')
           .createAsync(TestComponent)
           .then((fixture) => {
             fixture.detectChanges();
             expect(getCloseButton(getAlertElement(fixture.nativeElement))).toBeFalsy();
           });
     })));
});

describe('NgbDismissibleAlert', () => {

  it('should open a dismissible alert with default type', async(inject([TestComponentBuilder], (tcb) => {
       tcb.overrideTemplate(TestComponent, '<template ngbAlert>Hello, {{name}}!</template>')
           .createAsync(TestComponent)
           .then((fixture) => {
             fixture.detectChanges();

             const alertEl = getAlertElement(fixture.nativeElement);

             expect(alertEl).toHaveCssClass('alert-warning');
             expect(alertEl.getAttribute('role')).toEqual('alert');
             expect(getCloseButton(alertEl)).toBeTruthy();

             getCloseButton(alertEl).click();
             fixture.detectChanges();
             expect(getAlertElement(fixture.nativeElement)).toBeNull();
           });
     })));

  it('should open a dismissible alert with a specified type', async(inject([TestComponentBuilder], (tcb) => {
       tcb.overrideTemplate(TestComponent, '<template ngbAlert type="success">Hello, {{name}}!</template>')
           .createAsync(TestComponent)
           .then((fixture) => {
             fixture.detectChanges();

             const alertEl = getAlertElement(fixture.nativeElement);

             expect(alertEl).toHaveCssClass('alert-success');
             expect(getCloseButton(alertEl)).toBeTruthy();
           });
     })));


  it('should dismiss alert and invoke close handler on close button click',
     async(inject([TestComponentBuilder], (tcb) => {
       tcb.overrideTemplate(TestComponent, '<template ngbAlert (close)="closed = true">Hello, {{name}}!</template>')
           .createAsync(TestComponent)
           .then((fixture) => {
             fixture.detectChanges();

             const alertEl = getAlertElement(fixture.nativeElement);

             getCloseButton(alertEl).click();
             fixture.detectChanges();

             expect(fixture.componentInstance.closed).toBeTruthy();
             expect(getAlertElement(fixture.nativeElement)).toBeNull();
           });
     })));

});

@Component({selector: 'test-cmp', directives: [NgbAlert, NgbDismissibleAlert], template: '', precompile: [NgbAlert]})
class TestComponent {
  name = 'World';
  closed = false;
}
