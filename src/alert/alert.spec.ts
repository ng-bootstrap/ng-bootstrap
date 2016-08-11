import {async, fakeAsync, tick, TestBed} from '@angular/core/testing';

import {Component} from '@angular/core';

import {NgbAlertModule} from './index';
import {NgbAlert, NgbDismissibleAlert} from './alert';

function getAlertElement(element: HTMLElement): HTMLDivElement {
  return <HTMLDivElement>element.querySelector('.alert');
}

function getCloseButton(element: HTMLElement): HTMLButtonElement {
  return <HTMLButtonElement>element.querySelector('button');
}

describe('ngb-alert', () => {

  beforeEach(() => { TestBed.configureTestingModule({declarations: [TestComponent], imports: [NgbAlertModule]}); });

  it('should have type warning and by dismissible by default', async(() => {
       TestBed.overrideComponent(TestComponent, {set: {template: '<ngb-alert>Watch out!</ngb-alert>'}})
           .compileComponents()
           .then(() => {
             const fixture = TestBed.createComponent(TestComponent);
             fixture.detectChanges();

             const alertEl = getAlertElement(fixture.nativeElement);

             expect(alertEl).toHaveCssClass('alert-warning');
             expect(alertEl.getAttribute('role')).toEqual('alert');
             expect(getCloseButton(alertEl)).toBeTruthy();
           });
     }));

  it('should allow specifying alert type', async(() => {
       TestBed.overrideComponent(TestComponent, {set: {template: '<ngb-alert type="success">Cool!</ngb-alert>'}})
           .compileComponents()
           .then(() => {
             const fixture = TestBed.createComponent(TestComponent);
             fixture.detectChanges();
             expect(getAlertElement(fixture.nativeElement)).toHaveCssClass('alert-success');
           });
     }));

  it('should render close button only if dismissible', async(() => {
       TestBed
           .overrideComponent(
               TestComponent, {set: {template: `<ngb-alert [dismissible]="false">Don't close!</ngb-alert>`}})
           .compileComponents()
           .then(() => {
             const fixture = TestBed.createComponent(TestComponent);
             fixture.detectChanges();
             expect(getCloseButton(getAlertElement(fixture.nativeElement))).toBeFalsy();
           });
     }));
});

describe('NgbDismissibleAlert', () => {

  beforeEach(() => { TestBed.configureTestingModule({declarations: [TestComponent], imports: [NgbAlertModule]}); });

  it('should open a dismissible alert with default type', async(() => {
       TestBed.overrideComponent(TestComponent, {set: {template: '<template ngbAlert>Hello, {{name}}!</template>'}})
           .compileComponents()
           .then(() => {
             const fixture = TestBed.createComponent(TestComponent);
             fixture.detectChanges();

             const alertEl = getAlertElement(fixture.nativeElement);

             expect(alertEl).toHaveCssClass('alert-warning');
             expect(alertEl.getAttribute('role')).toEqual('alert');
             expect(getCloseButton(alertEl)).toBeTruthy();

             getCloseButton(alertEl).click();
             fixture.detectChanges();
             expect(getAlertElement(fixture.nativeElement)).toBeNull();
           });
     }));

  it('should open a dismissible alert with a specified type', async(() => {
       TestBed
           .overrideComponent(
               TestComponent, {set: {template: '<template ngbAlert type="success">Hello, {{name}}!</template>'}})
           .compileComponents()
           .then(() => {
             const fixture = TestBed.createComponent(TestComponent);
             fixture.detectChanges();

             const alertEl = getAlertElement(fixture.nativeElement);

             expect(alertEl).toHaveCssClass('alert-success');
             expect(getCloseButton(alertEl)).toBeTruthy();
           });
     }));


  it('should dismiss alert and invoke close handler on close button click', async(() => {
       TestBed
           .overrideComponent(
               TestComponent,
               {set: {template: '<template ngbAlert (close)="closed = true">Hello, {{name}}!</template>'}})
           .compileComponents()
           .then(() => {
             const fixture = TestBed.createComponent(TestComponent);
             fixture.detectChanges();

             const alertEl = getAlertElement(fixture.nativeElement);

             getCloseButton(alertEl).click();
             fixture.detectChanges();

             expect(fixture.componentInstance.closed).toBeTruthy();
             expect(getAlertElement(fixture.nativeElement)).toBeNull();
           });
     }));

  it('should auto close on timeout specified', fakeAsync(() => {
       TestBed
           .overrideComponent(
               TestComponent,
               {set: {template: '<template ngbAlert [dismissOnTimeout]="1000">Hello, {{name}}!</template>'}})
           .compileComponents()
           .then(() => {
             const fixture = TestBed.createComponent(TestComponent);
             fixture.detectChanges();
             const alertEl = getAlertElement(fixture.nativeElement);
             fixture.detectChanges();
             expect(alertEl.getAttribute('role')).toEqual('alert');
             expect(getCloseButton(alertEl)).toBeTruthy();

             tick(800);
             fixture.detectChanges();
             expect(alertEl.getAttribute('role')).toEqual('alert');
             expect(getCloseButton(alertEl)).toBeTruthy();

             tick(1200);
             fixture.detectChanges();
             expect(getAlertElement(fixture.nativeElement)).toBeNull();

           });
     }));

});

@Component({selector: 'test-cmp', template: '', entryComponents: [NgbAlert]})
class TestComponent {
  name = 'World';
  closed = false;
}
