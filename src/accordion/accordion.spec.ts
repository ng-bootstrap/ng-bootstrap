import {TestBed, ComponentFixture, inject} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {createGenericTestComponent} from '../test/common';

import {Component} from '@angular/core';

import {NgbAccordionModule, NgbPanelChangeEvent, NgbAccordionConfig, NgbAccordion} from './accordion.module';

const createTestComponent = (html: string) =>
    createGenericTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;

function getPanels(element: HTMLElement): HTMLDivElement[] {
  return <HTMLDivElement[]>Array.from(element.querySelectorAll('.card > .card-header'));
}

function getPanelsContent(element: HTMLElement): HTMLDivElement[] {
  return <HTMLDivElement[]>Array.from(element.querySelectorAll('.card > .collapse'));
}

function getPanelsTitle(element: HTMLElement): HTMLButtonElement[] {
  return <HTMLButtonElement[]>Array.from(element.querySelectorAll('.card > .card-header button'));
}

function getButton(element: HTMLElement, index: number): HTMLButtonElement {
  return <HTMLButtonElement>element.querySelectorAll('button')[index];
}

function expectOpenPanels(nativeEl: HTMLElement, openPanelsDef: boolean[]) {
  const noOfOpenPanels = openPanelsDef.reduce((soFar, def) => def ? soFar + 1 : soFar, 0);
  const panels = getPanels(nativeEl);
  expect(panels.length).toBe(openPanelsDef.length);

  const panelsTitles = getPanelsTitle(nativeEl);
  const result = panelsTitles.map((titleEl: HTMLButtonElement) => {
    const isAriaExpanded = titleEl.getAttribute('aria-expanded') === 'true';
    const isCSSCollapsed = titleEl.classList.contains('collapsed');
    return isAriaExpanded === !isCSSCollapsed ? isAriaExpanded : fail('inconsistent state');
  });

  const panelContents = getPanelsContent(nativeEl);
  panelContents.forEach(
      (panelContent: HTMLDivElement) => { expect(panelContent.classList.contains('show')).toBeTruthy(); });

  expect(panelContents.length).toBe(noOfOpenPanels);
  expect(result).toEqual(openPanelsDef);
}

