import {TestBed, ComponentFixture, inject} from '@angular/core/testing';
import {createGenericTestComponent} from '../test/common';

import {Component} from '@angular/core';
import {By} from '@angular/platform-browser';

import {NgbDropdownModule} from './dropdown.module';
import {NgbDropdown} from './dropdown';
import {NgbDropdownConfig} from './dropdown-config';

const createTestComponent = (html: string) =>
    createGenericTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;

function getDropdownEl(tc) {
  return tc.querySelector(`[ngbDropdown]`);
}

describe('ngb-dropdown', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [TestComponent], imports: [NgbDropdownModule.forRoot()]});
  });

  it('should initialize inputs with provided config', () => {
    const defaultConfig = new NgbDropdownConfig();
    const dropdown = new NgbDropdown(defaultConfig);
    expect(dropdown.up).toBe(defaultConfig.up);
    expect(dropdown.autoClose).toBe(defaultConfig.autoClose);
  });

  it('should be closed and down by default', () => {
    const html = `<div ngbDropdown></div>`;

    const fixture = createTestComponent(html);
    const compiled = fixture.nativeElement;

    expect(getDropdownEl(compiled)).toHaveCssClass('dropdown');
    expect(getDropdownEl(compiled)).not.toHaveCssClass('show');
  });

  it('should be up if up input is true', () => {
    const html = `<div ngbDropdown [up]="true"></div>`;

    const fixture = createTestComponent(html);
    const compiled = fixture.nativeElement;

    expect(getDropdownEl(compiled)).toHaveCssClass('dropup');
  });

  it('should be open initially if open expression is true', () => {
    const html = `<div ngbDropdown [open]="true"></div>`;

    const fixture = createTestComponent(html);
    const compiled = fixture.nativeElement;

    expect(getDropdownEl(compiled)).toHaveCssClass('dropdown');
    expect(getDropdownEl(compiled)).toHaveCssClass('show');
  });

  it('should toggle open class', () => {
    const html = `<div ngbDropdown [open]="isOpen"></div>`;

    const fixture = createTestComponent(html);
    const compiled = fixture.nativeElement;

    let dropdownEl = getDropdownEl(compiled);

    expect(dropdownEl).not.toHaveCssClass('show');

    fixture.componentInstance.isOpen = true;
    fixture.detectChanges();

    expect(dropdownEl).toHaveCssClass('show');

    fixture.componentInstance.isOpen = false;
    fixture.detectChanges();

    expect(dropdownEl).not.toHaveCssClass('show');
  });

  it('should allow toggling dropdown from outside', () => {
    const html = `
      <button (click)="drop.open(); $event.stopPropagation()">Open</button>
      <button (click)="drop.close(); $event.stopPropagation()">Close</button>
      <button (click)="drop.toggle(); $event.stopPropagation()">Toggle</button>
      <div ngbDropdown #drop="ngbDropdown"></div>`;

    const fixture = createTestComponent(html);
    const compiled = fixture.nativeElement;
    let dropdownEl = getDropdownEl(compiled);
    let buttonEls = compiled.querySelectorAll('button');

    buttonEls[0].click();
    fixture.detectChanges();
    expect(dropdownEl).toHaveCssClass('show');

    buttonEls[1].click();
    fixture.detectChanges();
    expect(dropdownEl).not.toHaveCssClass('show');

    buttonEls[2].click();
    fixture.detectChanges();
    expect(dropdownEl).toHaveCssClass('show');

    buttonEls[2].click();
    fixture.detectChanges();
    expect(dropdownEl).not.toHaveCssClass('show');
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
});

