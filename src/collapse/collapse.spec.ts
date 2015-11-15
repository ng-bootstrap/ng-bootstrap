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

import {NgbCollapse} from './collapse';

function getCollapsibleContent(element: Element): Element {
  return element.querySelector('.collapse');
}

function getButton(element) {
  return element.querySelector('button');
}

function hasClass(element: Element, str: string): Boolean {
  return new RegExp(`(^|\\s)${str}(\\s|$)`).test(element.className);
}

function hasStyle(element: Element, str: string): Boolean {
  return new RegExp(`(^|\\s)${str}(\\s|$)`).test(element.getAttribute('style'));
}

describe('ngb-collapse', () => {
  let html: string;

  beforeEach(() => {
    html = `
      <button type="button" (click)="collapsed = !collapsed">Toggle collapse</button>
      <div [ngb-collapse]="collapsed">
        <div class="card">
          <div class="card-block">
            Some content
          </div>
        </div>
      </div>
    `;
  });

  it('should have content open and aria-expanded true', injectAsync([TestComponentBuilder], (tcb) => {
       return tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();

         const compiled = fixture.debugElement.nativeElement;

         let content = getCollapsibleContent(compiled);

         expect(hasClass(content, 'in')).toBe(true);
         expect(content.getAttribute('aria-expanded') === "true").toBe(true);
       });
     }));

  it('should have content closed and aria-expanded false', injectAsync([TestComponentBuilder], (tcb) => {
       return tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         const tc = fixture.debugElement.componentInstance;
         tc.collapsed = true;
         fixture.detectChanges();

         const compiled = fixture.debugElement.nativeElement;

         let content = getCollapsibleContent(compiled);

         expect(hasClass(content, 'in')).toBe(false);
         expect(content.getAttribute('aria-expanded') === "false").toBe(true);
       });
     }));

  it('should have height style of 0px', injectAsync([TestComponentBuilder], (tcb) => {
       return tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         const tc = fixture.debugElement.componentInstance;
         tc.collapsed = true;
         fixture.detectChanges();

         const compiled = fixture.debugElement.nativeElement;

         let content = getCollapsibleContent(compiled);

         expect(hasStyle(content, 'height: 0px;')).toBe(true);
       });
     }));

  it('should toggle collapsed content on click', injectAsync([TestComponentBuilder], (tcb) => {
       return tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();
         const compiled = fixture.debugElement.nativeElement;
         let content = getCollapsibleContent(compiled);
         expect(hasClass(content, 'in')).toBe(true);

         let buttonEl = getButton(compiled);

         buttonEl.click();
         fixture.detectChanges();
         expect(hasClass(content, 'in')).toBe(false);

         buttonEl.click();
         fixture.detectChanges();
         expect(hasClass(content, 'in')).toBe(true);
       });
     }));
});

@Component({selector: 'test-cmp', directives: [NgbCollapse], template: ''})
class TestComponent {
  collapsed = false;
}
