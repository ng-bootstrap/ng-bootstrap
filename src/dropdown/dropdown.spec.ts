import {inject, async, TestComponentBuilder} from '@angular/core/testing';

import {Component} from '@angular/core';
import {By} from '@angular/platform-browser';

import {NgbDropdown, NgbDropdownToggle} from './dropdown';

function getDropdownEl(tc) {
  return tc.querySelector(`[ngbDropdown]`);
}

describe('ngb-dropdown', () => {
  it('should be closed by default', async(inject([TestComponentBuilder], (tcb) => {
       const html = `<div ngbDropdown></div>`;

       tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();
         const compiled = fixture.nativeElement;

         expect(getDropdownEl(compiled)).toHaveCssClass('dropdown');
         expect(getDropdownEl(compiled)).not.toHaveCssClass('open');
       });
     })));

  it('should be open initially if open expression is true', async(inject([TestComponentBuilder], (tcb) => {
       const html = `<div ngbDropdown [open]="true"></div>`;

       tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();
         const compiled = fixture.nativeElement;

         expect(getDropdownEl(compiled)).toHaveCssClass('dropdown');
         expect(getDropdownEl(compiled)).toHaveCssClass('open');
       });
     })));

  it('should toggle open class', async(inject([TestComponentBuilder], (tcb) => {
       const html = `<div ngbDropdown [open]="isOpen"></div>`;

       tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();
         const compiled = fixture.nativeElement;

         let dropdownEl = getDropdownEl(compiled);

         expect(dropdownEl).not.toHaveCssClass('open');

         fixture.componentInstance.isOpen = true;
         fixture.detectChanges();

         expect(dropdownEl).toHaveCssClass('open');

         fixture.componentInstance.isOpen = false;
         fixture.detectChanges();

         expect(dropdownEl).not.toHaveCssClass('open');
       });
     })));

  it('should allow toggling dropdown from outside', async(inject([TestComponentBuilder], (tcb) => {
       const html = `
      <button (click)="drop.open(); $event.stopPropagation()">Open</button>
      <button (click)="drop.close(); $event.stopPropagation()">Close</button>
      <button (click)="drop.toggle(); $event.stopPropagation()">Toggle</button>
      <div ngbDropdown #drop="ngbDropdown"></div>`;

       tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();
         const compiled = fixture.nativeElement;
         let dropdownEl = getDropdownEl(compiled);
         let buttonEls = compiled.querySelectorAll('button');

         buttonEls[0].click();
         fixture.detectChanges();
         expect(dropdownEl).toHaveCssClass('open');

         buttonEls[1].click();
         fixture.detectChanges();
         expect(dropdownEl).not.toHaveCssClass('open');

         buttonEls[2].click();
         fixture.detectChanges();
         expect(dropdownEl).toHaveCssClass('open');

         buttonEls[2].click();
         fixture.detectChanges();
         expect(dropdownEl).not.toHaveCssClass('open');
       });
     })));

  it('should allow binding to open output', async(inject([TestComponentBuilder], (tcb) => {
       const html = `
      <button (click)="drop.toggle(); $event.stopPropagation()">Toggle</button>
      <div ngbDropdown [(open)]="isOpen" #drop="ngbDropdown"></div>`;

       tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();
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
     })));
});

