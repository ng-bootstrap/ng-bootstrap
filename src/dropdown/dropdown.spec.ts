import {ComponentFixture, inject, TestBed} from '@angular/core/testing';
import {createGenericTestComponent, createKeyEvent} from '../test/common';
import {Key} from '../util/key';

import {ChangeDetectionStrategy, Component, DebugElement} from '@angular/core';

import {NgbDropdown, NgbDropdownModule} from './dropdown.module';
import {NgbDropdownConfig} from './dropdown-config';
import {By} from '@angular/platform-browser';

const createTestComponent = (html: string) =>
    createGenericTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;

function getDropdownEl(tc) {
  return tc.querySelector(`[ngbDropdown]`);
}

function getMenuEl(tc) {
  return tc.querySelector(`[ngbDropdownMenu]`);
}

function createFakeEscapeKeyUpEvent(): Event {
  return createKeyEvent(Key.Escape);
}

function createKeyDownEvent(key: number, target?: HTMLElement) {
  const event = {which: key, preventDefault: () => {}, stopPropagation: () => {}, target};
  spyOn(event, 'preventDefault');
  spyOn(event, 'stopPropagation');
  return event;
}

function triggerKeyDownEvent(element: DebugElement, key: number, target?: HTMLElement) {
  const event = createKeyDownEvent(key, target);
  switch (key) {
    case Key.ArrowDown:
      element.triggerEventHandler('keydown.ArrowDown', event);
      break;
    case Key.ArrowUp:
      element.triggerEventHandler('keydown.ArrowDown', event);
      break;
    case Key.Home:
      element.triggerEventHandler('keydown.Home', event);
      break;
    case Key.End:
      element.triggerEventHandler('keydown.End', event);
      break;
  }
}

function getDebugInput(element: DebugElement): DebugElement {
  return element.query(By.directive(NgbDropdown));
}

function getDebugInputs(element: DebugElement): DebugElement[] {
  return element.queryAll(By.directive(NgbDropdown));
}

const jasmineMatchers = {
  toBeShown: function(util, customEqualityTests) {
    return {
      compare: function(actual, content?, selector?) {
        const dropdownEl = getDropdownEl(actual);
        const menuEl = getMenuEl(actual);
        const isOpen = dropdownEl.classList.contains('show') && menuEl.classList.contains('show');

        return {
          pass: isOpen,
          message: `Expected ${actual.outerHTML} to have the "show class on both container and menu"`
        };
      },
      negativeCompare: function(actual) {
        const dropdownEl = getDropdownEl(actual);
        const menuEl = getMenuEl(actual);
        const isClosed = !dropdownEl.classList.contains('show') && !menuEl.classList.contains('show');

        return {
          pass: isClosed,
          message: `Expected ${actual.outerHTML} not to have the "show class both container and menu"`
        };
      }
    };
  }
};

