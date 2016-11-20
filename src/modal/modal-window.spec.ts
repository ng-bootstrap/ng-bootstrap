import {TestBed, ComponentFixture} from '@angular/core/testing';

import {NgbModalWindow} from './modal-window';
import {ModalDismissReasons} from './modal-dismiss-reasons';

describe('ngb-modal-dialog', () => {

  let fixture: ComponentFixture<NgbModalWindow>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [NgbModalWindow]});
    fixture = TestBed.createComponent(NgbModalWindow);
  });

  describe('basic rendering functionality', () => {

    it('should render default modal window', () => {
      fixture.detectChanges();

      const modalEl: Element = fixture.nativeElement;
      const dialogEl: Element = fixture.nativeElement.querySelector('.modal-dialog');

      expect(modalEl).toHaveCssClass('modal');
      expect(dialogEl).toHaveCssClass('modal-dialog');
    });

    it('should render default modal window with a specified size', () => {
      fixture.componentInstance.size = 'sm';
      fixture.detectChanges();

      const dialogEl: Element = fixture.nativeElement.querySelector('.modal-dialog');
      expect(dialogEl).toHaveCssClass('modal-dialog');
      expect(dialogEl).toHaveCssClass('modal-sm');
    });

    it('should render default modal window with a specified class', () => {
      fixture.componentInstance.windowClass = 'custom-class';
      fixture.detectChanges();

      expect(fixture.nativeElement).toHaveCssClass('custom-class');
    });

    it('aria attributes', () => {
      fixture.detectChanges();
      const dialogEl: Element = fixture.nativeElement.querySelector('.modal-dialog');

      expect(fixture.nativeElement.getAttribute('role')).toBe('dialog');
      expect(dialogEl.getAttribute('role')).toBe('document');
    });
  });

  describe('dismiss', () => {

    it('should dismiss on backdrop click by default', (done) => {
      fixture.detectChanges();

      fixture.componentInstance.dismissEvent.subscribe(($event) => {
        expect($event).toBe(ModalDismissReasons.BACKDROP_CLICK);
        done();
      });

      fixture.nativeElement.click();
    });

    it('should not dismiss on modal content click when there is active backdrop', (done) => {
      fixture.detectChanges();
      fixture.componentInstance.dismissEvent.subscribe(
          () => { done.fail(new Error('Should not trigger dismiss event')); });

      fixture.nativeElement.querySelector('.modal-content').click();
      setTimeout(done, 200);
    });

    it('should ignore backdrop clicks when there is no backdrop', (done) => {
      fixture.componentInstance.backdrop = false;
      fixture.detectChanges();

      fixture.componentInstance.dismissEvent.subscribe(($event) => {
        expect($event).toBe(ModalDismissReasons.BACKDROP_CLICK);
        done.fail(new Error('Should not trigger dismiss event'));
      });

      fixture.nativeElement.querySelector('.modal-dialog').click();
      setTimeout(done, 200);
    });

    it('should ignore backdrop clicks when backdrop is "static"', (done) => {
      fixture.componentInstance.backdrop = 'static';
      fixture.detectChanges();

      fixture.componentInstance.dismissEvent.subscribe(($event) => {
        expect($event).toBe(ModalDismissReasons.BACKDROP_CLICK);
        done.fail(new Error('Should not trigger dismiss event'));
      });

      fixture.nativeElement.querySelector('.modal-dialog').click();
      setTimeout(done, 200);
    });

    it('should dismiss on esc press by default', (done) => {
      fixture.detectChanges();

      fixture.componentInstance.dismissEvent.subscribe(($event) => {
        expect($event).toBe(ModalDismissReasons.ESC);
        done();
      });

      fixture.debugElement.triggerEventHandler('keyup.esc', {});
    });
  });

});
