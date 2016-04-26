import {
  iit,
  it,
  ddescribe,
  describe,
  expect,
  inject,
  async,
  TestComponentBuilder,
  beforeEachProviders
} from 'angular2/testing';

import {Component} from 'angular2/core';

import {NgbAccordion, NgbPanel} from './accordion';

function getPanels(element: HTMLElement): HTMLDivElement[] {
  return <HTMLDivElement[]>Array.from(element.querySelectorAll('ngb-panel .panel'));
}

function hasTitle(element: HTMLElement, str: string): boolean {
  return element.textContent === str;
}

function expectOpenPanels(nativeEl: HTMLElement, openPanelsDef: boolean[]) {
  const panels = getPanels(nativeEl);

  expect(panels.length).toBe(openPanelsDef.length);

  for (let i = 0; i < panels.length; i++) {
    if (openPanelsDef[i]) {
      expect(panels[i]).toHaveCssClass('panel-open');
    } else {
      expect(panels[i]).not.toHaveCssClass('panel-open');
    }
  }
}

describe('ngb-accordion', () => {
  let html: string;

  beforeEach(() => {
    html = `
      <ngb-accordion [closeOthers]="closeOthers">
        <ngb-panel [open]="panels[0].open"
          [title]="panels[0].title"
          [disabled]="panels[0].disabled">
          <div class="text-content">{{panels[0].content}}</div>
        </ngb-panel>
        <ngb-panel [open]="panels[1].open"
          [title]="panels[1].title"
          [disabled]="panels[1].disabled">
          <div class="text-content">{{panels[1].content}}</div>
        </ngb-panel>
        <ngb-panel [open]="panels[2].open"
          [title]="panels[2].title"
          [disabled]="panels[2].disabled">
          <div class="text-content">{{panels[2].content}}</div>
        </ngb-panel>
      </ngb-accordion>
    `;
  });

  it('should have no open panels', async(inject([TestComponentBuilder], (tcb) => {
       tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();
         expectOpenPanels(fixture.nativeElement, [false, false, false]);
       });
     })));

  it('should have open panel based on binding', async(inject([TestComponentBuilder], (tcb) => {
       tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         const tc = fixture.componentInstance;

         tc.panels[0].open = true;
         fixture.detectChanges();
         expectOpenPanels(fixture.nativeElement, [true, false, false]);
       });
     })));

  it('should toggle panels independently', async(inject([TestComponentBuilder], (tcb) => {
       tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         const tc = fixture.componentInstance;

         tc.panels[1].open = true;
         fixture.detectChanges();
         expectOpenPanels(fixture.nativeElement, [false, true, false]);

         tc.panels[0].open = true;
         fixture.detectChanges();
         expectOpenPanels(fixture.nativeElement, [true, true, false]);

         tc.panels[1].open = false;
         fixture.detectChanges();
         expectOpenPanels(fixture.nativeElement, [true, false, false]);

         tc.panels[2].open = true;
         fixture.detectChanges();
         expectOpenPanels(fixture.nativeElement, [true, false, true]);

         tc.panels[0].open = false;
         fixture.detectChanges();
         expectOpenPanels(fixture.nativeElement, [false, false, true]);

         tc.panels[2].open = false;
         fixture.detectChanges();
         expectOpenPanels(fixture.nativeElement, [false, false, false]);
       });
     })));

  it('should have the appropriate heading', async(inject([TestComponentBuilder], (tcb) => {
       tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();

         const compiled = fixture.nativeElement;

         const titles = Array.from(compiled.querySelectorAll('.panel-heading a span'));

         titles.forEach(
             (title: HTMLElement, idx: number) => { return expect(hasTitle(title, `Panel ${idx + 1}`)).toBe(true); });
       });
     })));

  it('should only open one at a time', async(inject([TestComponentBuilder], (tcb) => {
       tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         const tc = fixture.componentInstance;
         tc.closeOthers = true;
         fixture.detectChanges();

         const headingLinks = fixture.nativeElement.querySelectorAll('.panel-title a');

         headingLinks[0].click();
         fixture.detectChanges();
         expectOpenPanels(fixture.nativeElement, [true, false, false]);

         headingLinks[2].click();
         fixture.detectChanges();
         expectOpenPanels(fixture.nativeElement, [false, false, true]);

         headingLinks[2].click();
         fixture.detectChanges();
         expectOpenPanels(fixture.nativeElement, [false, false, false]);
       });
     })));

  it('should have only one open panel even if binding says otherwise', async(inject([TestComponentBuilder], (tcb) => {
       tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         const tc = fixture.componentInstance;

         tc.panels[0].open = true;
         tc.panels[1].open = true;
         tc.closeOthers = true;
         fixture.detectChanges();

         expectOpenPanels(fixture.nativeElement, [true, false, false]);
       });
     })));

  it('should not open disabled panels from click', async(inject([TestComponentBuilder], (tcb) => {
       tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         const tc = fixture.componentInstance;
         tc.panels[0].disabled = true;
         fixture.detectChanges();

         fixture.debugElement.nativeElement.click();  // WTF?
         fixture.detectChanges();

         expectOpenPanels(fixture.nativeElement, [false, false, false]);
       });
     })));

  // TODO: this is questionable (?)
  it('should open disabled panels programmatically', async(inject([TestComponentBuilder], (tcb) => {
       tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         const tc = fixture.componentInstance;
         tc.panels[0].disabled = true;
         fixture.detectChanges();

         tc.panels[0].open = true;
         fixture.detectChanges();
         expectOpenPanels(fixture.nativeElement, [true, false, false]);

         tc.panels[0].open = false;
         fixture.detectChanges();
         expectOpenPanels(fixture.nativeElement, [false, false, false]);
       });
     })));
});

@Component({selector: 'test-cmp', directives: [NgbAccordion, NgbPanel], template: ''})
class TestComponent {
  closeOthers = false;
  panels = [
    {disabled: false, title: 'Panel 1', open: false, content: 'foo'},
    {disabled: false, title: 'Panel 2', open: false, content: 'bar'},
    {disabled: false, title: 'Panel 3', open: false, content: 'baz'}
  ];
}
