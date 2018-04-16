import {AfterViewInit, Component, ElementRef, Inject, InjectionToken, OnDestroy, ViewChild} from '@angular/core';
import {ComponentFixture, inject, TestBed} from '@angular/core/testing';

import {NgbFocusTrap, NgbFocusTrapFactory} from './focus-trap';

const getElement = (element: HTMLElement, selector: string): HTMLElement => {
  return element.querySelector(selector) as HTMLElement;
};

const Autofocus = new InjectionToken('autofocus');

describe('ngbFocusTrap', () => {
  beforeEach(() => { TestBed.configureTestingModule({providers: [NgbFocusTrapFactory]}); });

  it('should be instantiated manually', inject([NgbFocusTrapFactory], (focusTrapFactory: NgbFocusTrapFactory) => {
       const element = document.createElement('div');
       const focusTrap = focusTrapFactory.create(element);
       expect(focusTrap).toBeDefined();
       focusTrap.destroy();
     }));

  describe('navigation', () => {
    let fixture: ComponentFixture<TestComponent>;
    let instance;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TestComponent, FocusTrapComponent],
        providers: [NgbFocusTrapFactory, {provide: Autofocus, useValue: false}]
      });
      fixture = TestBed.createComponent(TestComponent);
      instance = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should intercept any outside focus when already instantiated', () => {
      const initial = document.querySelector('#initial') as HTMLElement;
      const link = getElement(fixture.nativeElement, 'a');
      initial.focus();
      expect(document.activeElement).toBe(link);
    });

    it('should create/remove the end of document anchor accordingly', () => {
      expect(document.body.querySelector('.ngb-focustrap-eod')).toBeDefined();
      instance.show = false;
      fixture.detectChanges();
      expect(document.body.querySelector('.ngb-focustrap-eod')).toBeNull();
    });
  });

  it('should focus element decorated with ngbAutofocus when created', () => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, FocusTrapComponent],
      providers: [NgbFocusTrapFactory, {provide: Autofocus, useValue: true}]
    });
    const fixture = TestBed.createComponent(TestComponent);
    const instance = fixture.componentInstance;
    instance.show = false;
    fixture.detectChanges();

    // put focus somewhere
    const initial = document.querySelector('#initial') as HTMLElement;
    initial.focus();

    // let's create the focustrap with autofocus (via <focus-trapped>)
    instance.show = true;
    fixture.detectChanges();
    const button = getElement(fixture.nativeElement, 'button');
    expect(document.activeElement).toBe(button);

    // let's destroy the focustrap (removing <focus-trapped>)
    instance.show = false;
    fixture.detectChanges();
    expect(document.activeElement).not.toBe(button);
  });
});

@Component({
  selector: 'focus-trapped',
  template: `
    <div>
      <a href="http://whatever.com">link</a>
      <span>not important</span>
      <button ngbAutofocus>button</button>
      <span>not important</span>
      <select>
        <option>not important</option>
        <option>not important</option>
        <option>not important</option>
      </select>
      <span>not important</span>
    </div>
  `,
})
class FocusTrapComponent implements AfterViewInit,
    OnDestroy {
  focusTrap: NgbFocusTrap | null = null;
  constructor(
      private _focusTrapFactory: NgbFocusTrapFactory, private _element: ElementRef<HTMLElement>,
      @Inject(Autofocus) private _autofocus) {}

  ngAfterViewInit() { this.focusTrap = this._focusTrapFactory.create(this._element.nativeElement, this._autofocus); }

  ngOnDestroy() {
    if (this.focusTrap) {
      this.focusTrap.destroy();
      this.focusTrap = null;
    }
  }
}

@Component({
  template: `
    <div>
      <input type="text" id="initial" />
      <focus-trapped *ngIf="show"></focus-trapped>
    </div>
  `
})
class TestComponent {
  show = true;
  @ViewChild(FocusTrapComponent) wrapper;
}