describe('ngb-dropdown', () => {

  beforeEach(() => {
    jasmine.addMatchers(jasmineMatchers);
    TestBed.configureTestingModule({declarations: [TestComponent], imports: [NgbDropdownModule]});
  });

  it('should be closed and down by default', () => {
    const html = `
      <div ngbDropdown>
          <button ngbDropdownAnchor></button>
          <div ngbDropdownMenu>
            <a class="dropdown-item">dropDown item</a>
            <a class="dropdown-item">dropDown item</a>
          </div>
      </div>`;

    const fixture = createTestComponent(html);
    const compiled = fixture.nativeElement;

    expect(compiled).not.toBeShown();
  });

  it('should have dropup CSS class if placed on top', () => {
    const html = `
      <div ngbDropdown placement="top">
          <button ngbDropdownAnchor></button>
          <div ngbDropdownMenu>
            <a class="dropdown-item">dropDown item</a>
            <a class="dropdown-item">dropDown item</a>
          </div>
      </div>`;

    const fixture = createTestComponent(html);
    const compiled = fixture.nativeElement;

    expect(getDropdownEl(compiled)).toHaveCssClass('dropup');
  });

  it('should have dropdown CSS class if placement is other than top', () => {
    const html = `
      <div ngbDropdown placement="bottom">
          <button ngbDropdownAnchor></button>
          <div ngbDropdownMenu>
            <a class="dropdown-item">dropDown item</a>
            <a class="dropdown-item">dropDown item</a>
          </div>
      </div>`;

    const fixture = createTestComponent(html);
    const compiled = fixture.nativeElement;

    expect(getDropdownEl(compiled)).toHaveCssClass('dropdown');
  });

  it('should have x-placement attribute reflecting placement', () => {
    const html = `
      <div ngbDropdown placement="bottom-right">
          <button ngbDropdownAnchor></button>
          <div ngbDropdownMenu>
            <a class="dropdown-item">dropDown item</a>
            <a class="dropdown-item">dropDown item</a>
          </div>
      </div>`;

    const fixture = createTestComponent(html);
    const compiled = fixture.nativeElement;

    expect(getMenuEl(compiled).getAttribute('x-placement')).toBe('bottom-right');
  });

  it('should be open initially if open expression is true', () => {
    const html = `
      <div ngbDropdown [open]="true">
          <button ngbDropdownAnchor></button>
          <div ngbDropdownMenu>
            <a class="dropdown-item">dropDown item</a>
            <a class="dropdown-item">dropDown item</a>
          </div>
      </div>`;

    const fixture = createTestComponent(html);
    const compiled = fixture.nativeElement;

    expect(compiled).toBeShown();
  });

  it('should toggle open on "open" binding change', () => {
    const html = `
      <div ngbDropdown [open]="isOpen">
        <button ngbDropdownAnchor></button>
        <div ngbDropdownMenu></div>
      </div>`;

    const fixture = createTestComponent(html);
    const compiled = fixture.nativeElement;

    expect(compiled).not.toBeShown();

    fixture.componentInstance.isOpen = true;
    fixture.detectChanges();
    expect(compiled).toBeShown();

    fixture.componentInstance.isOpen = false;
    fixture.detectChanges();
    expect(compiled).not.toBeShown();
  });

  it('should allow toggling dropdown from outside', () => {
    const html = `
      <button (click)="drop.open(); $event.stopPropagation()">Open</button>
      <button (click)="drop.close(); $event.stopPropagation()">Close</button>
      <button (click)="drop.toggle(); $event.stopPropagation()">Toggle</button>
      <div ngbDropdown #drop="ngbDropdown">
        <button ngbDropdownAnchor></button>
        <div ngbDropdownMenu></div>
      </div>`;

    const fixture = createTestComponent(html);
    const compiled = fixture.nativeElement;
    let buttonEls = compiled.querySelectorAll('button');

    buttonEls[0].click();
    fixture.detectChanges();
    expect(compiled).toBeShown();

    buttonEls[1].click();
    fixture.detectChanges();
    expect(compiled).not.toBeShown();

    buttonEls[2].click();
    fixture.detectChanges();
    expect(compiled).toBeShown();

    buttonEls[2].click();
    fixture.detectChanges();
    expect(compiled).not.toBeShown();
  });

  it('should allow binding to open output', () => {
    const html = `
      <button (click)="drop.toggle(); $event.stopPropagation()">Toggle</button>
      <div ngbDropdown [(open)]="isOpen" #drop="ngbDropdown"></div>`;

    const fixture = createTestComponent(html);
    const compiled = fixture.nativeElement;
    let buttonEl = compiled.querySelector('button');

    expect(fixture.componentInstance.isOpen).toBe(false);

    buttonEl.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.isOpen).toBe(true);

    buttonEl.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.isOpen).toBe(false);
  });

  it('should not raise open events if open state does not change', () => {
    const html = `
      <button (click)="drop.open(); $event.stopPropagation()">Open</button>
      <button (click)="drop.close(); $event.stopPropagation()">Close</button>
      <div ngbDropdown (openChange)="recordStateChange($event)" #drop="ngbDropdown"></div>`;

    const fixture = createTestComponent(html);
    const compiled = fixture.nativeElement;
    let buttonEls = compiled.querySelectorAll('button');

    expect(fixture.componentInstance.isOpen).toBe(false);
    expect(fixture.componentInstance.stateChanges).toEqual([]);

    buttonEls[1].click();  // close a closed one
    fixture.detectChanges();
    expect(fixture.componentInstance.isOpen).toBe(false);
    expect(fixture.componentInstance.stateChanges).toEqual([]);

    buttonEls[0].click();  // open a closed one
    fixture.detectChanges();
    expect(fixture.componentInstance.isOpen).toBe(true);
    expect(fixture.componentInstance.stateChanges).toEqual([true]);

    buttonEls[0].click();  // open an opened one
    fixture.detectChanges();
    expect(fixture.componentInstance.isOpen).toBe(true);
    expect(fixture.componentInstance.stateChanges).toEqual([true]);

    buttonEls[1].click();  // close an opened one
    fixture.detectChanges();
    expect(fixture.componentInstance.isOpen).toBe(false);
    expect(fixture.componentInstance.stateChanges).toEqual([true, false]);
  });

  describe('Arrow Key Navigation', () => {
    it('should select the first element on ArrowDown if focus is not on any element in list', () => {
      const fixture = createTestComponent(
          `<div ngbDropdown id="ngbDropdown" (openChange)="recordStateChange($event)" [open]="isOpen">
      <button ngbDropdownToggle>Toggle dropdown 1</button>
      <div ngbDropdownMenu>
        <button ngbDropdownItem>Action 1</button>
        <button ngbDropdownItem>Action 2</button>
      </div>
    </div>`);
      const compiled = fixture.nativeElement;
      const target = compiled.querySelector('button[ngbDropdownToggle]');
      fixture.componentInstance.isOpen = true;
      const elms = compiled.querySelectorAll('.dropdown-item');
      spyOn(elms[0], 'focus');
      triggerKeyDownEvent(getDebugInput(fixture.debugElement), Key.ArrowDown, target);
      fixture.detectChanges();
      expect(elms[0].focus).toHaveBeenCalled();
    });

    it('should select the bottom element of the dropup on ArrowUp if focus is not on any element in list', () => {
      const fixture = createTestComponent(
          `<div ngbDropdown id="ngbDropdown" placement="top" (openChange)="recordStateChange($event)" [open]="isOpen">
      <button ngbDropdownToggle>Toggle dropdown 1</button>
      <div ngbDropdownMenu>
        <button ngbDropdownItem>Action 1</button>
        <button ngbDropdownItem>Action 2</button>
      </div>
    </div>`);
      const compiled = fixture.nativeElement;
      const target = compiled.querySelector('button[ngbDropdownToggle]');
      fixture.componentInstance.isOpen = true;
      const elms = compiled.querySelectorAll('.dropdown-item');
      spyOn(elms[1], 'focus');
      triggerKeyDownEvent(getDebugInput(fixture.debugElement), Key.ArrowUp, target);
      fixture.detectChanges();
      expect(elms[1].focus).toHaveBeenCalled();
    });

    it('should select the next element on ArrowDown if is on a element in list', () => {
      const fixture = createTestComponent(
          `<div ngbDropdown id="ngbDropdown" (openChange)="recordStateChange($event)" [open]="isOpen">
      <button ngbDropdownToggle>Toggle dropdown 1</button>
      <div ngbDropdownMenu>
        <button ngbDropdownItem>Action 1</button>
        <button ngbDropdownItem>Action 2</button>
      </div>
    </div>`);
      const compiled = fixture.nativeElement;
      fixture.componentInstance.isOpen = true;
      const elms = compiled.querySelectorAll('.dropdown-item');
      elms[0].focus();
      spyOn(elms[1], 'focus');
      triggerKeyDownEvent(getDebugInput(fixture.debugElement), Key.ArrowDown, elms[0]);
      fixture.detectChanges();
      expect(elms[1].focus).toHaveBeenCalled();
    });

    it('should select the next element on ArrowDown when the next element in the list is added later', () => {
      const fixture = createTestComponent(
          `<div ngbDropdown id="ngbDropdown" (openChange)="recordStateChange($event)" [open]="isOpen">
      <button ngbDropdownToggle>Toggle dropdown 1</button>
      <div ngbDropdownMenu>
        <button ngbDropdownItem *ngFor="let item of items">{{item}}</button>
      </div>
    </div>`);
      const compiled = fixture.nativeElement;
      fixture.componentInstance.isOpen = true;
      fixture.componentInstance.items = ['Item 1', 'item 2'];
      fixture.detectChanges();
      const elms = compiled.querySelectorAll('.dropdown-item');
      elms[0].focus();
      spyOn(elms[1], 'focus');
      triggerKeyDownEvent(getDebugInput(fixture.debugElement), Key.ArrowDown, elms[0]);
      fixture.detectChanges();
      expect(elms[1].focus).toHaveBeenCalled();
    });

    it('should select the previous element on ArrowUp', () => {
      const fixture = createTestComponent(
          `<div ngbDropdown id="ngbDropdown" (openChange)="recordStateChange($event)" [open]="isOpen">
      <button ngbDropdownToggle>Toggle dropdown 1</button>
      <div ngbDropdownMenu>
        <button ngbDropdownItem>Action 1</button>
        <button ngbDropdownItem>Action 2</button>
      </div>
    </div>`);
      const compiled = fixture.nativeElement;
      fixture.componentInstance.isOpen = true;
      const elms = compiled.querySelectorAll('.dropdown-item');
      elms[1].focus();
      spyOn(elms[0], 'focus');
      triggerKeyDownEvent(getDebugInput(fixture.debugElement), Key.ArrowUp, elms[1]);
      fixture.detectChanges();
      expect(elms[0].focus).toHaveBeenCalled();
    });

    it('should stay on the same element on ArrowDown if the last element of the list is selected', () => {
      const fixture = createTestComponent(
          `<div ngbDropdown id="ngbDropdown" (openChange)="recordStateChange($event)" [open]="isOpen">
      <button ngbDropdownToggle>Toggle dropdown 1</button>
      <div ngbDropdownMenu>
        <button ngbDropdownItem>Action 1</button>
        <button ngbDropdownItem>Action 2</button>
      </div>
    </div>`);
      const compiled = fixture.nativeElement;
      fixture.componentInstance.isOpen = true;
      const elms = compiled.querySelectorAll('.dropdown-item');
      elms[1].focus();
      spyOn(elms[1], 'focus');
      triggerKeyDownEvent(getDebugInput(fixture.debugElement), Key.ArrowDown, elms[1]);
      fixture.detectChanges();
      expect(elms[1].focus).toHaveBeenCalled();
    });

    it('should skip disabled elements on ArrowDown if is on a element in list', () => {
      const fixture = createTestComponent(
          `<div ngbDropdown id="ngbDropdown" (openChange)="recordStateChange($event)" [open]="isOpen">
      <button ngbDropdownToggle>Toggle dropdown 1</button>
      <div ngbDropdownMenu>
        <button ngbDropdownItem>Action 1</button>
        <button ngbDropdownItem [disabled]="true">Action 2</button>
        <button ngbDropdownItem>Action 3</button>
      </div>
    </div>`);
      const compiled = fixture.nativeElement;
      fixture.componentInstance.isOpen = true;
      const elms = compiled.querySelectorAll('.dropdown-item');
      elms[0].focus();
      spyOn(elms[2], 'focus');
      triggerKeyDownEvent(getDebugInput(fixture.debugElement), Key.ArrowDown, elms[0]);
      fixture.detectChanges();
      expect(elms[2].focus).toHaveBeenCalled();
    });

    it('should select the first element on Home if there are elements in the list', () => {
      const fixture = createTestComponent(
          `<div ngbDropdown id="ngbDropdown" (openChange)="recordStateChange($event)" [open]="isOpen">
      <button ngbDropdownToggle>Toggle dropdown 1</button>
      <div ngbDropdownMenu>
        <button ngbDropdownItem>Action 1</button>
        <button ngbDropdownItem>Action 2</button>
        <button ngbDropdownItem>Action 3</button>
      </div>
    </div>`);
      const compiled = fixture.nativeElement;
      fixture.componentInstance.isOpen = true;
      const elms = compiled.querySelectorAll('.dropdown-item');
      elms[2].focus();
      spyOn(elms[0], 'focus');
      triggerKeyDownEvent(getDebugInput(fixture.debugElement), Key.Home, elms[2]);
      fixture.detectChanges();
      expect(elms[0].focus).toHaveBeenCalled();
    });

    it('should select the last element on End if there are elements in the list', () => {
      const fixture = createTestComponent(
          `<div ngbDropdown id="ngbDropdown" (openChange)="recordStateChange($event)" [open]="isOpen">
      <button ngbDropdownToggle>Toggle dropdown 1</button>
      <div ngbDropdownMenu>
        <button ngbDropdownItem>Action 1</button>
        <button ngbDropdownItem>Action 2</button>
        <button ngbDropdownItem>Action 3</button>
      </div>
    </div>`);
      const compiled = fixture.nativeElement;
      fixture.componentInstance.isOpen = true;
      const elms = compiled.querySelectorAll('.dropdown-item');
      elms[0].focus();
      spyOn(elms[2], 'focus');
      triggerKeyDownEvent(getDebugInput(fixture.debugElement), Key.End, elms[0]);
      fixture.detectChanges();
      expect(elms[2].focus).toHaveBeenCalled();
    });

    it('should select the first element on ArrowDown in a nested dropdown', () => {
      const fixture = createTestComponent(`<div ngbDropdown id="ngbDropdown" [open]="true">
      <button ngbDropdownToggle>Toggle dropdown 1</button>
      <div ngbDropdownMenu>
        <div ngbDropdown id="nestedDropdown" [open]="isOpen">
          <input ngbDropdownAnchor/>
          <div ngbDropdownMenu>
            <button ngbDropdownItem>Action 1</button>
            <button ngbDropdownItem>Action 2</button>
            <button ngbDropdownItem>Action 3</button>
          </div>
        </div>
      </div>
    </div>`);
      const[buttonElement, inputElement] = getDebugInputs(fixture.debugElement);

      const compiled = fixture.nativeElement;
      fixture.componentInstance.isOpen = true;
      const input = compiled.querySelector('input[ngbDropdownAnchor]');
      const elms = compiled.querySelectorAll('#nestedDropdown .dropdown-item');
      spyOn(elms[0], 'focus');
      spyOn(elms[1], 'focus');
      spyOn(elms[2], 'focus');
      triggerKeyDownEvent(buttonElement, Key.ArrowDown, input);
      expect(elms[0].focus).not.toHaveBeenCalled();
      expect(elms[1].focus).not.toHaveBeenCalled();
      expect(elms[2].focus).not.toHaveBeenCalled();

      triggerKeyDownEvent(inputElement, Key.ArrowDown, input);
      fixture.detectChanges();

      expect(elms[0].focus.calls.count()).toBe(1);
      expect(elms[1].focus).not.toHaveBeenCalled();
      expect(elms[2].focus).not.toHaveBeenCalled();
    });
  });
});