describe('ngb-dropdown-toggle', () => {
  it('should toggle dropdown on click', async(inject([TestComponentBuilder], (tcb) => {
       const html = `
      <div ngbDropdown>
          <button ngbDropdownToggle>Toggle dropdown</button>
      </div>`;

       tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();
         const compiled = fixture.nativeElement;
         let dropdownEl = getDropdownEl(compiled);
         let buttonEl = compiled.querySelector('button');

         expect(dropdownEl).not.toHaveCssClass('open');
         expect(buttonEl.getAttribute('aria-haspopup')).toBe('true');
         expect(buttonEl.getAttribute('aria-expanded')).toBe('false');

         buttonEl.click();
         fixture.detectChanges();
         expect(dropdownEl).toHaveCssClass('open');
         expect(buttonEl.getAttribute('aria-expanded')).toBe('true');

         buttonEl.click();
         fixture.detectChanges();
         expect(dropdownEl).not.toHaveCssClass('open');
         expect(buttonEl.getAttribute('aria-expanded')).toBe('false');
       });
     })));

  it('should close on outside click', async(inject([TestComponentBuilder], (tcb) => {
       const html = `<button>Outside</button><div ngbDropdown [open]="true"></div>`;

       tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();
         const compiled = fixture.nativeElement;
         let dropdownEl = getDropdownEl(compiled);
         let buttonEl = compiled.querySelector('button');

         fixture.detectChanges();
         expect(dropdownEl).toHaveCssClass('open');

         buttonEl.click();
         fixture.detectChanges();
         expect(dropdownEl).not.toHaveCssClass('open');
       });
     })));

  it('should not close on outside click if autoClose is set to false', async(inject([TestComponentBuilder], (tcb) => {
       const html = `<button>Outside</button><div ngbDropdown [open]="true" [autoClose]="false"></div>`;

       tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();
         const compiled = fixture.nativeElement;
         let dropdownEl = getDropdownEl(compiled);
         let buttonEl = compiled.querySelector('button');

         fixture.detectChanges();
         expect(dropdownEl).toHaveCssClass('open');

         buttonEl.click();
         fixture.detectChanges();
         expect(dropdownEl).toHaveCssClass('open');
       });
     })));

  it('should close on ESC', async(inject([TestComponentBuilder], (tcb) => {
       const html = `
      <div ngbDropdown>
          <button ngbDropdownToggle>Toggle dropdown</button>
      </div>`;

       tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();
         const compiled = fixture.nativeElement;
         let dropdownEl = getDropdownEl(compiled);
         let buttonEl = compiled.querySelector('button');

         buttonEl.click();
         fixture.detectChanges();
         expect(dropdownEl).toHaveCssClass('open');

         fixture.debugElement.query(By.directive(NgbDropdown)).triggerEventHandler('keyup.esc', {});
         fixture.detectChanges();
         expect(dropdownEl).not.toHaveCssClass('open');
       });
     })));

  it('should not close on ESC if autoClose is set to false', async(inject([TestComponentBuilder], (tcb) => {
       const html = `
      <div ngbDropdown [autoClose]="false">
          <button ngbDropdownToggle>Toggle dropdown</button>
      </div>`;

       tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();
         const compiled = fixture.nativeElement;
         let dropdownEl = getDropdownEl(compiled);
         let buttonEl = compiled.querySelector('button');

         buttonEl.click();
         fixture.detectChanges();
         expect(dropdownEl).toHaveCssClass('open');

         fixture.debugElement.query(By.directive(NgbDropdown)).triggerEventHandler('keyup.esc', {});
         fixture.detectChanges();
         expect(dropdownEl).toHaveCssClass('open');
       });
     })));

  it('should close on item click if autoClose is set to false', async(inject([TestComponentBuilder], (tcb) => {
       const html = `
      <div ngbDropdown [open]="true" [autoClose]="false">
          <button ngbDropdownToggle>Toggle dropdown</button>
          <div class="dropdown-menu" aria-labelledby="dropdownMenu1">
            <a class="dropdown-item">Action</a>
          </div>
      </div>`;

       tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();
         const compiled = fixture.nativeElement;
         let dropdownEl = getDropdownEl(compiled);
         let linkEl = compiled.querySelector('a');

         fixture.detectChanges();
         expect(dropdownEl).toHaveCssClass('open');

         linkEl.click();
         fixture.detectChanges();
         expect(dropdownEl).toHaveCssClass('open');
       });
     })));

  it('should not close on item click', async(inject([TestComponentBuilder], (tcb) => {
       const html = `
      <div ngbDropdown [open]="true">
          <button ngbDropdownToggle>Toggle dropdown</button>
          <div class="dropdown-menu" aria-labelledby="dropdownMenu1">
            <a class="dropdown-item">Action</a>
          </div>
      </div>`;

       tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();
         const compiled = fixture.nativeElement;
         let dropdownEl = getDropdownEl(compiled);
         let buttonEl = compiled.querySelector('button');
         let linkEl = compiled.querySelector('a');

         fixture.detectChanges();
         expect(dropdownEl).toHaveCssClass('open');

         linkEl.click();
         fixture.detectChanges();
         expect(dropdownEl).not.toHaveCssClass('open');

         buttonEl.click();
         fixture.detectChanges();
         expect(dropdownEl).toHaveCssClass('open');
       });
     })));
});

@Component({selector: 'test-cmp', directives: [NgbDropdown, NgbDropdownToggle], template: ''})
class TestComponent {
  isOpen = false;
}
