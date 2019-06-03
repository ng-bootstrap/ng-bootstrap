import {ComponentFixture, TestBed} from '@angular/core/testing';
import {createGenericTestComponent} from '../test/common';

import {Component} from '@angular/core';

import {NgbCollapseModule} from './collapse.module';

const createTestComponent = (html: string) =>
    createGenericTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;

function getCollapsibleContent(element: HTMLElement): HTMLDivElement {
  return <HTMLDivElement>element.querySelector('.collapse');
}

describe('ngb-collapse', () => {
  beforeEach(() => { TestBed.configureTestingModule({declarations: [TestComponent], imports: [NgbCollapseModule]}); });

  it('should have content open', () => {
    const fixture = createTestComponent(`<div [ngbCollapse]="collapsed">Some content</div>`);

    const collapseEl = getCollapsibleContent(fixture.nativeElement);

    expect(collapseEl).toHaveCssClass('show');
  });

  it('should have content closed', () => {
    const fixture = createTestComponent(`<div [ngbCollapse]="collapsed">Some content</div>`);
    const tc = fixture.componentInstance;
    tc.collapsed = true;
    fixture.detectChanges();

    const collapseEl = getCollapsibleContent(fixture.nativeElement);

    expect(collapseEl).not.toHaveCssClass('show');
  });

  it('should toggle collapsed content based on bound model change', () => {
    const fixture = createTestComponent(`<div [ngbCollapse]="collapsed">Some content</div>`);

    const tc = fixture.componentInstance;
    const collapseEl = getCollapsibleContent(fixture.nativeElement);
    expect(collapseEl).toHaveCssClass('show');

    tc.collapsed = true;
    fixture.detectChanges();
    expect(collapseEl).not.toHaveCssClass('show');

    tc.collapsed = false;
    fixture.detectChanges();
    expect(collapseEl).toHaveCssClass('show');
  });

  it('should allow toggling collapse from outside', () => {
    const fixture = createTestComponent(`
      <button (click)="collapse.collapsed = !collapse.collapsed">Collapse</button>
      <div [ngbCollapse] #collapse="ngbCollapse"></div>`);

    const compiled = fixture.nativeElement;
    const collapseEl = getCollapsibleContent(compiled);
    const buttonEl = compiled.querySelector('button');

    buttonEl.click();
    fixture.detectChanges();
    expect(collapseEl).not.toHaveCssClass('show');

    buttonEl.click();
    fixture.detectChanges();
    expect(collapseEl).toHaveCssClass('show');
  });
});

@Component({selector: 'test-cmp', template: ''})
class TestComponent {
  collapsed = false;
}
