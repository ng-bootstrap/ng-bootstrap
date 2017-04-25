import {TestBed, ComponentFixture, inject} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {createGenericTestComponent} from '../test/common';

import {Component} from '@angular/core';

import {NgbAccordionModule} from './accordion.module';
import {NgbAccordionConfig} from './accordion-config';
import {NgbAccordion} from './accordion';

const createTestComponent = (html: string) =>
    createGenericTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;

function getPanels(element: HTMLElement): HTMLDivElement[] {
  return <HTMLDivElement[]>Array.from(element.querySelectorAll('div .card-header'));
}

function getPanelsContent(element: HTMLElement): HTMLDivElement[] {
  return <HTMLDivElement[]>Array.from(element.querySelectorAll('div .card-block'));
}

function getButton(element: HTMLElement, index: number): HTMLButtonElement {
  return <HTMLButtonElement>element.querySelectorAll('button')[index];
}

function expectOpenPanels(nativeEl: HTMLElement, openPanelsDef: boolean[]) {
  const panels = getPanels(nativeEl);
  expect(panels.length).toBe(openPanelsDef.length);

  const result = panels.map(panel => panel.classList.contains('active'));
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
    TestBed.configureTestingModule({declarations: [TestComponent], imports: [NgbAccordionModule.forRoot()]});
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

  it('should have the appropriate heading', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;

    const titles = Array.from(compiled.querySelectorAll('.card-header a'));
    expect(titles.length).not.toBe(0);

    titles.forEach((title: HTMLElement, idx: number) => { expect(title.textContent.trim()).toBe(`Panel ${idx + 1}`); });
  });

  it('should only open one at a time', () => {
    const fixture = TestBed.createComponent(TestComponent);
    const tc = fixture.componentInstance;
    tc.closeOthers = true;
    fixture.detectChanges();

    const headingLinks = fixture.nativeElement.querySelectorAll('.card-header a');

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

    const headingLinks = fixture.nativeElement.querySelectorAll('.card-header a');

    headingLinks[0].click();
    fixture.detectChanges();

    expectOpenPanels(fixture.nativeElement, [false, false, false]);
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

  it('should have correct ARIA attributes when disabled', () => {
    const fixture = TestBed.createComponent(TestComponent);
    const tc = fixture.componentInstance;

    tc.activeIds = ['one'];
    fixture.detectChanges();
    let disabledPanelLink: HTMLAnchorElement = getPanels(fixture.nativeElement)[0].querySelector('a');
    expectOpenPanels(fixture.nativeElement, [true, false, false]);
    expect(disabledPanelLink.getAttribute('aria-disabled')).toBe('false');
    expect(disabledPanelLink.getAttribute('tabindex')).toBeNull();

    tc.panels[0].disabled = true;
    fixture.detectChanges();
    expectOpenPanels(fixture.nativeElement, [false, false, false]);
    expect(disabledPanelLink.getAttribute('aria-disabled')).toBe('true');
    expect(disabledPanelLink.getAttribute('tabindex')).toBe('-1');
  });

  it('should remove aria-controls attribute when closed', () => {
    const fixture = TestBed.createComponent(TestComponent);
    const tc = fixture.componentInstance;

    fixture.detectChanges();
    const headingLinks = fixture.nativeElement.querySelectorAll('.card-header a');

    expectOpenPanels(fixture.nativeElement, [false, false, false]);
    expect(headingLinks[0].getAttribute('aria-controls')).toBeNull();

    tc.activeIds = ['one'];
    fixture.detectChanges();
    const panelsContent = getPanelsContent(fixture.nativeElement);
    expectOpenPanels(fixture.nativeElement, [true, false, false]);
    expect(headingLinks[0].getAttribute('aria-controls')).toBe(panelsContent[0].id);
  });


  it('should remove collapsed panels content from DOM', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    expect(getPanelsContent(fixture.nativeElement).length).toBe(0);

    getButton(fixture.nativeElement, 0).click();
    fixture.detectChanges();
    expect(getPanelsContent(fixture.nativeElement).length).toBe(1);
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
    expect(el[0]).toHaveCssClass('card-warning');
    expect(el[1]).toHaveCssClass('card-warning');
    expect(el[2]).toHaveCssClass('card-warning');
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
    expect(el[0]).toHaveCssClass('card-success');
    expect(el[1]).toHaveCssClass('card-danger');
    expect(el[2]).toHaveCssClass('card-warning');
  });

  describe('Custom config', () => {
    let config: NgbAccordionConfig;

    beforeEach(() => { TestBed.configureTestingModule({imports: [NgbAccordionModule.forRoot()]}); });

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
          {imports: [NgbAccordionModule.forRoot()], providers: [{provide: NgbAccordionConfig, useValue: config}]});
    });

    it('should initialize inputs with provided config as provider', () => {
      const fixture = TestBed.createComponent(NgbAccordion);
      fixture.detectChanges();

      let accordion = fixture.componentInstance;
      expect(accordion.closeOtherPanels).toBe(config.closeOthers);
      expect(accordion.type).toBe(config.type);
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
  changeCallback = (event: any) => {};
}
