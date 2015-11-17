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

import {Component} from 'angular2/angular2';

import {NgbDropdown} from './dropdown';

function getDropdownEl(tc) {
  return tc.querySelector(`ngb-dropdown`);
}

describe('ngb-dropdown', () => {
  it('should be closed by default', injectAsync([TestComponentBuilder], (tcb) => {
       const html = `<ngb-dropdown [open]="isOpen"></ngb-dropdown>`;

       return tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();
         const compiled = fixture.debugElement.nativeElement;

         expect(getDropdownEl(compiled)).not.toHaveCssClass('open');
       });
     }));

  it('should be open by default', injectAsync([TestComponentBuilder], (tcb) => {
       const html = `<ngb-dropdown [open]="isOpen"></ngb-dropdown>`;

       return tcb.overrideTemplate(TestComponent2, html).createAsync(TestComponent2).then((fixture) => {
         fixture.detectChanges();
         const compiled = fixture.debugElement.nativeElement;

         expect(getDropdownEl(compiled)).toHaveCssClass('open');
       });
     }));

  it('should toggle open class', injectAsync([TestComponentBuilder], (tcb) => {
       const html = `<ngb-dropdown [open]="isOpen" (click)="toggleOpen()"></ngb-dropdown>`;

       return tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();
         const compiled = fixture.debugElement.nativeElement;

         let dropdownEl = getDropdownEl(compiled);

         expect(dropdownEl).not.toHaveCssClass('open');

         dropdownEl.click();
         fixture.detectChanges();

         expect(dropdownEl).toHaveCssClass('open');

         dropdownEl.click();
         fixture.detectChanges();

         expect(dropdownEl).not.toHaveCssClass('open');
       });
     }));
});

@Component({selector: 'test-cmp', directives: [NgbDropdown], template: ``})
class TestComponent {
  isOpen = false;

  toggleOpen() { this.isOpen = !this.isOpen; }
}

@Component({selector: 'test-cmp2', directives: [NgbDropdown], template: ``})
class TestComponent2 {
  isOpen = true;
}