describe('ngb-dropdown-toggle', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [TestComponent], imports: [NgbDropdownModule.forRoot()]});
  });

  it('should toggle dropdown on click', () => {
    const html = `
      <div ngbDropdown>
          <button ngbDropdownToggle>Toggle dropdown</button>
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
    expect(dropdownEl).toHaveCssClass('show');
    expect(buttonEl.getAttribute('aria-expanded')).toBe('true');

    buttonEl.click();
    fixture.detectChanges();
    expect(dropdownEl).not.toHaveCssClass('show');
    expect(buttonEl.getAttribute('aria-expanded')).toBe('false');
  });

  it('should toggle dropdown on click of child of toggle', () => {
    const html = `
      <div ngbDropdown>
          <button ngbDropdownToggle>
            <span class="toggle">Toggle dropdown</span>
          </button>
      </div>`;

    const fixture = createTestComponent(html);
    const compiled = fixture.nativeElement;
    let dropdownEl = getDropdownEl(compiled);
    let toggleEl = compiled.querySelector('.toggle');

    expect(dropdownEl).not.toHaveCssClass('show');

    toggleEl.click();
    fixture.detectChanges();
    expect(dropdownEl).toHaveCssClass('show');

    toggleEl.click();
    fixture.detectChanges();
    expect(dropdownEl).not.toHaveCssClass('show');
  });

  it('should close on outside click', () => {
    const html = `<button>Outside</button><div ngbDropdown [open]="true"></div>`;

    const fixture = createTestComponent(html);
    const compiled = fixture.nativeElement;
    let dropdownEl = getDropdownEl(compiled);
    let buttonEl = compiled.querySelector('button');

    fixture.detectChanges();
    expect(dropdownEl).toHaveCssClass('show');

    buttonEl.click();
    fixture.detectChanges();
    expect(dropdownEl).not.toHaveCssClass('show');
  });

  it('should not close on outside click if autoClose is set to false', () => {
    const html = `<button>Outside</button><div ngbDropdown [open]="true" [autoClose]="false"></div>`;

    const fixture = createTestComponent(html);
    const compiled = fixture.nativeElement;
    let dropdownEl = getDropdownEl(compiled);
    let buttonEl = compiled.querySelector('button');

    fixture.detectChanges();
    expect(dropdownEl).toHaveCssClass('show');

    buttonEl.click();
    fixture.detectChanges();
    expect(dropdownEl).toHaveCssClass('show');
  });

  it('should close on ESC', () => {
    const html = `
      <div ngbDropdown>
          <button ngbDropdownToggle>Toggle dropdown</button>
      </div>`;

    const fixture = createTestComponent(html);
    const compiled = fixture.nativeElement;
    let dropdownEl = getDropdownEl(compiled);
    let buttonEl = compiled.querySelector('button');

    buttonEl.click();
    fixture.detectChanges();
    expect(dropdownEl).toHaveCssClass('show');

    fixture.debugElement.query(By.directive(NgbDropdown)).triggerEventHandler('keyup.esc', {});
    fixture.detectChanges();
    expect(dropdownEl).not.toHaveCssClass('show');
  });

  it('should not close on ESC if autoClose is set to false', () => {
    const html = `
      <div ngbDropdown [autoClose]="false">
          <button ngbDropdownToggle>Toggle dropdown</button>
      </div>`;

    const fixture = createTestComponent(html);
    const compiled = fixture.nativeElement;
    let dropdownEl = getDropdownEl(compiled);
    let buttonEl = compiled.querySelector('button');

    buttonEl.click();
    fixture.detectChanges();
    expect(dropdownEl).toHaveCssClass('show');

    fixture.debugElement.query(By.directive(NgbDropdown)).triggerEventHandler('keyup.esc', {});
    fixture.detectChanges();
    expect(dropdownEl).toHaveCssClass('show');
  });

  it('should close on item click if autoClose is set to false', () => {
    const html = `
      <div ngbDropdown [open]="true" [autoClose]="false">
          <button ngbDropdownToggle>Toggle dropdown</button>
          <div class="dropdown-menu" aria-labelledby="dropdownMenu1">
            <a class="dropdown-item">Action</a>
          </div>
      </div>`;

    const fixture = createTestComponent(html);
    const compiled = fixture.nativeElement;
    let dropdownEl = getDropdownEl(compiled);
    let linkEl = compiled.querySelector('a');

    fixture.detectChanges();
    expect(dropdownEl).toHaveCssClass('show');

    linkEl.click();
    fixture.detectChanges();
    expect(dropdownEl).toHaveCssClass('show');
  });

  it('should close on item click', () => {
    const html = `
      <div ngbDropdown [open]="true">
          <button ngbDropdownToggle>Toggle dropdown</button>
          <div class="dropdown-menu" aria-labelledby="dropdownMenu1">
            <a class="dropdown-item">Action</a>
          </div>
      </div>`;

    const fixture = createTestComponent(html);
    const compiled = fixture.nativeElement;
    let dropdownEl = getDropdownEl(compiled);
    let linkEl = compiled.querySelector('a');

    fixture.detectChanges();
    expect(dropdownEl).toHaveCssClass('show');

    linkEl.click();
    fixture.detectChanges();
    expect(dropdownEl).not.toHaveCssClass('show');
  });


  it('should close on other dropdown click', () => {
    const html = `
      <div ngbDropdown>
          <button ngbDropdownToggle>Toggle dropdown 1</button>
          <div class="dropdown-menu">
            <a class="dropdown-item">Action 1</a>
          </div>
      </div>
      <div ngbDropdown>
          <button ngbDropdownToggle>Toggle dropdown 2</button>
          <div class="dropdown-menu">
            <a class="dropdown-item">Action 2</a>
          </div>
      </div>`;

    const fixture = createTestComponent(html);
    const compiled = fixture.nativeElement;

    const buttonEls = compiled.querySelectorAll('button');
    const dropdownEls = compiled.querySelectorAll('div[ngbDropdown]');

    fixture.detectChanges();
    expect(dropdownEls[0]).not.toHaveCssClass('show');
    expect(dropdownEls[1]).not.toHaveCssClass('show');

    buttonEls[0].click();
    fixture.detectChanges();
    expect(dropdownEls[0]).toHaveCssClass('show');
    expect(dropdownEls[1]).not.toHaveCssClass('show');

    buttonEls[1].click();
    fixture.detectChanges();
    expect(dropdownEls[0]).not.toHaveCssClass('show');
    expect(dropdownEls[1]).toHaveCssClass('show');
  });

  describe('Custom config', () => {
    let config: NgbDropdownConfig;

    beforeEach(() => {
      TestBed.configureTestingModule({imports: [NgbDropdownModule.forRoot()]});
      TestBed.overrideComponent(TestComponent, {set: {template: '<div ngbDropdown></div>'}});
    });

    beforeEach(inject([NgbDropdownConfig], (c: NgbDropdownConfig) => {
      config = c;
      config.up = true;
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
    config.up = true;

    beforeEach(() => {
      TestBed.configureTestingModule(
          {imports: [NgbDropdownModule.forRoot()], providers: [{provide: NgbDropdownConfig, useValue: config}]});
    });

    it('should initialize inputs with provided config as provider', () => {
      const fixture = createTestComponent('<div ngbDropdown></div>');
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

  recordStateChange($event) {
    this.stateChanges.push($event);
    this.isOpen = $event;
  }
}