describe('ngb-dropdown-toggle', () => {
  beforeEach(() => {
    jasmine.addMatchers(jasmineMatchers);
    TestBed.configureTestingModule({declarations: [TestComponent], imports: [NgbDropdownModule]});
  });

  it('should toggle dropdown on click', () => {
    const html = `
      <div ngbDropdown>
          <button ngbDropdownToggle>Toggle dropdown</button>
          <div ngbDropdownMenu></div>
      </div>`;

    const fixture = createTestComponent(html);
    const compiled = fixture.nativeElement;
    let dropdownEl = getDropdownEl(compiled);
    let buttonEl = compiled.querySelector('button');

    expect(dropdownEl).not.toHaveCssClass('show');
    expect(buttonEl.getAttribute('aria-haspopup')).toBe('true');
    expect(buttonEl.getAttribute('aria-expanded')).toBe('false');

    buttonEl.click();
    fixture.detectChanges();
    expect(compiled).toBeShown();
    expect(buttonEl.getAttribute('aria-expanded')).toBe('true');

    buttonEl.click();
    fixture.detectChanges();
    expect(compiled).not.toBeShown();
    expect(buttonEl.getAttribute('aria-expanded')).toBe('false');
  });

  it('should toggle dropdown on click of child of toggle', () => {
    const html = `
      <div ngbDropdown>
          <button ngbDropdownToggle>
            <span class="toggle">Toggle dropdown</span>
          </button>
          <div ngbDropdownMenu></div>
      </div>`;

    const fixture = createTestComponent(html);
    const compiled = fixture.nativeElement;
    const toggleEl = compiled.querySelector('.toggle');

    expect(compiled).not.toBeShown();

    toggleEl.click();
    fixture.detectChanges();
    expect(compiled).toBeShown();

    toggleEl.click();
    fixture.detectChanges();
    expect(compiled).not.toBeShown();
  });

  describe('Custom config', () => {
    let config: NgbDropdownConfig;

    beforeEach(() => {
      TestBed.configureTestingModule({imports: [NgbDropdownModule]});
      TestBed.overrideComponent(TestComponent, {
        set: {
          template: `
      <div ngbDropdown>
          <div ngbDropdownMenu>
            <a ngbDropdownItem>dropDown item</a>
            <a ngbDropdownItem>dropDown item</a>
          </div>
      </div>`
        }
      });
    });

    beforeEach(inject([NgbDropdownConfig], (c: NgbDropdownConfig) => {
      config = c;
      config.placement = 'top-right';
    }));

    it('should initialize inputs with provided config', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;

      expect(getDropdownEl(compiled)).toHaveCssClass('dropup');
    });
  });

  describe('Custom config as provider', () => {
    let config = new NgbDropdownConfig();
    config.placement = 'top-right';

    beforeEach(() => {
      TestBed.configureTestingModule(
          {imports: [NgbDropdownModule], providers: [{provide: NgbDropdownConfig, useValue: config}]});
    });

    it('should initialize inputs with provided config as provider', () => {
      const fixture = createTestComponent(`
      <div ngbDropdown>
          <div ngbDropdownMenu>
            <a ngbDropdownItem>dropup item</a>
            <a ngbDropdownItem>dropup item</a>
          </div>
      </div>`);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;

      expect(getDropdownEl(compiled)).toHaveCssClass('dropup');
    });
  });
});

@Component({selector: 'test-cmp', template: ''})
class TestComponent {
  isOpen = false;
  stateChanges = [];
  items = [];

  recordStateChange($event) {
    this.stateChanges.push($event);
    this.isOpen = $event;
  }
}
