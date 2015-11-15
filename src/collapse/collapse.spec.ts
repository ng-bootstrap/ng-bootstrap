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

function getButton(element) {
  return element.querySelector('button');
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

  it('should toggle collapsed content on click', injectAsync([TestComponentBuilder], (tcb) => {
       return tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();
         const compiled = fixture.debugElement.nativeElement;
         const content = getCollapsibleContent(compiled);
         expect(content).toHaveCssClass('in');

         const buttonEl = getButton(compiled);

         buttonEl.click();
         fixture.detectChanges();
         expect(content).not.toHaveCssClass('in');

         buttonEl.click();
         fixture.detectChanges();
         expect(content).toHaveCssClass('in');
       });
     }));
});

@Component({selector: 'test-cmp', directives: [NgbCollapse], template: ''})
class TestComponent {
  collapsed = false;
}
