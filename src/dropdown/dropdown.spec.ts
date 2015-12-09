import {
  iit,
  it,
  ddescribe,
  describe,
  expect,
  inject,
  injectAsync,
  TestComponentBuilder,
  beforeEachProviders
} from 'angular2/testing';

import {Component} from 'angular2/core';

import {NgbDropdown, NgbDropdownToggle} from './dropdown';

function getDropdownEl(tc) {
  return tc.querySelector(`[ngb-dropdown]`);
}

describe('ngb-dropdown', () => {
  it('should be closed by default', injectAsync([TestComponentBuilder], (tcb) => {
       const html = `<div ngb-dropdown></div>`;

       return tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();
         const compiled = fixture.nativeElement;

         expect(getDropdownEl(compiled)).not.toHaveCssClass('open');
       });
     }));

  it('should be open initially if open expression is true', injectAsync([TestComponentBuilder], (tcb) => {
       const html = `<div ngb-dropdown [open]="true"></div>`;

       return tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();
         const compiled = fixture.nativeElement;

         expect(getDropdownEl(compiled)).toHaveCssClass('open');
       });
     }));

  it('should toggle open class', injectAsync([TestComponentBuilder], (tcb) => {
       const html = `<div ngb-dropdown [open]="isOpen"></div>`;

       return tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
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
     }));

  it('should allow toggling dropdown from outside', injectAsync([TestComponentBuilder], (tcb) => {
       const html = `
      <button (click)="drop.open = !drop.open">Toggle</button>
      <div ngb-dropdown #drop="ngbDropdown"></div>`;

       return tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();
         const compiled = fixture.nativeElement;
         let dropdownEl = getDropdownEl(compiled);
         let buttonEl = compiled.querySelector('button');

         buttonEl.click();
         fixture.detectChanges();
         expect(dropdownEl).toHaveCssClass('open');

         buttonEl.click();
         fixture.detectChanges();
         expect(dropdownEl).not.toHaveCssClass('open');
       });
     }));
});

describe('ngb-dropdown-toggle', () => {

  it('should toggle dropdown on click', injectAsync([TestComponentBuilder], (tcb) => {
       const html = `
      <div ngb-dropdown>
          <button ngb-dropdown-toggle class="btn btn-success" type="button">
            Toggle dropdown
          </button>
      </div>`;

       return tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
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
     }));
});

@Component({selector: 'test-cmp', directives: [NgbDropdown, NgbDropdownToggle], template: ''})
class TestComponent {
  isOpen = false;
}
