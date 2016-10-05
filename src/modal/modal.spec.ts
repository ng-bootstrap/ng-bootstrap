import {Component, Injectable, ViewChild, OnDestroy} from '@angular/core';
import {TestBed, ComponentFixture} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

import {NgbModalModule, NgbModal, NgbModalRef} from './modal.module';

const NOOP = () => {};

@Injectable()
class SpyService {
  called = false;
}

describe('ngb-modal', () => {

  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    jasmine.addMatchers({
      toHaveModal: function(util, customEqualityTests) {
        return {
          compare: function(actual, content?) {
            const allModalsContent = actual.querySelectorAll('.modal-content');
            let pass = true;

            if (!content) {
              pass = allModalsContent.length > 0;
            } else if (Array.isArray(content)) {
              pass = allModalsContent.length === content.length;
            } else {
              pass = allModalsContent.length === 1 && allModalsContent[0].textContent.trim() === content;
            }

            return {pass: pass, message: `Expected ${actual.outerHTML} to have at least modal open`};
          },
          negativeCompare: function(actual) {
            const allOpenModals = actual.querySelectorAll('ngb-modal-window');

            return {
              pass: allOpenModals.length === 0,
              message: `Expected ${actual.outerHTML} not to have any modals open but found ${allOpenModals.length}`
            };
          }
        };
      }
    });

    jasmine.addMatchers({
      toHaveBackdrop: function(util, customEqualityTests) {
        return {
          compare: function(actual) {
            return {
              pass: actual.querySelectorAll('ngb-modal-backdrop').length === 1,
              message: `Expected ${actual.outerHTML} to have exactly one backdrop element`
            };
          },
          negativeCompare: function(actual) {
            const allOpenModals = actual.querySelectorAll('ngb-modal-backdrop');

            return {
              pass: allOpenModals.length === 0,
              message: `Expected ${actual.outerHTML} not to have any backdrop elements`
            };
          }
        };
      }
    });
  });

  beforeEach(() => {
    TestBed.configureTestingModule(
        {declarations: [TestComponent, DestroyableCmpt], imports: [NgbModalModule.forRoot()], providers: [SpyService]});
    fixture = TestBed.createComponent(TestComponent);
  });

  describe('basic functionality', () => {

    it('should open and close modal with default options', () => {
      const modalInstance = fixture.componentInstance.open('foo');
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveModal('foo');

      modalInstance.close('some result');
      fixture.detectChanges();
      expect(fixture.nativeElement).not.toHaveModal();
    });

    it('should open and close modal from a TemplateRef content', () => {
      const modalInstance = fixture.componentInstance.openTpl();
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveModal('Hello, World!');

      modalInstance.close('some result');
      fixture.detectChanges();
      expect(fixture.nativeElement).not.toHaveModal();
    });

    it('should properly destroy TemplateRef content', () => {
      const spyService = fixture.debugElement.injector.get(SpyService);
      const modalInstance = fixture.componentInstance.openDestroyableTpl();
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveModal('Some content');
      expect(spyService.called).toBeFalsy();

      modalInstance.close('some result');
      fixture.detectChanges();
      expect(fixture.nativeElement).not.toHaveModal();
      expect(spyService.called).toBeTruthy();
    });

    it('should open and close modal from inside', () => {
      fixture.componentInstance.openTplClose();
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveModal();

      (<HTMLElement>fixture.nativeElement.querySelector('button#close')).click();
      fixture.detectChanges();
      expect(fixture.nativeElement).not.toHaveModal();
    });

    it('should open and dismiss modal from inside', () => {
      fixture.componentInstance.openTplDismiss().result.catch(NOOP);
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveModal();

      (<HTMLElement>fixture.nativeElement.querySelector('button#dismiss')).click();
      fixture.detectChanges();
      expect(fixture.nativeElement).not.toHaveModal();
    });

    it('should resolve result promise on close', () => {
      let resolvedResult;
      fixture.componentInstance.openTplClose().result.then((result) => resolvedResult = result);
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveModal();

      (<HTMLElement>fixture.nativeElement.querySelector('button#close')).click();
      fixture.detectChanges();
      expect(fixture.nativeElement).not.toHaveModal();

      fixture.whenStable().then(() => { expect(resolvedResult).toBe('myResult'); });
    });

    it('should reject result promise on dismiss', () => {
      let rejectReason;
      fixture.componentInstance.openTplDismiss().result.catch((reason) => rejectReason = reason);
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveModal();

      (<HTMLElement>fixture.nativeElement.querySelector('button#dismiss')).click();
      fixture.detectChanges();
      expect(fixture.nativeElement).not.toHaveModal();

      fixture.whenStable().then(() => { expect(rejectReason).toBe('myReason'); });
    });

    it('should add / remove "modal-open" class to body when modal is open', () => {
      const modalRef = fixture.componentInstance.open('bar');
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveModal();
      expect(document.body).toHaveCssClass('modal-open');

      modalRef.close('bar result');
      fixture.detectChanges();
      expect(fixture.nativeElement).not.toHaveModal();
      expect(document.body).not.toHaveCssClass('modal-open');
    });

    it('should not throw when close called multiple times', () => {
      const modalInstance = fixture.componentInstance.open('foo');
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveModal('foo');

      modalInstance.close('some result');
      fixture.detectChanges();
      expect(fixture.nativeElement).not.toHaveModal();

      modalInstance.close('some result');
      fixture.detectChanges();
      expect(fixture.nativeElement).not.toHaveModal();
    });

    it('should not throw when dismiss called multiple times', () => {
      const modalRef = fixture.componentInstance.open('foo');
      modalRef.result.catch(NOOP);

      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveModal('foo');

      modalRef.dismiss('some reason');
      fixture.detectChanges();
      expect(fixture.nativeElement).not.toHaveModal();

      modalRef.dismiss('some reason');
      fixture.detectChanges();
      expect(fixture.nativeElement).not.toHaveModal();
    });
  });

  describe('backdrop options', () => {

    it('should have backdrop by default', () => {
      const modalInstance = fixture.componentInstance.open('foo');
      fixture.detectChanges();

      expect(fixture.nativeElement).toHaveModal('foo');
      expect(fixture.nativeElement).toHaveBackdrop();

      modalInstance.close('some reason');
      fixture.detectChanges();

      expect(fixture.nativeElement).not.toHaveModal();
      expect(fixture.nativeElement).not.toHaveBackdrop();
    });

    it('should open and close modal without backdrop', () => {
      const modalInstance = fixture.componentInstance.open('foo', {backdrop: false});
      fixture.detectChanges();

      expect(fixture.nativeElement).toHaveModal('foo');
      expect(fixture.nativeElement).not.toHaveBackdrop();

      modalInstance.close('some reason');
      fixture.detectChanges();

      expect(fixture.nativeElement).not.toHaveModal();
      expect(fixture.nativeElement).not.toHaveBackdrop();
    });

    it('should dismiss on backdrop click', () => {
      fixture.componentInstance.open('foo').result.catch(NOOP);
      fixture.detectChanges();

      expect(fixture.nativeElement).toHaveModal('foo');
      expect(fixture.nativeElement).toHaveBackdrop();

      (<HTMLElement>fixture.nativeElement.querySelector('ngb-modal-window')).click();
      fixture.detectChanges();

      expect(fixture.nativeElement).not.toHaveModal();
      expect(fixture.nativeElement).not.toHaveBackdrop();
    });

    it('should not dismiss on "static" backdrop click', () => {
      fixture.componentInstance.open('foo', {backdrop: 'static'});
      fixture.detectChanges();

      expect(fixture.nativeElement).toHaveModal('foo');
      expect(fixture.nativeElement).toHaveBackdrop();

      (<HTMLElement>fixture.nativeElement.querySelector('ngb-modal-window')).click();
      fixture.detectChanges();

      expect(fixture.nativeElement).toHaveModal();
      expect(fixture.nativeElement).toHaveBackdrop();
    });

    it('should not dismiss on clicks outside content where there is no backdrop', () => {
      fixture.componentInstance.open('foo', {backdrop: false});
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveModal('foo');

      (<HTMLElement>fixture.nativeElement.querySelector('ngb-modal-window')).click();
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveModal();
    });
  });

  describe('keyboard options', () => {

    it('should dismiss modals on ESC by default', () => {
      fixture.componentInstance.open('foo').result.catch(NOOP);
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveModal('foo');

      fixture.debugElement.query(By.css('ngb-modal-window')).triggerEventHandler('keyup.esc', {});
      fixture.detectChanges();
      expect(fixture.nativeElement).not.toHaveModal();
    });

    it('should not dismiss modals on ESC when keyboard option is false', () => {
      fixture.componentInstance.open('foo', {keyboard: false});
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveModal('foo');

      fixture.debugElement.query(By.css('ngb-modal-window')).triggerEventHandler('keyup.esc', {});
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveModal();
    });

    it('should not dismiss modals on ESC when default is prevented', () => {
      fixture.componentInstance.open('foo', {keyboard: true});
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveModal('foo');

      fixture.debugElement.query(By.css('ngb-modal-window')).triggerEventHandler('keyup.esc', {defaultPrevented: true});
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveModal();
    });
  });

  describe('size options', () => {

    it('should render modals with specified size', () => {
      fixture.componentInstance.open('foo', {size: 'sm'});
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveModal('foo');
      expect(fixture.nativeElement.querySelector('.modal-dialog')).toHaveCssClass('modal-sm');
    });

  });

  describe('custom class options', () => {

    it('should render modals with the correct custom classes', () => {
      fixture.componentInstance.open('foo', {windowClass: 'bar'});
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveModal('foo');
      expect(fixture.nativeElement.querySelector('ngb-modal-window')).toHaveCssClass('bar');
    });

  });

  describe('focus management', () => {

    it('should focus modal window and return focus to previously focused element', () => {
      fixture.detectChanges();
      const openButtonEl = fixture.nativeElement.querySelector('button#open');

      openButtonEl.focus();
      openButtonEl.click();
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveModal('from button');
      expect(document.activeElement).toBe(document.querySelector('ngb-modal-window'));

      fixture.componentInstance.close();
      expect(fixture.nativeElement).not.toHaveModal();
      expect(document.activeElement).toBe(openButtonEl);
    });


    it('should return focus to body if no element focused prior to modal opening', () => {
      const modalInstance = fixture.componentInstance.open('foo');
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveModal('foo');
      expect(document.activeElement).toBe(document.querySelector('ngb-modal-window'));

      modalInstance.close('ok!');
      expect(document.activeElement).toBe(document.body);
    });
  });
});