describe('ngb-accordion', () => {
  let html = `
    <ngb-accordion #acc="ngbAccordion" [closeOthers]="closeOthers" [activeIds]="activeIds"
      (panelChange)="changeCallback($event)" [type]="classType">
      <ngb-panel *ngFor="let panel of panels" [id]="panel.id" [disabled]="panel.disabled" [type]="panel.type">
        <ng-template ngbPanelTitle>{{panel.title}}</ng-template>
        <ng-template ngbPanelContent>{{panel.content}}</ng-template>
      </ngb-panel>
    </ngb-accordion>
    <button *ngFor="let panel of panels" (click)="acc.toggle(panel.id)">Toggle the panel {{ panel.id }}</button>
  `;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [TestComponent], imports: [NgbAccordionModule]});
    TestBed.overrideComponent(TestComponent, {set: {template: html}});
  });

  it('should initialize inputs with default values', () => {
    const defaultConfig = new NgbAccordionConfig();
    const accordionCmp = new NgbAccordion(defaultConfig);
    expect(accordionCmp.type).toBe(defaultConfig.type);
    expect(accordionCmp.closeOtherPanels).toBe(defaultConfig.closeOthers);
  });

  it('should have no open panels', () => {
    const fixture = TestBed.createComponent(TestComponent);
    const accordionEl = fixture.nativeElement.children[0];
    const el = fixture.nativeElement;
    fixture.detectChanges();
    expectOpenPanels(el, [false, false, false]);
    expect(accordionEl.getAttribute('role')).toBe('tablist');
    expect(accordionEl.getAttribute('aria-multiselectable')).toBe('true');
  });

  it('should have proper css classes', () => {
    const fixture = TestBed.createComponent(TestComponent);
    const accordion = fixture.debugElement.query(By.directive(NgbAccordion));
    expect(accordion.nativeElement).toHaveCssClass('accordion');
  });

  it('should toggle panels based on "activeIds" values', () => {
    const fixture = TestBed.createComponent(TestComponent);
    const tc = fixture.componentInstance;
    const el = fixture.nativeElement;
    // as array
    tc.activeIds = ['one', 'two'];
    fixture.detectChanges();
    expectOpenPanels(el, [true, true, false]);

    tc.activeIds = ['two', 'three'];
    fixture.detectChanges();
    expectOpenPanels(el, [false, true, true]);

    tc.activeIds = [];
    fixture.detectChanges();
    expectOpenPanels(el, [false, false, false]);

    tc.activeIds = ['wrong id', 'one'];
    fixture.detectChanges();
    expectOpenPanels(el, [true, false, false]);

    // as string
    tc.activeIds = 'one';
    fixture.detectChanges();
    expectOpenPanels(el, [true, false, false]);

    tc.activeIds = 'two, three';
    fixture.detectChanges();
    expectOpenPanels(el, [false, true, true]);

    tc.activeIds = '';
    fixture.detectChanges();
    expectOpenPanels(el, [false, false, false]);

    tc.activeIds = 'wrong id,one';
    fixture.detectChanges();
    expectOpenPanels(el, [true, false, false]);
  });


  it('should toggle panels independently', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const el = fixture.nativeElement;

    getButton(el, 1).click();
    fixture.detectChanges();
    expectOpenPanels(el, [false, true, false]);

    getButton(el, 0).click();
    fixture.detectChanges();
    expectOpenPanels(el, [true, true, false]);

    getButton(el, 1).click();
    fixture.detectChanges();
    expectOpenPanels(el, [true, false, false]);

    getButton(el, 2).click();
    fixture.detectChanges();

    expectOpenPanels(el, [true, false, true]);

    getButton(el, 0).click();
    fixture.detectChanges();
    expectOpenPanels(el, [false, false, true]);

    getButton(el, 2).click();
    fixture.detectChanges();
    expectOpenPanels(el, [false, false, false]);
  });

  it('should allow only one panel to be active with "closeOthers" flag', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const tc = fixture.componentInstance;
    const el = fixture.nativeElement;

    tc.closeOthers = true;
    fixture.detectChanges();
    expect(el.children[0].getAttribute('aria-multiselectable')).toBe('false');

    getButton(el, 0).click();
    fixture.detectChanges();
    expectOpenPanels(el, [true, false, false]);

    getButton(el, 1).click();
    fixture.detectChanges();
    expectOpenPanels(el, [false, true, false]);
  });

  it('should update the activeIds after closeOthers is set to true', () => {
    const fixture = TestBed.createComponent(TestComponent);
    const tc = fixture.componentInstance;
    const el = fixture.nativeElement;

    tc.activeIds = 'one,two,three';
    fixture.detectChanges();
    expectOpenPanels(el, [true, true, true]);

    tc.closeOthers = true;
    fixture.detectChanges();
    expectOpenPanels(el, [true, false, false]);

    tc.closeOthers = false;
    fixture.detectChanges();
    expectOpenPanels(el, [true, false, false]);
  });

  it('should have the appropriate heading', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;

    const titles = getPanelsTitle(compiled);
    expect(titles.length).not.toBe(0);

    titles.forEach((title: HTMLElement, idx: number) => { expect(title.textContent.trim()).toBe(`Panel ${idx + 1}`); });
  });

  it('can use a title without template', () => {
    const testHtml = `
    <ngb-accordion>
     <ngb-panel [title]="panels[0].title">
       <ng-template ngbPanelContent>{{panels[0].content}}</ng-template>
     </ngb-panel>
    </ngb-accordion>
    `;
    const fixture = createTestComponent(testHtml);

    fixture.detectChanges();

    const title: HTMLElement = getPanelsTitle(fixture.nativeElement)[0];
    expect(title.textContent.trim()).toBe('Panel 1');
  });

  it('can mix title and template', () => {
    const testHtml = `
    <ngb-accordion>
     <ngb-panel [title]="panels[0].title">
       <ng-template ngbPanelContent>{{panels[0].content}}</ng-template>
     </ngb-panel>
     <ngb-panel>
      <ng-template ngbPanelTitle>{{panels[1].title}}</ng-template>
      <ng-template ngbPanelContent>{{panels[1].content}}</ng-template>
     </ngb-panel>
    </ngb-accordion>
    `;
    const fixture = createTestComponent(testHtml);

    fixture.detectChanges();

    const titles = getPanelsTitle(fixture.nativeElement);

    titles.forEach((title: HTMLElement, idx: number) => { expect(title.textContent.trim()).toBe(`Panel ${idx + 1}`); });
  });

  it('should not pick up titles from nested accordions', () => {
    const testHtml = `
    <ngb-accordion activeIds="open_me">
     <ngb-panel title="parent title" id="open_me">
       <ng-template ngbPanelContent>
         <ngb-accordion>
           <ngb-panel>
             <ng-template ngbPanelTitle>child title</ng-template>
             <ng-template ngbPanelContent>child content</ng-template>
           </ngb-panel>
          </ngb-accordion>
       </ng-template>
     </ngb-panel>
    </ngb-accordion>
    `;
    const fixture = createTestComponent(testHtml);
    // additional change detection is required to reproduce the problem in the test environment
    fixture.detectChanges();

    const titles = getPanelsTitle(fixture.nativeElement);
    const parentTitle = titles[0].textContent.trim();
    const childTitle = titles[1].textContent.trim();

    expect(parentTitle).toContain('parent title');
    expect(parentTitle).not.toContain('child title');
    expect(childTitle).toContain('child title');
    expect(childTitle).not.toContain('parent title');
  });

  it('should not crash for an empty accordion', () => {
    const fixture = createTestComponent('<ngb-accordion></ngb-accordion>');
    expect(getPanels(fixture.nativeElement).length).toBe(0);
  });

  it('should not crash for panels without content', () => {
    const fixture =
        createTestComponent('<ngb-accordion activeIds="open_me"><ngb-panel id="open_me"></ngb-panel></ngb-accordion>');
    const panelsContent = getPanelsContent(fixture.nativeElement);

    expect(panelsContent.length).toBe(1);
    expect(panelsContent[0].textContent.trim()).toBe('');
  });

  it('should have the appropriate content', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const originalContent = fixture.componentInstance.panels;
    fixture.componentInstance.activeIds = 'one,two,three';

    fixture.detectChanges();

    const contents = getPanelsContent(compiled);
    expect(contents.length).not.toBe(0);

    contents.forEach((content: HTMLElement, idx: number) => {
      expect(content.getAttribute('aria-labelledby')).toBe(`${content.id}-header`);
      expect(content.textContent.trim()).toBe(originalContent[idx].content);
    });
  });

  it('should have the appropriate CSS visibility classes', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    fixture.componentInstance.activeIds = 'one,two,three';

    fixture.detectChanges();

    const contents = getPanelsContent(compiled);
    expect(contents.length).not.toBe(0);

    contents.forEach((content: HTMLElement) => {
      expect(content).toHaveCssClass('collapse');
      expect(content).toHaveCssClass('show');
    });
  });

  it('should only open one at a time', () => {
    const fixture = TestBed.createComponent(TestComponent);
    const tc = fixture.componentInstance;
    tc.closeOthers = true;
    fixture.detectChanges();

    const headingLinks = getPanelsTitle(fixture.nativeElement);

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

  it('should have only one open panel even if binding says otherwise', () => {
    const fixture = TestBed.createComponent(TestComponent);
    const tc = fixture.componentInstance;

    tc.activeIds = ['one', 'two'];
    tc.closeOthers = true;
    fixture.detectChanges();

    expectOpenPanels(fixture.nativeElement, [true, false, false]);
  });

  it('should not open disabled panels from click', () => {
    const fixture = TestBed.createComponent(TestComponent);
    const tc = fixture.componentInstance;
    tc.panels[0].disabled = true;
    fixture.detectChanges();

    const headingLinks = getPanelsTitle(fixture.nativeElement);

    headingLinks[0].click();
    fixture.detectChanges();

    expectOpenPanels(fixture.nativeElement, [false, false, false]);
  });

  it('should not update activeIds when trying to toggle a disabled panel', () => {
    const fixture = TestBed.createComponent(TestComponent);
    const tc = fixture.componentInstance;
    const el = fixture.nativeElement;

    tc.panels[0].disabled = true;
    fixture.detectChanges();
    expectOpenPanels(el, [false, false, false]);

    const headingLinks = getPanelsTitle(fixture.nativeElement);

    headingLinks[0].click();
    fixture.detectChanges();
    expectOpenPanels(el, [false, false, false]);

    tc.panels[0].disabled = false;
    fixture.detectChanges();
    expectOpenPanels(el, [false, false, false]);
  });

  it('should open/collapse disabled panels', () => {
    const fixture = TestBed.createComponent(TestComponent);
    const tc = fixture.componentInstance;

    tc.activeIds = ['one'];
    fixture.detectChanges();
    expectOpenPanels(fixture.nativeElement, [true, false, false]);

    tc.panels[0].disabled = true;
    fixture.detectChanges();
    expectOpenPanels(fixture.nativeElement, [false, false, false]);

    tc.panels[0].disabled = false;
    fixture.detectChanges();
    expectOpenPanels(fixture.nativeElement, [true, false, false]);
  });

  it('should have correct disabled state', () => {
    const fixture = TestBed.createComponent(TestComponent);
    const tc = fixture.componentInstance;

    tc.activeIds = ['one'];
    fixture.detectChanges();
    const headingLinks = getPanelsTitle(fixture.nativeElement);
    expectOpenPanels(fixture.nativeElement, [true, false, false]);
    expect(headingLinks[0].disabled).toBeFalsy();

    tc.panels[0].disabled = true;
    fixture.detectChanges();
    expectOpenPanels(fixture.nativeElement, [false, false, false]);
    expect(headingLinks[0].disabled).toBeTruthy();
  });

  it('should remove collapsed panels content from DOM', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    expect(getPanelsContent(fixture.nativeElement).length).toBe(0);

    getButton(fixture.nativeElement, 0).click();
    fixture.detectChanges();
    expect(getPanelsContent(fixture.nativeElement).length).toBe(1);
  });

  it('should not remove collapsed panels content from DOM with `destroyOnHide` flag', () => {
    const testHtml = `
    <ngb-accordion #acc="ngbAccordion" [closeOthers]="true" [destroyOnHide]="false">
     <ngb-panel *ngFor="let panel of panels" [id]="panel.id">
       <ng-template ngbPanelTitle>{{panel.title}}</ng-template>
       <ng-template ngbPanelContent>{{panel.content}}</ng-template>
     </ngb-panel>
    </ngb-accordion>
    <button *ngFor="let panel of panels" (click)="acc.toggle(panel.id)">Toggle the panel {{ panel.id }}</button>
    `;
    const fixture = createTestComponent(testHtml);

    fixture.detectChanges();

    getButton(fixture.nativeElement, 1).click();
    fixture.detectChanges();
    let panelContents = getPanelsContent(fixture.nativeElement);
    expect(panelContents[1]).toHaveCssClass('show');
    expect(panelContents.length).toBe(3);
  });

  it('should emit panel change event when toggling panels', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    fixture.componentInstance.changeCallback = () => {};

    spyOn(fixture.componentInstance, 'changeCallback');

    // Select the first tab -> change event
    getButton(fixture.nativeElement, 0).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.changeCallback)
        .toHaveBeenCalledWith(jasmine.objectContaining({panelId: 'one', nextState: true}));

    // Select the first tab again -> change event
    getButton(fixture.nativeElement, 0).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.changeCallback)
        .toHaveBeenCalledWith(jasmine.objectContaining({panelId: 'one', nextState: false}));
  });

  it('should cancel panel toggle when preventDefault() is called', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    let changeEvent = null;
    fixture.componentInstance.changeCallback = event => {
      changeEvent = event;
      event.preventDefault();
    };

    // Select the first tab -> toggle will be canceled
    getButton(fixture.nativeElement, 0).click();
    fixture.detectChanges();
    expect(changeEvent).toEqual(jasmine.objectContaining({panelId: 'one', nextState: true}));
    expectOpenPanels(fixture.nativeElement, [false, false, false]);
  });


  it('should have specified type of accordion ', () => {
    const testHtml = `
    <ngb-accordion #acc="ngbAccordion" [closeOthers]="closeOthers" [type]="classType">
     <ngb-panel *ngFor="let panel of panels" [id]="panel.id" [disabled]="panel.disabled">
       <ng-template ngbPanelTitle>{{panel.title}}</ng-template>
       <ng-template ngbPanelContent>{{panel.content}}</ng-template>
     </ngb-panel>
    </ngb-accordion>
    <button *ngFor="let panel of panels" (click)="acc.toggle(panel.id)">Toggle the panel {{ panel.id }}</button>
    `;
    const fixture = createTestComponent(testHtml);

    fixture.componentInstance.classType = 'warning';
    fixture.detectChanges();

    let el = fixture.nativeElement.querySelectorAll('.card-header');
    expect(el[0]).toHaveCssClass('bg-warning');
    expect(el[1]).toHaveCssClass('bg-warning');
    expect(el[2]).toHaveCssClass('bg-warning');
  });

  it('should override the type in accordion with type in panel', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    fixture.componentInstance.classType = 'warning';

    const tc = fixture.componentInstance;
    tc.panels[0].type = 'success';
    tc.panels[1].type = 'danger';
    fixture.detectChanges();

    let el = fixture.nativeElement.querySelectorAll('.card-header');
    expect(el[0]).toHaveCssClass('bg-success');
    expect(el[1]).toHaveCssClass('bg-danger');
    expect(el[2]).toHaveCssClass('bg-warning');
  });

  it('should have the proper roles', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.componentInstance.activeIds = 'one,two,three';
    fixture.detectChanges();

    const headers = getPanels(fixture.nativeElement);
    headers.forEach((header: HTMLElement) => expect(header.getAttribute('role')).toBe('tab'));

    const contents = getPanelsContent(fixture.nativeElement);
    contents.forEach((content: HTMLElement) => expect(content.getAttribute('role')).toBe('tabpanel'));
  });

  describe('Custom config', () => {
    let config: NgbAccordionConfig;

    beforeEach(() => { TestBed.configureTestingModule({imports: [NgbAccordionModule]}); });

    beforeEach(inject([NgbAccordionConfig], (c: NgbAccordionConfig) => {
      config = c;
      config.closeOthers = true;
      config.type = 'success';
    }));

    it('should initialize inputs with provided config', () => {
      const fixture = TestBed.createComponent(NgbAccordion);
      fixture.detectChanges();

      let accordion = fixture.componentInstance;
      expect(accordion.closeOtherPanels).toBe(config.closeOthers);
      expect(accordion.type).toBe(config.type);
    });
  });

  describe('Custom config as provider', () => {
    let config = new NgbAccordionConfig();
    config.closeOthers = true;
    config.type = 'success';

    beforeEach(() => {
      TestBed.configureTestingModule(
          {imports: [NgbAccordionModule], providers: [{provide: NgbAccordionConfig, useValue: config}]});
    });

    it('should initialize inputs with provided config as provider', () => {
      const fixture = TestBed.createComponent(NgbAccordion);
      fixture.detectChanges();

      let accordion = fixture.componentInstance;
      expect(accordion.closeOtherPanels).toBe(config.closeOthers);
      expect(accordion.type).toBe(config.type);
    });
  });

  describe('imperative API', () => {

    function createTestImperativeAccordion(testHtml: string) {
      const fixture = createTestComponent(testHtml);
      const accordion = fixture.debugElement.query(By.directive(NgbAccordion)).componentInstance;
      const nativeElement = fixture.nativeElement;
      return {fixture, accordion, nativeElement};
    }

    it('should check if a panel with a given id is expanded', () => {
      const testHtml = `
      <ngb-accordion activeIds="first">
        <ngb-panel id="first"></ngb-panel>
        <ngb-panel id="second"></ngb-panel>
      </ngb-accordion>`;

      const {accordion, nativeElement} = createTestImperativeAccordion(testHtml);

      expectOpenPanels(nativeElement, [true, false]);
      expect(accordion.isExpanded('first')).toBe(true);
      expect(accordion.isExpanded('second')).toBe(false);
    });

    it('should expanded and collapse individual panels', () => {
      const testHtml = `
      <ngb-accordion>
        <ngb-panel id="first"></ngb-panel>
        <ngb-panel id="second"></ngb-panel>
      </ngb-accordion>`;

      const {accordion, nativeElement, fixture} = createTestImperativeAccordion(testHtml);

      expectOpenPanels(nativeElement, [false, false]);

      accordion.expand('first');
      fixture.detectChanges();
      expectOpenPanels(nativeElement, [true, false]);

      accordion.expand('second');
      fixture.detectChanges();
      expectOpenPanels(nativeElement, [true, true]);

      accordion.collapse('second');
      fixture.detectChanges();
      expectOpenPanels(nativeElement, [true, false]);
    });

    it('should not expand / collapse if already expanded / collapsed', () => {
      const testHtml = `
      <ngb-accordion activeIds="first" (panelChange)="changeCallback()">
        <ngb-panel id="first"></ngb-panel>
        <ngb-panel id="second"></ngb-panel>
      </ngb-accordion>`;

      const {accordion, nativeElement, fixture} = createTestImperativeAccordion(testHtml);

      expectOpenPanels(nativeElement, [true, false]);

      spyOn(fixture.componentInstance, 'changeCallback');

      accordion.expand('first');
      fixture.detectChanges();
      expectOpenPanels(nativeElement, [true, false]);

      accordion.collapse('second');
      fixture.detectChanges();
      expectOpenPanels(nativeElement, [true, false]);

      expect(fixture.componentInstance.changeCallback).not.toHaveBeenCalled();
    });

    it('should not expand disabled panels', () => {
      const testHtml = `
      <ngb-accordion (panelChange)="changeCallback()">
        <ngb-panel id="first" [disabled]="true"></ngb-panel>
      </ngb-accordion>`;

      const {accordion, nativeElement, fixture} = createTestImperativeAccordion(testHtml);

      expectOpenPanels(nativeElement, [false]);

      spyOn(fixture.componentInstance, 'changeCallback');

      accordion.expand('first');
      fixture.detectChanges();
      expectOpenPanels(nativeElement, [false]);
      expect(fixture.componentInstance.changeCallback).not.toHaveBeenCalled();
    });

    it('should not expand / collapse when preventDefault called on the panelChange event', () => {
      const testHtml = `
      <ngb-accordion activeIds="first" (panelChange)="preventDefaultCallback($event)">
        <ngb-panel id="first"></ngb-panel>
        <ngb-panel id="second"></ngb-panel>
      </ngb-accordion>`;

      const {accordion, nativeElement, fixture} = createTestImperativeAccordion(testHtml);

      expectOpenPanels(nativeElement, [true, false]);

      accordion.collapse('first');
      fixture.detectChanges();
      expectOpenPanels(nativeElement, [true, false]);

      accordion.expand('second');
      fixture.detectChanges();
      expectOpenPanels(nativeElement, [true, false]);
    });

    it('should expandAll when closeOthers is false', () => {

      const testHtml = `
      <ngb-accordion [closeOthers]="false">
        <ngb-panel id="first"></ngb-panel>
        <ngb-panel id="second"></ngb-panel>
      </ngb-accordion>`;

      const {accordion, nativeElement, fixture} = createTestImperativeAccordion(testHtml);

      expectOpenPanels(nativeElement, [false, false]);

      accordion.expandAll();
      fixture.detectChanges();
      expectOpenPanels(nativeElement, [true, true]);
    });

    it('should expand first panel when closeOthers is true and none of panels is expanded', () => {
      const testHtml = `
      <ngb-accordion [closeOthers]="true">
        <ngb-panel id="first"></ngb-panel>
        <ngb-panel id="second"></ngb-panel>
      </ngb-accordion>`;

      const {accordion, nativeElement, fixture} = createTestImperativeAccordion(testHtml);

      expectOpenPanels(nativeElement, [false, false]);

      accordion.expandAll();
      fixture.detectChanges();
      expectOpenPanels(nativeElement, [true, false]);
    });

    it('should do nothing if closeOthers is true and one panel is expanded', () => {
      const testHtml = `
      <ngb-accordion [closeOthers]="true" activeIds="second">
        <ngb-panel id="first"></ngb-panel>
        <ngb-panel id="second"></ngb-panel>
      </ngb-accordion>`;

      const {accordion, nativeElement, fixture} = createTestImperativeAccordion(testHtml);

      expectOpenPanels(nativeElement, [false, true]);

      accordion.expandAll();
      fixture.detectChanges();
      expectOpenPanels(nativeElement, [false, true]);
    });

    it('should collapse all panels', () => {
      const testHtml = `
      <ngb-accordion activeIds="second">
        <ngb-panel id="first"></ngb-panel>
        <ngb-panel id="second"></ngb-panel>
      </ngb-accordion>`;

      const {accordion, nativeElement, fixture} = createTestImperativeAccordion(testHtml);

      expectOpenPanels(nativeElement, [false, true]);

      accordion.collapseAll();
      fixture.detectChanges();
      expectOpenPanels(nativeElement, [false, false]);
    });
  });
});

@Component({selector: 'test-cmp', template: ''})
class TestComponent {
  activeIds: string | string[] = [];
  classType;
  closeOthers = false;
  panels = [
    {id: 'one', disabled: false, title: 'Panel 1', content: 'foo', type: ''},
    {id: 'two', disabled: false, title: 'Panel 2', content: 'bar', type: ''},
    {id: 'three', disabled: false, title: 'Panel 3', content: 'baz', type: ''}
  ];
  changeCallback = (event: NgbPanelChangeEvent) => {};
  preventDefaultCallback = (event: NgbPanelChangeEvent) => { event.preventDefault(); };
}
