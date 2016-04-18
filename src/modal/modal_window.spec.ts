import {
  iit,
  it,
  ddescribe,
  describe,
  expect,
  inject,
  injectAsync,
  TestComponentBuilder,
  beforeEach,
  beforeEachProviders
} from 'angular2/testing';

import {Component} from "angular2/core";

import {NgbModalWindow} from './modal_window';
import {ModalDismissReasons} from "./modal_dismiss_reasons";

describe('ngb-modal-dialog', () => {

  describe('basic rendering functionality', () => {

    it('should render default modal window', injectAsync([TestComponentBuilder], (tcb) => {
         return tcb.createAsync(NgbModalWindow).then((fixture) => {
           fixture.detectChanges();

           var modalEl: Element = fixture.nativeElement;
           var dialogEl: Element = fixture.nativeElement.querySelector('.modal-dialog');

           expect(modalEl).toHaveCssClass('modal');
           expect(dialogEl).toHaveCssClass('modal-dialog');
         });
       }));

    it('should render default modal window with a specified size', injectAsync([TestComponentBuilder], (tcb) => {
         return tcb.createAsync(NgbModalWindow).then((fixture) => {

           fixture.componentInstance.size = 'sm';
           fixture.detectChanges();

           var dialogEl: Element = fixture.nativeElement.querySelector('.modal-dialog');
           expect(dialogEl).toHaveCssClass('modal-dialog');
           expect(dialogEl).toHaveCssClass('modal-sm');
         });
       }));

    it('should make it possible to load content', injectAsync([TestComponentBuilder], (tcb) => {
         return tcb.createAsync(NgbModalWindow).then((fixture) => {
           fixture.detectChanges();

           return fixture.componentInstance.loadContent(TestContent).then((componentRef) => {
             expect(fixture.nativeElement.querySelector('.modal-content').textContent).toMatchPattern(/TestContent/);
           });
         });
       }));

  });

  describe('dismiss', () => {

    var tcb: TestComponentBuilder;

    beforeEach(inject([TestComponentBuilder], (tcBuilder) => { tcb = tcBuilder; }));

    it('should dismiss on backdrop click by default', (done) => {
      tcb.createAsync(NgbModalWindow).then((fixture) => {
        fixture.detectChanges();

        fixture.componentInstance.dismissEvent.subscribe(($event) => {
          expect($event).toBe(ModalDismissReasons.BACKDROP_CLICK);
          done();
        });

        fixture.nativeElement.querySelector('.modal-dialog').click();
      });
    });

    it('should ignore backdrop clicks when configured to do so', (done) => {
      tcb.createAsync(NgbModalWindow).then((fixture) => {
        fixture.componentInstance.backdrop = false;
        fixture.detectChanges();

        fixture.componentInstance.dismissEvent.subscribe(($event) => {
          expect($event).toBe(ModalDismissReasons.BACKDROP_CLICK);
          done(new Error('Should not trigger dismiss event'));
        });

        fixture.nativeElement.querySelector('.modal-dialog').click();
        setTimeout(done, 200);
      });
    });

  });

});

@Component({selector: 'test-content', template: `TestContent`})
export class TestContent {
}
