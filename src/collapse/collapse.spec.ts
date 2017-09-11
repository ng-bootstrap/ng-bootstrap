import {TestBed, ComponentFixture, fakeAsync, tick} from '@angular/core/testing';
import {createGenericTestComponent} from '../test/common';
import {By} from '@angular/platform-browser';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

import {Component} from '@angular/core';

import {NgbCollapseModule, NgbCollapse} from './collapse.module';

const createTestComponent = (html: string) =>
    createGenericTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;

function getCollapsible(fixture: ComponentFixture<TestComponent>): HTMLElement {
  return fixture.debugElement.query(By.directive(NgbCollapse)).nativeElement;
}

describe('ngb-collapse', () => {
  let html = `<div [ngbCollapse]="collapsed">Some content</div>`;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [TestComponent], imports: [NoopAnimationsModule, NgbCollapseModule]});
    TestBed.overrideComponent(TestComponent, {set: {template: html}});
  });

  beforeEach(() => {
    jasmine.addMatchers({
      toBeExpanded: function(util, customEqualityTests) {
        return {
          compare: function(collapseEl: HTMLElement) {
            return {pass: collapseEl.offsetHeight > 0, message: `Expected ${collapseEl.outerHTML} to have height > 0`};
          },
          negativeCompare: function(collapseEl: HTMLElement) {
            return {pass: collapseEl.offsetHeight === 0, message: `Expected ${collapseEl.outerHTML} to have height 0`};
          }
        };
      }
    });
  });

  it('should have content open by default', () => {
    const fixture = TestBed.createComponent(TestComponent);

    fixture.detectChanges();
    expect(getCollapsible(fixture)).toBeExpanded();
  });

  it('should have content closed when [ngbCollapse] binding evaluates to true', () => {
    const fixture = TestBed.createComponent(TestComponent);
    const tc = fixture.componentInstance;
    tc.collapsed = true;
    fixture.detectChanges();

    expect(getCollapsible(fixture)).not.toBeExpanded();
  });

  it('should toggle collapsed content based on bound model change', fakeAsync(() => {
       const fixture = TestBed.createComponent(TestComponent);
       fixture.detectChanges();

       const tc = fixture.componentInstance;
       const collapseEl = getCollapsible(fixture);
       expect(collapseEl).toBeExpanded();

       tc.collapsed = true;
       fixture.detectChanges();
       tick();
       expect(collapseEl).not.toBeExpanded();

       tc.collapsed = false;
       fixture.detectChanges();
       tick();
       expect(collapseEl).toBeExpanded();
     }));

  it('should allow toggling collapse from outside', fakeAsync(() => {
       html = `
      <button (click)="collapse.collapsed = !collapse.collapsed">Collapse</button>
      <div [ngbCollapse] #collapse="ngbCollapse">content</div>`;

       const fixture = createTestComponent(html);

       const collapseEl = getCollapsible(fixture);
       const buttonEl = fixture.nativeElement.querySelector('button');

       buttonEl.click();
       fixture.detectChanges();
       tick();
       expect(collapseEl).not.toBeExpanded();

       buttonEl.click();
       fixture.detectChanges();
       tick();
       expect(collapseEl).toBeExpanded();
     }));
});

@Component({selector: 'test-cmp', template: ''})
class TestComponent {
  collapsed = false;
}
