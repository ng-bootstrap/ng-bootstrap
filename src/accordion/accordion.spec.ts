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

import {NgbAccordion, NgbAccordionPanel} from './accordion';

function getPanels(element: Element): Element[] {
  return Array.from(element.querySelectorAll('ngb-accordion-panel .panel'));
}

function hasTitle(element: Element, str: string): Boolean {
  return element.textContent === str;
}

describe('ngb-accordion', () => {
  let html: string;

  beforeEach(() => {
    html = `
      <ngb-accordion [close-others]="closeOthers">
        <ngb-accordion-panel [is-open]="panels[0].open"
          [title]="panels[0].title"
          [is-disabled]="panels[0].disabled">
          <div class="text-content">{{panels[0].content}}</div>
        </ngb-accordion-panel>
        <ngb-accordion-panel [is-open]="panels[1].open"
          [title]="panels[1].title"
          [is-disabled]="panels[1].disabled">
          <div class="text-content">{{panels[1].content}}</div>
        </ngb-accordion-panel>
        <ngb-accordion-panel [is-open]="panels[2].open"
          [title]="panels[2].title"
          [is-disabled]="panels[2].disabled">
          <div class="text-content">{{panels[2].content}}</div>
        </ngb-accordion-panel>
      </ngb-accordion>
    `;
  });

  it('should have no open panel', injectAsync([TestComponentBuilder], (tcb) => {
       return tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();

         const compiled = fixture.debugElement.nativeElement;

         let panels = getPanels(compiled);

         panels.forEach((panel) => expect(panel).not.toHaveCssClass('panel-open'));
       });
     }));

  it('should toggle panels independently', injectAsync([TestComponentBuilder], (tcb) => {
       return tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();

         const tc = fixture.debugElement.componentInstance;
         const compiled = fixture.debugElement.nativeElement;

         let panels = getPanels(compiled);

         panels.forEach((panel) => expect(panel).not.toHaveCssClass('panel-open'));

         tc.panels[1].open = true;
         fixture.detectChanges();

         expect(panels[0]).not.toHaveCssClass('panel-open');
         expect(panels[1]).toHaveCssClass('panel-open');
         expect(panels[2]).not.toHaveCssClass('panel-open');

         tc.panels[0].open = true;
         fixture.detectChanges();

         expect(panels[0]).toHaveCssClass('panel-open');
         expect(panels[1]).toHaveCssClass('panel-open');
         expect(panels[2]).not.toHaveCssClass('panel-open');

         tc.panels[1].open = false;
         fixture.detectChanges();

         expect(panels[0]).toHaveCssClass('panel-open');
         expect(panels[1]).not.toHaveCssClass('panel-open');
         expect(panels[2]).not.toHaveCssClass('panel-open');

         tc.panels[2].open = true;
         fixture.detectChanges();

         expect(panels[0]).toHaveCssClass('panel-open');
         expect(panels[1]).not.toHaveCssClass('panel-open');
         expect(panels[2]).toHaveCssClass('panel-open');

         tc.panels[0].open = false;
         fixture.detectChanges();

         expect(panels[0]).not.toHaveCssClass('panel-open');
         expect(panels[1]).not.toHaveCssClass('panel-open');
         expect(panels[2]).toHaveCssClass('panel-open');

         tc.panels[2].open = false;
         fixture.detectChanges();

         expect(panels[0]).not.toHaveCssClass('panel-open');
         expect(panels[1]).not.toHaveCssClass('panel-open');
         expect(panels[2]).not.toHaveCssClass('panel-open');
       });
     }));

  it('should have the appropriate heading', injectAsync([TestComponentBuilder], (tcb) => {
       return tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();

         const compiled: Element = fixture.debugElement.nativeElement;

         let titles: Element[] = Array.from(compiled.querySelectorAll('.panel-heading a span'));

         titles.forEach((title, idx) => { return expect(hasTitle(title, `Panel ${idx + 1}`)).toBe(true); });
       });
     }));

  it('should only open one at a time', injectAsync([TestComponentBuilder], (tcb) => {
       return tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         const tc = fixture.debugElement.componentInstance;
         tc.closeOthers = true;
         fixture.detectChanges();

         const compiled: Element = fixture.debugElement.nativeElement;

         let panels: Element[] = getPanels(compiled);

         tc.panels[1].open = true;
         fixture.detectChanges();

         expect(panels[0]).not.toHaveCssClass('panel-open');
         expect(panels[1]).toHaveCssClass('panel-open');
         expect(panels[2]).not.toHaveCssClass('panel-open');

         tc.panels[0].open = true;
         fixture.detectChanges();

         expect(panels[0]).toHaveCssClass('panel-open');
         expect(panels[1]).not.toHaveCssClass('panel-open');
         expect(panels[2]).not.toHaveCssClass('panel-open');

         tc.panels[2].open = true;
         fixture.detectChanges();

         expect(panels[0]).not.toHaveCssClass('panel-open');
         expect(panels[1]).not.toHaveCssClass('panel-open');
         expect(panels[2]).toHaveCssClass('panel-open');

         tc.panels[2].open = false;
         fixture.detectChanges();

         expect(panels[0]).not.toHaveCssClass('panel-open');
         expect(panels[1]).not.toHaveCssClass('panel-open');
         expect(panels[2]).not.toHaveCssClass('panel-open');
       });
     }));

  it('should not open disabled panels from click', injectAsync([TestComponentBuilder], (tcb) => {
       return tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         const tc = fixture.debugElement.componentInstance;
         tc.panels[0].disabled = true;
         fixture.detectChanges();

         const compiled: Element = fixture.debugElement.nativeElement;

         let panels: Element[] = getPanels(compiled);

         fixture.debugElement.componentViewChildren[0].children[0].nativeElement.click();
         fixture.detectChanges();

         expect(panels[0]).not.toHaveCssClass('panel-open');
         expect(panels[1]).not.toHaveCssClass('panel-open');
         expect(panels[2]).not.toHaveCssClass('panel-open');
       });
     }));

  it('should open disabled panels programmatically', injectAsync([TestComponentBuilder], (tcb) => {
       return tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         const tc = fixture.debugElement.componentInstance;
         tc.panels[0].disabled = true;
         fixture.detectChanges();

         const compiled: Element = fixture.debugElement.nativeElement;

         let panels: Element[] = getPanels(compiled);

         tc.panels[0].open = true;
         fixture.detectChanges();

         expect(panels[0]).toHaveCssClass('panel-open');
         expect(panels[1]).not.toHaveCssClass('panel-open');
         expect(panels[2]).not.toHaveCssClass('panel-open');

         tc.panels[0].open = false;
         fixture.detectChanges();

         expect(panels[0]).not.toHaveCssClass('panel-open');
         expect(panels[1]).not.toHaveCssClass('panel-open');
         expect(panels[2]).not.toHaveCssClass('panel-open');
       });
     }));
});

@Component({selector: 'test-cmp', directives: [NgbAccordion, NgbAccordionPanel], template: ''})
class TestComponent {
  closeOthers = false;
  panels: any[] = [
    {disabled: false, title: 'Panel 1', open: false, content: 'foo'},
    {disabled: false, title: 'Panel 2', open: false, content: 'bar'},
    {disabled: false, title: 'Panel 3', open: false, content: 'baz'}
  ];
}
