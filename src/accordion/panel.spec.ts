import {inject, async, addProviders} from '@angular/core/testing';

import {TestComponentBuilder} from '@angular/compiler/testing';

import {Component} from '@angular/core';

import {NgbPanel} from './accordion';

function expectToBeClosed(panelEl) {
  expect(panelEl.querySelector('.panel')).not.toHaveCssClass('panel-open');
  expect(panelEl.querySelector('.panel .panel-collapse')).not.toHaveCssClass('in');
  expect(panelEl.querySelector('.panel .panel-collapse').getAttribute('aria-expanded')).toEqual('false');
}

function expectToBeOpen(panelEl) {
  expect(panelEl.querySelector('.panel')).toHaveCssClass('panel-open');
  expect(panelEl.querySelector('.panel .panel-collapse')).toHaveCssClass('in');
  expect(panelEl.querySelector('.panel .panel-collapse').getAttribute('aria-expanded')).toEqual('true');
}

function expectToBeDisabled(panelEl) {
  expect(panelEl.querySelector('.panel-title span')).toHaveCssClass('text-muted');
}

function expectToBeEnabled(panelEl) {
  expect(panelEl.querySelector('.panel-title span')).not.toHaveCssClass('text-muted');
}

describe('ngb-panel', () => {
  it('should render as a closed, enabled panel by default', async(inject([TestComponentBuilder], (tcb) => {
       const panelHtml = `
      <ngb-panel title="Test title">Test content</ngb-panel>
    `;

       return tcb.overrideTemplate(TestComponent, panelHtml).createAsync(TestComponent).then((fixture) => {
         const panelEl = fixture.nativeElement;

         fixture.detectChanges();
         expectToBeClosed(panelEl);
         expectToBeEnabled(panelEl);
       });
     })));

  it('should render an open pane when requested', async(inject([TestComponentBuilder], (tcb) => {
       const panelHtml = `
      <ngb-panel title="Test title" [open]="true">Test content</ngb-panel>
    `;

       return tcb.overrideTemplate(TestComponent, panelHtml).createAsync(TestComponent).then((fixture) => {
         const panelEl = fixture.nativeElement;

         fixture.detectChanges();
         expectToBeOpen(panelEl);
       });
     })));

  it('should render a disabled pane when requested', async(inject([TestComponentBuilder], (tcb) => {
       const panelHtml = `
      <ngb-panel title="Test title" [disabled]="true">Test content</ngb-panel>
    `;

       return tcb.overrideTemplate(TestComponent, panelHtml).createAsync(TestComponent).then((fixture) => {
         const panelEl = fixture.nativeElement;

         fixture.detectChanges();
         expectToBeClosed(panelEl);
         expectToBeDisabled(panelEl);
       });
     })));

  it('should render an open and disabled pane when requested', async(inject([TestComponentBuilder], (tcb) => {
       const panelHtml = `
      <ngb-panel title="Test title" [open]="true" [disabled]="true">Test content</ngb-panel>
    `;

       return tcb.overrideTemplate(TestComponent, panelHtml).createAsync(TestComponent).then((fixture) => {
         const panelEl = fixture.nativeElement;

         fixture.detectChanges();
         expectToBeOpen(panelEl);
         expectToBeDisabled(panelEl);
       });
     })));

  it('should toggle open on header click', async(inject([TestComponentBuilder], (tcb) => {
       const panelHtml = `
      <ngb-panel title="Test title">Test content</ngb-panel>
    `;

       return tcb.overrideTemplate(TestComponent, panelHtml).createAsync(TestComponent).then((fixture) => {
         const panelEl = fixture.nativeElement;

         fixture.nativeElement.querySelector('.panel a').click();
         fixture.detectChanges();
         expectToBeOpen(panelEl);

         fixture.nativeElement.querySelector('.panel a').click();
         fixture.detectChanges();
         expectToBeClosed(panelEl);
       });
     })));

  it('should not toggle open on header click if disabled', async(inject([TestComponentBuilder], (tcb) => {
       const panelHtml = `
      <ngb-panel title="Test title" [disabled]="true">Test content</ngb-panel>
    `;

       return tcb.overrideTemplate(TestComponent, panelHtml).createAsync(TestComponent).then((fixture) => {
         const panelEl = fixture.nativeElement;

         fixture.detectChanges();
         expectToBeClosed(panelEl);

         fixture.nativeElement.querySelector('.panel a').click();
         fixture.detectChanges();
         expectToBeClosed(panelEl);
       });
     })));

  it('should have the tabpanel role attribute', async(inject([TestComponentBuilder], (tcb) => {
       const panelHtml = `<ngb-panel title="Test title" [disabled]="true">Test content</ngb-panel>`;

       return tcb.overrideTemplate(TestComponent, panelHtml).createAsync(TestComponent).then((fixture) => {
         expect(fixture.nativeElement.querySelector('.panel .panel-collapse').getAttribute('role')).toEqual('tabpanel');
       });
     })));
});

@Component({selector: 'test-cmp', directives: [NgbPanel], template: ''})
class TestComponent {
  open = false;
  disabled = false;
  title = 'Test title';
}
