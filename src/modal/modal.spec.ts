import {
  Component,
  Injectable,
  ViewChild,
  OnDestroy,
  NgModule,
  getDebugNode,
  DebugElement,
  Injector
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TestBed, ComponentFixture, async} from '@angular/core/testing';

import {NgbModalModule, NgbModal, NgbActiveModal, NgbModalRef} from './modal.module';

const NOOP = () => {};

@Injectable()
class SpyService {
  called = false;
}

@Injectable()
class CustomSpyService {
  called = false;
}

describe('ngb-modal', () => {

  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    jasmine.addMatchers({
      toHaveModal: function(util, customEqualityTests) {
        return {
          compare: function(actual, content?, selector?) {
            const allModalsContent = document.querySelector(selector || 'body').querySelectorAll('.modal-content');
            let pass = true;
            let errMsg;

            if (!content) {
              pass = allModalsContent.length > 0;
              errMsg = 'at least one modal open but found none';
            } else if (Array.isArray(content)) {
              pass = allModalsContent.length === content.length;
              errMsg = `${content.length} modals open but found ${allModalsContent.length}`;
            } else {
              pass = allModalsContent.length === 1 && allModalsContent[0].textContent.trim() === content;
              errMsg = `exactly one modal open but found ${allModalsContent.length}`;
            }

            return {pass: pass, message: `Expected ${actual.outerHTML} to have ${errMsg}`};
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
              pass: document.querySelectorAll('ngb-modal-backdrop').length === 1,
              message: `Expected ${actual.outerHTML} to have exactly one backdrop element`
            };
          },
          negativeCompare: function(actual) {
            const allOpenModals = document.querySelectorAll('ngb-modal-backdrop');

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
    TestBed.configureTestingModule({imports: [NgbModalTestModule]});
    fixture = TestBed.createComponent(TestComponent);
  });

  afterEach(() => {
    // detect left-over modals and close them or report errors when can't

    const remainingModalWindows = document.querySelectorAll('ngb-modal-window');
    if (remainingModalWindows.length) {
      fail(`${remainingModalWindows.length} modal windows were left in the DOM.`);
    }

    const remainingModalBackdrops = document.querySelectorAll('ngb-modal-backdrop');
    if (remainingModalBackdrops.length) {
      fail(`${remainingModalBackdrops.length} modal backdrops were left in the DOM.`);
    }
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

    it('should open and close modal from a component type', () => {
      const spyService = fixture.debugElement.injector.get(SpyService);
      const modalInstance = fixture.componentInstance.openCmpt(DestroyableCmpt);
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveModal('Some content');
      expect(spyService.called).toBeFalsy();

      modalInstance.close('some result');
      fixture.detectChanges();
      expect(fixture.nativeElement).not.toHaveModal();
      expect(spyService.called).toBeTruthy();
    });

    it('should inject active modal ref when component is used as content', () => {
      fixture.componentInstance.openCmpt(WithActiveModalCmpt);
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveModal('Close');

      (<HTMLElement>document.querySelector('button.closeFromInside')).click();
      fixture.detectChanges();
      expect(fixture.nativeElement).not.toHaveModal();
    });

    it('should expose component used as modal content', () => {
      const modalInstance = fixture.componentInstance.openCmpt(WithActiveModalCmpt);
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveModal('Close');
      expect(modalInstance.componentInstance instanceof WithActiveModalCmpt).toBeTruthy();

      modalInstance.close();
      fixture.detectChanges();
      expect(fixture.nativeElement).not.toHaveModal();
    });

    it('should open and close modal from inside', () => {
      fixture.componentInstance.openTplClose();
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveModal();

      (<HTMLElement>document.querySelector('button#close')).click();
      fixture.detectChanges();
      expect(fixture.nativeElement).not.toHaveModal();
    });

    it('should open and dismiss modal from inside', () => {
      fixture.componentInstance.openTplDismiss().result.catch(NOOP);
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveModal();

      (<HTMLElement>document.querySelector('button#dismiss')).click();
      fixture.detectChanges();
      expect(fixture.nativeElement).not.toHaveModal();
    });

    it('should resolve result promise on close', () => {
      let resolvedResult;
      fixture.componentInstance.openTplClose().result.then((result) => resolvedResult = result);
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveModal();

      (<HTMLElement>document.querySelector('button#close')).click();
      fixture.detectChanges();
      expect(fixture.nativeElement).not.toHaveModal();

      fixture.whenStable().then(() => { expect(resolvedResult).toBe('myResult'); });
    });

    it('should reject result promise on dismiss', () => {
      let rejectReason;
      fixture.componentInstance.openTplDismiss().result.catch((reason) => rejectReason = reason);
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveModal();

      (<HTMLElement>document.querySelector('button#dismiss')).click();
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

    it('should open and close modal without backdrop from template content', () => {
      const modalInstance = fixture.componentInstance.openTpl({backdrop: false});
      fixture.detectChanges();

      expect(fixture.nativeElement).toHaveModal('Hello, World!');
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

      (<HTMLElement>document.querySelector('ngb-modal-window')).click();
      fixture.detectChanges();

      expect(fixture.nativeElement).not.toHaveModal();
      expect(fixture.nativeElement).not.toHaveBackdrop();
    });

    it('should not dismiss on "static" backdrop click', () => {
      const modalInstance = fixture.componentInstance.open('foo', {backdrop: 'static'});
      fixture.detectChanges();

      expect(fixture.nativeElement).toHaveModal('foo');
      expect(fixture.nativeElement).toHaveBackdrop();

      (<HTMLElement>document.querySelector('ngb-modal-window')).click();
      fixture.detectChanges();

      expect(fixture.nativeElement).toHaveModal();
      expect(fixture.nativeElement).toHaveBackdrop();

      modalInstance.close();
      fixture.detectChanges();
      expect(fixture.nativeElement).not.toHaveModal();
    });

    it('should not dismiss on clicks outside content where there is no backdrop', () => {
      const modalInstance = fixture.componentInstance.open('foo', {backdrop: false});
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveModal('foo');

      (<HTMLElement>document.querySelector('ngb-modal-window')).click();
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveModal();

      modalInstance.close();
      fixture.detectChanges();
      expect(fixture.nativeElement).not.toHaveModal();
    });

    it('should not dismiss on clicks that result in detached elements', () => {
      const modalInstance = fixture.componentInstance.openTplIf({});
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveModal();

      (<HTMLElement>document.querySelector('button#if')).click();
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveModal();

      modalInstance.close();
      fixture.detectChanges();
      expect(fixture.nativeElement).not.toHaveModal();
    });
  });

  describe('beforeDismiss options', () => {

    it('should not dismiss when the callback returns false', () => {
      const modalInstance = fixture.componentInstance.openTplDismiss({beforeDismiss: () => { return false; }});
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveModal();

      (<HTMLElement>document.querySelector('button#dismiss')).click();
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveModal();

      modalInstance.close();
      fixture.detectChanges();
      expect(fixture.nativeElement).not.toHaveModal();
    });

    it('should dimiss when the callback does not return false', () => {
      fixture.componentInstance.openTplDismiss({beforeDismiss: () => {}});
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveModal();

      (<HTMLElement>document.querySelector('button#dismiss')).click();
      fixture.detectChanges();
      expect(fixture.nativeElement).not.toHaveModal();
    });

    it('should not dismiss when the returned promise is resolved with false', async(() => {
         const modalInstance = fixture.componentInstance.openTplDismiss({beforeDismiss: () => Promise.resolve(false)});
         fixture.detectChanges();
         expect(fixture.nativeElement).toHaveModal();

         (<HTMLElement>document.querySelector('button#dismiss')).click();
         fixture.detectChanges();
         fixture.whenStable().then(() => {
           expect(fixture.nativeElement).toHaveModal();

           modalInstance.close();
           fixture.detectChanges();
           expect(fixture.nativeElement).not.toHaveModal();
         });
       }));

    it('should not dismiss when the returned promise is rejected', async(() => {
         const modalInstance = fixture.componentInstance.openTplDismiss({beforeDismiss: () => Promise.reject('error')});
         fixture.detectChanges();
         expect(fixture.nativeElement).toHaveModal();

         (<HTMLElement>document.querySelector('button#dismiss')).click();
         fixture.detectChanges();
         fixture.whenStable().then(() => {
           expect(fixture.nativeElement).toHaveModal();

           modalInstance.close();
           fixture.detectChanges();
           expect(fixture.nativeElement).not.toHaveModal();
         });
       }));

    it('should dismiss when the returned promise is not resolved with false', async(() => {
         fixture.componentInstance.openTplDismiss({beforeDismiss: () => Promise.resolve()});
         fixture.detectChanges();
         expect(fixture.nativeElement).toHaveModal();

         (<HTMLElement>document.querySelector('button#dismiss')).click();
         fixture.detectChanges();
         fixture.whenStable().then(() => { expect(fixture.nativeElement).not.toHaveModal(); });
       }));

    it('should dismiss when the callback is not defined', () => {
      fixture.componentInstance.openTplDismiss({});
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveModal();

      (<HTMLElement>document.querySelector('button#dismiss')).click();
      fixture.detectChanges();
      expect(fixture.nativeElement).not.toHaveModal();
    });
  });

  describe('container options', () => {

    it('should attach window and backdrop elements to the specified container', () => {
      const modalInstance = fixture.componentInstance.open('foo', {container: '#testContainer'});
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveModal('foo', '#testContainer');

      modalInstance.close();
      fixture.detectChanges();
      expect(fixture.nativeElement).not.toHaveModal();
    });

    it('should throw when the specified container element doesnt exist', () => {
      const brokenSelector = '#notInTheDOM';
      expect(() => {
        fixture.componentInstance.open('foo', {container: brokenSelector});
      }).toThrowError(`The specified modal container "${brokenSelector}" was not found in the DOM.`);
    });
  });

  describe('keyboard options', () => {

    it('should dismiss modals on ESC by default', () => {
      fixture.componentInstance.open('foo').result.catch(NOOP);
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveModal('foo');

      (<DebugElement>getDebugNode(document.querySelector('ngb-modal-window'))).triggerEventHandler('keyup.esc', {});
      fixture.detectChanges();
      expect(fixture.nativeElement).not.toHaveModal();
    });

    it('should not dismiss modals on ESC when keyboard option is false', () => {
      const modalInstance = fixture.componentInstance.open('foo', {keyboard: false});
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveModal('foo');

      (<DebugElement>getDebugNode(document.querySelector('ngb-modal-window'))).triggerEventHandler('keyup.esc', {});
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveModal();

      modalInstance.close();
      fixture.detectChanges();
      expect(fixture.nativeElement).not.toHaveModal();
    });

    it('should not dismiss modals on ESC when default is prevented', () => {
      const modalInstance = fixture.componentInstance.open('foo', {keyboard: true});
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveModal('foo');

      (<DebugElement>getDebugNode(document.querySelector('ngb-modal-window'))).triggerEventHandler('keyup.esc', {
        defaultPrevented: true
      });
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveModal();

      modalInstance.close();
      fixture.detectChanges();
      expect(fixture.nativeElement).not.toHaveModal();
    });
  });

  describe('size options', () => {

    it('should render modals with specified size', () => {
      const modalInstance = fixture.componentInstance.open('foo', {size: 'sm'});
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveModal('foo');
      expect(document.querySelector('.modal-dialog')).toHaveCssClass('modal-sm');

      modalInstance.close();
      fixture.detectChanges();
      expect(fixture.nativeElement).not.toHaveModal();
    });

  });

  describe('window custom class options', () => {

    it('should render modals with the correct window custom classes', () => {
      const modalInstance = fixture.componentInstance.open('foo', {windowClass: 'bar'});
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveModal('foo');
      expect(document.querySelector('ngb-modal-window')).toHaveCssClass('bar');

      modalInstance.close();
      fixture.detectChanges();
      expect(fixture.nativeElement).not.toHaveModal();
    });

  });

  describe('backdrop custom class options', () => {

    it('should render modals with the correct backdrop custom classes', () => {
      const modalInstance = fixture.componentInstance.open('foo', {backdropClass: 'my-fancy-backdrop'});
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveModal('foo');
      expect(document.querySelector('ngb-modal-backdrop')).toHaveCssClass('my-fancy-backdrop');

      modalInstance.close();
      fixture.detectChanges();
      expect(fixture.nativeElement).not.toHaveModal();
    });

  });

  describe('custom injector option', () => {

    it('should render modal with a custom injector', () => {
      const customInjector =
          Injector.create({providers: [{provide: CustomSpyService, useClass: CustomSpyService, deps: []}]});
      const modalInstance = fixture.componentInstance.openCmpt(CustomInjectorCmpt, {injector: customInjector});
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveModal('Some content');

      modalInstance.close();
      fixture.detectChanges();
      expect(fixture.nativeElement).not.toHaveModal();
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

    it('should return focus to body if the opening element is not stored as previously focused element', () => {
      fixture.detectChanges();
      const openElement = fixture.nativeElement.querySelector('#open-no-focus');

      openElement.click();
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveModal('from non focusable element');
      expect(document.activeElement).toBe(document.querySelector('ngb-modal-window'));

      fixture.componentInstance.close();
      expect(fixture.nativeElement).not.toHaveModal();
      expect(document.activeElement).toBe(document.body);
    });

    it('should return focus to body if the opening element is stored but cannot be focused', () => {
      fixture.detectChanges();
      const openElement = fixture.nativeElement.querySelector('#open-no-focus-ie');

      openElement.click();
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveModal('from non focusable element but stored as activeElement on IE');
      expect(document.activeElement).toBe(document.querySelector('ngb-modal-window'));

      fixture.componentInstance.close();
      expect(fixture.nativeElement).not.toHaveModal();
      expect(document.activeElement).toBe(document.body);
    });
  });

  describe('window element ordering', () => {
    it('should place newer windows on top of older ones', () => {
      const modalInstance1 = fixture.componentInstance.open('foo', {windowClass: 'window-1'});
      fixture.detectChanges();

      const modalInstance2 = fixture.componentInstance.open('bar', {windowClass: 'window-2'});
      fixture.detectChanges();

      let windows = document.querySelectorAll('ngb-modal-window');
      expect(windows.length).toBe(2);
      expect(windows[0]).toHaveCssClass('window-1');
      expect(windows[1]).toHaveCssClass('window-2');

      modalInstance2.close();
      modalInstance1.close();
      fixture.detectChanges();
    });
  });

  describe('vertically centered', () => {

    it('should render modals vertically centered', () => {
      const modalInstance = fixture.componentInstance.open('foo', {centered: true});
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveModal('foo');
      expect(document.querySelector('.modal-dialog')).toHaveCssClass('modal-dialog-centered');

      modalInstance.close();
      fixture.detectChanges();
      expect(fixture.nativeElement).not.toHaveModal();
    });
  });

  describe('accessibility', () => {
    it('should support aria-labelledby', () => {
      const id = 'aria-labelledby-id';

      const modalInstance = fixture.componentInstance.open('foo', {ariaLabelledBy: id});
      fixture.detectChanges();

      const modalElement = <HTMLElement>document.querySelector('ngb-modal-window');
      expect(modalElement.getAttribute('aria-labelledby')).toBe(id);

      modalInstance.close('some result');
      fixture.detectChanges();
      expect(fixture.nativeElement).not.toHaveModal();
    });
  });
});

@Component({selector: 'custom-injector-cmpt', template: 'Some content'})
export class CustomInjectorCmpt implements OnDestroy {
  constructor(private _spyService: CustomSpyService) {}

  ngOnDestroy(): void { this._spyService.called = true; }
}

@Component({selector: 'destroyable-cmpt', template: 'Some content'})
export class DestroyableCmpt implements OnDestroy {
  constructor(private _spyService: SpyService) {}

  ngOnDestroy(): void { this._spyService.called = true; }
}

@Component(
    {selector: 'modal-content-cmpt', template: '<button class="closeFromInside" (click)="close()">Close</button>'})
export class WithActiveModalCmpt {
  constructor(public activeModal: NgbActiveModal) {}

  close() { this.activeModal.close('from inside'); }
}

@Component({
  selector: 'test-cmpt',
  template: `
    <div id="testContainer"></div>
    <ng-template #content>Hello, {{name}}!</ng-template>
    <ng-template #destroyableContent><destroyable-cmpt></destroyable-cmpt></ng-template>
    <ng-template #contentWithClose let-close="close">
      <button id="close" (click)="close('myResult')">Close me</button>
    </ng-template>
    <ng-template #contentWithDismiss let-dismiss="dismiss">
      <button id="dismiss" (click)="dismiss('myReason')">Dismiss me</button>
    </ng-template>
    <ng-template #contentWithIf>
      <ng-template [ngIf]="show">
        <button id="if" (click)="show = false">Click me</button>
      </ng-template>
    </ng-template>
    <button id="open" (click)="open('from button')">Open</button>
    <div id="open-no-focus" (click)="open('from non focusable element')">Open</div>
    <div
      id="open-no-focus-ie"
      (click)="open('from non focusable element but stored as activeElement on IE')"
      style="display: inline-block;"
    >Open</div>
  `
})
class TestComponent {
  name = 'World';
  openedModal: NgbModalRef;
  show = true;
  @ViewChild('content') tplContent;
  @ViewChild('destroyableContent') tplDestroyableContent;
  @ViewChild('contentWithClose') tplContentWithClose;
  @ViewChild('contentWithDismiss') tplContentWithDismiss;
  @ViewChild('contentWithIf') tplContentWithIf;

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
  openCmpt(cmptType: any, options?: Object) { return this.modalService.open(cmptType, options); }
  openDestroyableTpl(options?: Object) { return this.modalService.open(this.tplDestroyableContent, options); }
  openTplClose(options?: Object) { return this.modalService.open(this.tplContentWithClose, options); }
  openTplDismiss(options?: Object) { return this.modalService.open(this.tplContentWithDismiss, options); }
  openTplIf(options?: Object) { return this.modalService.open(this.tplContentWithIf, options); }
}

@NgModule({
  declarations: [TestComponent, CustomInjectorCmpt, DestroyableCmpt, WithActiveModalCmpt],
  exports: [TestComponent, DestroyableCmpt],
  imports: [CommonModule, NgbModalModule],
  entryComponents: [CustomInjectorCmpt, DestroyableCmpt, WithActiveModalCmpt],
  providers: [SpyService]
})
class NgbModalTestModule {
}
