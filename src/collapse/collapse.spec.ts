import {async, TestBed} from '@angular/core/testing';

import {Component} from '@angular/core';

import {NgbCollapseModule} from './index';
import {NgbCollapse} from './collapse';

function getCollapsibleContent(element: HTMLElement): HTMLDivElement {
  return <HTMLDivElement>element.querySelector('.collapse');
}

describe('ngb-collapse', () => {
  let html = `<div [ngbCollapse]="collapsed">Some content</div>`;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [TestComponent], imports: [NgbCollapseModule]});
    TestBed.overrideComponent(TestComponent, {set: {template: html}});
  });

  it('should have content open and aria-expanded true', async(() => {
       const fixture = TestBed.createComponent(TestComponent);
       fixture.detectChanges();

       const collapseEl = getCollapsibleContent(fixture.nativeElement);

       expect(collapseEl).toHaveCssClass('in');
       expect(collapseEl.getAttribute('aria-expanded')).toBe('true');
     }));

  it('should have content closed and aria-expanded false', async(() => {
       const fixture = TestBed.createComponent(TestComponent);
       const tc = fixture.componentInstance;
       tc.collapsed = true;
       fixture.detectChanges();

       const collapseEl = getCollapsibleContent(fixture.nativeElement);

       expect(collapseEl).not.toHaveCssClass('in');
       expect(collapseEl.getAttribute('aria-expanded')).toBe('false');
     }));

  it('should toggle collapsed content based on bound model change', async(() => {
       const fixture = TestBed.createComponent(TestComponent);
       fixture.detectChanges();

       const tc = fixture.componentInstance;
       const collapseEl = getCollapsibleContent(fixture.nativeElement);
       expect(collapseEl).toHaveCssClass('in');

       tc.collapsed = true;
       fixture.detectChanges();
       expect(collapseEl).not.toHaveCssClass('in');

       tc.collapsed = false;
       fixture.detectChanges();
       expect(collapseEl).toHaveCssClass('in');
     }));

  it('should allow toggling collapse from outside', async(() => {
       html = `
      <button (click)="collapse.collapsed = !collapse.collapsed">Collapse</button>
      <div [ngbCollapse] #collapse="ngbCollapse"></div>`;

       TestBed.overrideComponent(TestComponent, {set: {template: html}});
       const fixture = TestBed.createComponent(TestComponent);
       fixture.detectChanges();

       const compiled = fixture.nativeElement;
       const collapseEl = getCollapsibleContent(compiled);
       const buttonEl = compiled.querySelector('button');

       buttonEl.click();
       fixture.detectChanges();
       expect(collapseEl).not.toHaveCssClass('in');

       buttonEl.click();
       fixture.detectChanges();
       expect(collapseEl).toHaveCssClass('in');
     }));
});

@Component({selector: 'test-cmp', template: ''})
class TestComponent {
  collapsed = false;
}
