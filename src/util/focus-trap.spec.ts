import {Component, ElementRef} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ngbFocusTrap} from './focus-trap';
import {Subject} from 'rxjs/internal/Subject';

describe('ngbFocusTrap', () => {

  let fixture: ComponentFixture<TestComponent>;
  let instance;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [TestComponent, FocusTrapComponent]});
    fixture = TestBed.createComponent(TestComponent);
    instance = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should re-focus previously focused element inside the focus trap element', () => {
    instance.show = true;
    fixture.detectChanges();

    // initial focus inside
    const initiallyFocused = document.querySelector('[autofocus]') as HTMLElement;
    initiallyFocused.focus();

    // focus outside
    const outsideElement = document.querySelector('#outside') as HTMLElement;
    outsideElement.focus();
    expect(document.activeElement).toBe(outsideElement);
    expect(document.activeElement).not.toBe(initiallyFocused);

    // click inside
    const insideElement = document.querySelector('select') as HTMLElement;
    insideElement.click();
    expect(document.activeElement).toBe(initiallyFocused);
  });

});

@Component({
  selector: 'focus-trapped',
  template: `
    <div>
      <a href="http://whatever.com">link</a>
      <span>not important</span>
      <button autofocus>button</button>
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
class FocusTrapComponent {
  private _takeUntil$ = new Subject();

  constructor(element: ElementRef<HTMLElement>) { ngbFocusTrap(element.nativeElement, this._takeUntil$); }

  ngOnDestroy() { this._takeUntil$.next(); }
}

@Component({
  template: `
    <div>
      <input type="text" id="outside" />
      <focus-trapped *ngIf="show"></focus-trapped>
    </div>
  `
})
class TestComponent {
  show = true;
}