@Component({selector: 'destroyable-cmpt', template: 'Some content'})
export class DestroyableCmpt implements OnDestroy {
  constructor(private _spyService: SpyService) {}

  ngOnDestroy(): void { this._spyService.called = true; }
}

@Component({
  selector: 'test-cmpt',
  template: `
    <template ngbModalContainer></template>
    <template #content>Hello, {{name}}!</template>
    <template #destroyableContent><destroyable-cmpt></destroyable-cmpt></template>
    <template #contentWithClose let-close="close"><button id="close" (click)="close('myResult')">Close me</button></template>
    <template #contentWithDismiss let-dismiss="dismiss"><button id="dismiss" (click)="dismiss('myReason')">Dismiss me</button></template>
    <button id="open" (click)="open('from button')">Open</button>
  `
})
class TestComponent {
  name = 'World';
  @ViewChild('content') tplContent;
  @ViewChild('destroyableContent') tplDestroyableContent;
  @ViewChild('contentWithClose') tplContentWithClose;
  @ViewChild('contentWithDismiss') tplContentWithDismiss;
  openedModal: NgbModalRef;

  constructor(private modalService: NgbModal) {}

  open(content: string, options?: Object) {
    this.openedModal = this.modalService.open(content, options);
    return this.openedModal;
  }
  close() {
    if (this.openedModal) {
      this.openedModal.close('ok');
    }
  }
  openTpl(options?: Object) { return this.modalService.open(this.tplContent, options); }
  openDestroyableTpl(options?: Object) { return this.modalService.open(this.tplDestroyableContent, options); }
  openTplClose(options?: Object) { return this.modalService.open(this.tplContentWithClose, options); }
  openTplDismiss(options?: Object) { return this.modalService.open(this.tplContentWithDismiss, options); }
}
