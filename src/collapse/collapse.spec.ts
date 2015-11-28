import {
  iit,
  it,
  ddescribe,
  describe,
  expect,
  inject,
  injectAsync,
  TestComponentBuilder,
} from 'angular2/testing';

import {Component} from 'angular2/angular2';

import {NgbCollapse} from './collapse';

function getCollapsibleContent(element: Element): Element {
  return element.querySelector('.collapse');
}

describe('ngb-collapse', () => {

  const html = `<div [ngb-collapse]="collapsed">Some content</div>`;

  it('should have content open and aria-expanded true', injectAsync([TestComponentBuilder], (tcb) => {
       return tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();

         const compiled = fixture.debugElement.nativeElement;

         const content = getCollapsibleContent(compiled);

         expect(content).toHaveCssClass('in');
         expect(content.getAttribute('aria-expanded')).toBe('true');
       });
     }));

  it('should have content closed and aria-expanded false', injectAsync([TestComponentBuilder], (tcb) => {
       return tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         const tc = fixture.debugElement.componentInstance;
         tc.collapsed = true;
         fixture.detectChanges();

         const compiled = fixture.debugElement.nativeElement;

         const content = getCollapsibleContent(compiled);

         expect(content).not.toHaveCssClass('in');
         expect(content.getAttribute('aria-expanded')).toBe('false');
       });
     }));

  it('should toggle collapsed content based on bound model change', injectAsync([TestComponentBuilder], (tcb) => {
       return tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();
         const compiled = fixture.debugElement.nativeElement;
         const content = getCollapsibleContent(compiled);
         expect(content).toHaveCssClass('in');

         fixture.debugElement.componentInstance.collapsed = true;
         fixture.detectChanges();
         expect(content).not.toHaveCssClass('in');

         fixture.debugElement.componentInstance.collapsed = false;
         fixture.detectChanges();
         expect(content).toHaveCssClass('in');
       });
     }));

  it('should allow toggling collapse from outside', injectAsync([TestComponentBuilder], (tcb) => {
       const html = `
      <button (click)="collapse.collapsed = !collapse.collapsed">Collapse</button>
      <div [ngb-collapse] #collapse="ngbCollapse"></div>`;

       return tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();

         const compiled = fixture.debugElement.nativeElement;
         const collapseEl = getCollapsibleContent(compiled);
         const buttonEl = compiled.querySelector('button');

         buttonEl.click();
         fixture.detectChanges();
         expect(collapseEl).not.toHaveCssClass('in');

         buttonEl.click();
         fixture.detectChanges();
         expect(collapseEl).toHaveCssClass('in');
       });
     }));
});

@Component({selector: 'test-cmp', directives: [NgbCollapse], template: ''})
class TestComponent {
  collapsed = false;
}
