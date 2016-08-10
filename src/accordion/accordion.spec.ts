import {async, TestBed} from '@angular/core/testing';

import {TestComponentBuilder} from '@angular/core/testing';

import {Component} from '@angular/core';

import {NgbAccordionModule} from './index';

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
      (change)="changeCallback($event)" [type]="classType">
      <ngb-panel *ngFor="let panel of panels" [id]="panel.id" [disabled]="panel.disabled" [type]="panel.type">
        <template ngbPanelTitle>{{panel.title}}</template>
        <template ngbPanelContent>{{panel.content}}</template>
      </ngb-panel>
    </ngb-accordion>
    <button *ngFor="let panel of panels" (click)="acc.toggle(panel.id)">Toggle the panel {{ panel.id }}</button>
  `;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [TestComponent], imports: [NgbAccordionModule]});
    TestBed.overrideComponent(TestComponent, {set: {template: html}});
  });

  it('should have no open panels', async(() => {
       const fixture = TestBed.createComponent(TestComponent);
       fixture.detectChanges();
       expectOpenPanels(fixture.nativeElement, [false, false, false]);
     }));

  it('should toggle panels based on "activeIds" values', async(() => {
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
     }));


  it('should toggle panels independently', async(() => {
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
     }));

  it('should allow only one panel to be active with "closeOthers" flag', async(() => {
       const fixture = TestBed.createComponent(TestComponent);
       fixture.detectChanges();

       const tc = fixture.componentInstance;
       const el = fixture.nativeElement;

       tc.closeOthers = true;

       getButton(el, 0).click();
       fixture.detectChanges();
       expectOpenPanels(el, [true, false, false]);

       getButton(el, 1).click();
       fixture.detectChanges();
       expectOpenPanels(el, [false, true, false]);
     }));

  it('should have the appropriate heading', async(() => {
       const fixture = TestBed.createComponent(TestComponent);
       fixture.detectChanges();

       const compiled = fixture.nativeElement;

       const titles = Array.from(compiled.querySelectorAll('.card-header a'));
       expect(titles.length).not.toBe(0);

       titles.forEach(
           (title: HTMLElement, idx: number) => { expect(title.textContent.trim()).toBe(`Panel ${idx + 1}`); });
     }));

  it('should only open one at a time', async(() => {
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
     }));



  it('should have only one open panel even if binding says otherwise', async(() => {
       const fixture = TestBed.createComponent(TestComponent);
       const tc = fixture.componentInstance;

       tc.activeIds = ['one', 'two'];
       tc.closeOthers = true;
       fixture.detectChanges();

       expectOpenPanels(fixture.nativeElement, [true, false, false]);
     }));

  it('should not open disabled panels from click', async(() => {
       const fixture = TestBed.createComponent(TestComponent);
       const tc = fixture.componentInstance;
       tc.panels[0].disabled = true;
       fixture.detectChanges();

       const headingLinks = fixture.nativeElement.querySelectorAll('.card-header a');

       headingLinks[0].click();
       fixture.detectChanges();

       expectOpenPanels(fixture.nativeElement, [false, false, false]);
     }));

  it('should open/collapse disabled panels', async(() => {
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
     }));

  it('should remove collapsed panels content from DOM', async(() => {
       const fixture = TestBed.createComponent(TestComponent);
       fixture.detectChanges();
       expect(getPanelsContent(fixture.nativeElement).length).toBe(0);

       getButton(fixture.nativeElement, 0).click();
       fixture.detectChanges();
       expect(getPanelsContent(fixture.nativeElement).length).toBe(1);
     }));

  it('should emit panel change event when toggling panels', async(() => {
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
     }));

  it('should cancel panel toggle when preventDefault() is called', async(() => {
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
     }));


  it('should have specified type of accordion ', async(() => {
       const testHtml = `
    <ngb-accordion #acc="ngbAccordion" [closeOthers]="closeOthers" [type]="classType">
     <ngb-panel *ngFor="let panel of panels" [id]="panel.id" [disabled]="panel.disabled">
       <template ngbPanelTitle>{{panel.title}}</template>
       <template ngbPanelContent>{{panel.content}}</template>
     </ngb-panel>
    </ngb-accordion>
    <button *ngFor="let panel of panels" (click)="acc.toggle(panel.id)">Toggle the panel {{ panel.id }}</button>
    `;
       TestBed.overrideComponent(TestComponent, {set: {template: testHtml}});
       const fixture = TestBed.createComponent(TestComponent);
       fixture.detectChanges();

       fixture.componentInstance.classType = 'warning';
       fixture.detectChanges();

       let el = fixture.nativeElement.querySelectorAll('.card-header');
       expect(el[0]).toHaveCssClass('card-warning');
       expect(el[1]).toHaveCssClass('card-warning');
       expect(el[2]).toHaveCssClass('card-warning');
     }));

  it('should override the type in accordion with type in panel', async(() => {
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
     }));
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
