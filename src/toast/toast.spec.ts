import {Component} from '@angular/core';
import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {createGenericTestComponent} from '../test/common';
import {NgbToastModule} from './toast.module';


const createTestComponent = (html: string) =>
    createGenericTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;

const getElementWithSelector = (fixture: ComponentFixture<TestComponent>, className) =>
    fixture.nativeElement.querySelector(className);

const getToastElement = (fixture: ComponentFixture<TestComponent>): Element =>
    getElementWithSelector(fixture, 'ngb-toast');
const getToastHeaderElement = (fixture: ComponentFixture<TestComponent>): Element =>
    getElementWithSelector(fixture, 'ngb-toast .toast-header');
const getToastBodyElement = (fixture: ComponentFixture<TestComponent>): Element =>
    getElementWithSelector(fixture, 'ngb-toast .toast-body');

describe('ngb-toast', () => {

  beforeEach(() => { TestBed.configureTestingModule({declarations: [TestComponent], imports: [NgbToastModule]}); });

  describe('via declarative usage', () => {
    it('should be instantiable declaratively', () => {
      const fixture = createTestComponent(`<ngb-toast header="header">body</ngb-toast>`);
      expect(fixture.componentInstance).toBeTruthy();
    });

    it('should have default classnames', () => {
      const fixture = createTestComponent(`<ngb-toast header="header">body</ngb-toast>`);
      // Below getter are using Bootstrap classnames
      const toast = getToastElement(fixture);
      const header = getToastHeaderElement(fixture);
      const body = getToastBodyElement(fixture);

      expect(toast).toBeDefined();
      expect(header).toBeDefined();
      expect(body).toBeDefined();
    });

    it('should not generate a header element when header input is not specified', () => {
      const fixture = createTestComponent(`<ngb-toast>body</ngb-toast>`);
      const toastHeader = getToastHeaderElement(fixture);
      expect(toastHeader).toBeNull();
    });

    it('should contain a close button when header is specified', () => {
      const fixture = createTestComponent(`<ngb-toast header="header">body</ngb-toast>`);
      const toastHeader = getToastHeaderElement(fixture);
      expect(toastHeader.querySelector('button.close')).toBeDefined();
    });

    it('should contain a close button when ngbToastHeader is used', () => {
      const fixture = createTestComponent(`<ngb-toast>
        <ng-template ngbToastHeader>{{header}}</ng-template>
        body
      </ngb-toast>`);
      const toastHeader = getToastHeaderElement(fixture);
      expect(toastHeader.querySelector('button.close')).toBeDefined();
    });

    it('should emit hide output when close is clicked', () => {
      const fixture =
          createTestComponent(`<ngb-toast header="header" [autohide]="false" (hide)="hide()">body</ngb-toast>`);

      const toast = getToastElement(fixture);
      const closeButton = toast.querySelector('button.close') as HTMLElement;
      closeButton.click();
      fixture.detectChanges();
      expect(fixture.componentInstance.hide).toHaveBeenCalled();
    });

    it('should emit hide output after default delay (500ms)', fakeAsync(() => {
         const fixture = createTestComponent(`<ngb-toast header="header" (hide)="hide()">body</ngb-toast>`);
         tick(499);
         fixture.detectChanges();
         expect(fixture.componentInstance.hide).not.toHaveBeenCalled();
         tick(500);
         fixture.detectChanges();
         expect(fixture.componentInstance.hide).toHaveBeenCalledTimes(1);
       }));

    it('should emit hide output after a custom delay in ms', fakeAsync(() => {
         const fixture =
             createTestComponent(`<ngb-toast header="header" [delay]="10000" (hide)="hide()">body</ngb-toast>`);
         tick(9999);
         fixture.detectChanges();
         expect(fixture.componentInstance.hide).not.toHaveBeenCalled();
         tick(10000);
         fixture.detectChanges();
         expect(fixture.componentInstance.hide).toHaveBeenCalledTimes(1);
       }));
  });
});


@Component({selector: 'test-cmp', template: ''})
export class TestComponent {
  visible = true;
  hide = jasmine.createSpy('hideSpy');
}
