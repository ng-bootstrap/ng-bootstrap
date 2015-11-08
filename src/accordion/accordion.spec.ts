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

import {NgbAccordion, NgbAccordionGroup} from './accordion';

function getPanels(element: Element): Element[] {
  return Array.from(element.querySelectorAll('ngb-accordion-group .panel'));
}

function hasClass(element: Element, str: string): Boolean {
  return new RegExp(`(^|\\s)${str}(\\s|$)`).test(element.className)
}

function hasHeading(element: Element, str: string): Boolean {
  return element.textContent === str;
}

describe('ngb-accordion', () => {
  describe('UI logic', () => {
    let html: string;

    beforeEach(() => {
      html = `
      <ngb-accordion [close-others]="closeOthers">
        <ngb-accordion-group [is-open]="panels[0].open"
          [heading]="panels[0].heading"
          [is-disabled]="panels[0].disabled">
          <div class="text-content">{{panels[0].content}}</div>
        </ngb-accordion-group>
        <ngb-accordion-group [is-open]="panels[1].open"
          [heading]="panels[1].heading"
          [is-disabled]="panels[1].disabled">
          <div class="text-content">{{panels[1].content}}</div>
        </ngb-accordion-group>
        <ngb-accordion-group [is-open]="panels[2].open"
          [heading]="panels[2].heading"
          [is-disabled]="panels[2].disabled">
          <div class="text-content">{{panels[2].content}}</div>
        </ngb-accordion-group>
      </ngb-accordion>
    `;
    });

    it('should have no open panel', injectAsync([TestComponentBuilder], (tcb) => {
         return tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.detectChanges();

           const compiled = fixture.debugElement.nativeElement;

           let panels = getPanels(compiled);

           panels.forEach((panel) => expect(hasClass(panel, 'panel-open')).toBe(false));
         });
       }));

    it('should toggle panels independently', injectAsync([TestComponentBuilder], (tcb) => {
         return tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.detectChanges();

           const tc = fixture.debugElement.componentInstance;
           const compiled = fixture.debugElement.nativeElement;

           let panels = getPanels(compiled);

           panels.forEach((panel) => expect(hasClass(panel, 'panel-open')).toBe(false));

           tc.panels[1].open = true;
           fixture.detectChanges();

           expect(hasClass(panels[0], 'panel-open')).toBe(false);
           expect(hasClass(panels[1], 'panel-open')).toBe(true);
           expect(hasClass(panels[2], 'panel-open')).toBe(false);

           tc.panels[0].open = true;
           fixture.detectChanges();

           expect(hasClass(panels[0], 'panel-open')).toBe(true);
           expect(hasClass(panels[1], 'panel-open')).toBe(true);
           expect(hasClass(panels[2], 'panel-open')).toBe(false);

           tc.panels[1].open = false;
           fixture.detectChanges();

           expect(hasClass(panels[0], 'panel-open')).toBe(true);
           expect(hasClass(panels[1], 'panel-open')).toBe(false);
           expect(hasClass(panels[2], 'panel-open')).toBe(false);

           tc.panels[2].open = true;
           fixture.detectChanges();

           expect(hasClass(panels[0], 'panel-open')).toBe(true);
           expect(hasClass(panels[1], 'panel-open')).toBe(false);
           expect(hasClass(panels[2], 'panel-open')).toBe(true);

           tc.panels[0].open = false;
           fixture.detectChanges();

           expect(hasClass(panels[0], 'panel-open')).toBe(false);
           expect(hasClass(panels[1], 'panel-open')).toBe(false);
           expect(hasClass(panels[2], 'panel-open')).toBe(true);

           tc.panels[2].open = false;
           fixture.detectChanges();

           expect(hasClass(panels[0], 'panel-open')).toBe(false);
           expect(hasClass(panels[1], 'panel-open')).toBe(false);
           expect(hasClass(panels[2], 'panel-open')).toBe(false);
         });
       }));

    it('should have the appropriate heading', injectAsync([TestComponentBuilder], (tcb) => {
         return tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.detectChanges();

           const compiled: Element = fixture.debugElement.nativeElement;

           let headings: Element[] = Array.from(compiled.querySelectorAll('.panel-heading a span'));

           headings.forEach((heading, idx) => { return expect(hasHeading(heading, `Panel ${idx + 1}`)).toBe(true); });
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

           expect(hasClass(panels[0], 'panel-open')).toBe(false);
           expect(hasClass(panels[1], 'panel-open')).toBe(true);
           expect(hasClass(panels[2], 'panel-open')).toBe(false);

           tc.panels[0].open = true;
           fixture.detectChanges();

           expect(hasClass(panels[0], 'panel-open')).toBe(true);
           expect(hasClass(panels[1], 'panel-open')).toBe(false);
           expect(hasClass(panels[2], 'panel-open')).toBe(false);

           tc.panels[2].open = true;
           fixture.detectChanges();

           expect(hasClass(panels[0], 'panel-open')).toBe(false);
           expect(hasClass(panels[1], 'panel-open')).toBe(false);
           expect(hasClass(panels[2], 'panel-open')).toBe(true);

           tc.panels[2].open = false;
           fixture.detectChanges();

           expect(hasClass(panels[0], 'panel-open')).toBe(false);
           expect(hasClass(panels[1], 'panel-open')).toBe(false);
           expect(hasClass(panels[2], 'panel-open')).toBe(false);
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

           expect(hasClass(panels[0], 'panel-open')).toBe(false);
           expect(hasClass(panels[1], 'panel-open')).toBe(false);
           expect(hasClass(panels[2], 'panel-open')).toBe(false);
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

           expect(hasClass(panels[0], 'panel-open')).toBe(true);
           expect(hasClass(panels[1], 'panel-open')).toBe(false);
           expect(hasClass(panels[2], 'panel-open')).toBe(false);

           tc.panels[0].open = false;
           fixture.detectChanges();

           expect(hasClass(panels[0], 'panel-open')).toBe(false);
           expect(hasClass(panels[1], 'panel-open')).toBe(false);
           expect(hasClass(panels[2], 'panel-open')).toBe(false);
         });
       }));
  });
});

@Component({selector: 'test-cmp', directives: [NgbAccordion, NgbAccordionGroup], template: ''})
class TestComponent {
  closeOthers = false;
  panels: any[] = [
    {disabled: false, heading: 'Panel 1', open: false, content: 'foo'},
    {disabled: false, heading: 'Panel 2', open: false, content: 'bar'},
    {disabled: false, heading: 'Panel 3', open: false, content: 'baz'}
  ];
}
