import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {createGenericTestComponent, isBrowserVisible} from '../test/common';

import {Component} from '@angular/core';

import {NgbCollapseModule} from './collapse.module';
import {NgbConfig} from '../ngb-config';
import {NgbConfigAnimation} from '../test/ngb-config-animation';

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

if (isBrowserVisible('ngb-collapse animations')) {
  describe('ngb-collapse animations', () => {

    @Component({
      template: `
        <button (click)="c.toggle()">Collapse!</button>
        <div [(ngbCollapse)]="collapsed" #c="ngbCollapse" (ngbCollapseChange)="onCollapse()"></div>
      `,
      host: {'[class.ngb-reduce-motion]': 'reduceMotion'}
    })
    class TestAnimationComponent {
      collapsed = false;
      reduceMotion = true;
      onCollapse = () => {};
    }

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TestAnimationComponent],
        imports: [NgbCollapseModule],
        providers: [{provide: NgbConfig, useClass: NgbConfigAnimation}]
      });
    });

    [true, false].forEach(reduceMotion => {

      it(`should run collapsing transition (force-reduced-motion = ${reduceMotion})`, async(() => {
           const fixture = TestBed.createComponent(TestAnimationComponent);
           fixture.componentInstance.reduceMotion = reduceMotion;
           fixture.detectChanges();

           const buttonEl = fixture.nativeElement.querySelector('button');
           const content = getCollapsibleContent(fixture.nativeElement);

           const onCollapseSpy = spyOn(fixture.componentInstance, 'onCollapse');

           // First we're going to collapse, then expand
           onCollapseSpy.and.callFake(() => {
             if (fixture.componentInstance.collapsed) {
               expect(content).toHaveClass('collapse');
               expect(content).not.toHaveClass('show');
               expect(content).not.toHaveClass('collapsing');

               // Expanding
               buttonEl.click();
             } else {
               expect(content).toHaveClass('collapse');
               expect(content).toHaveClass('show');
               expect(content).not.toHaveClass('collapsing');
             }
           });

           expect(content).toHaveClass('collapse');
           expect(content).toHaveClass('show');
           expect(content).not.toHaveClass('collapsing');
           expect(fixture.componentInstance.collapsed).toBe(false);

           // Collapsing
           buttonEl.click();
           expect(content).not.toHaveClass('collapse');
           expect(content).not.toHaveClass('show');
           expect(content).toHaveClass('collapsing');
         }));

      it(`should run revert collapsing transition (force-reduced-motion = ${reduceMotion})`, async(() => {
           const fixture = TestBed.createComponent(TestAnimationComponent);
           fixture.componentInstance.reduceMotion = reduceMotion;
           fixture.detectChanges();

           const buttonEl = fixture.nativeElement.querySelector('button');
           const content = getCollapsibleContent(fixture.nativeElement);

           const onCollapseSpy = spyOn(fixture.componentInstance, 'onCollapse');

           onCollapseSpy.and.callFake(() => {
             expect(fixture.componentInstance.collapsed).toBe(false);
             expect(content).toHaveClass('collapse');
             expect(content).toHaveClass('show');
             expect(content).not.toHaveClass('collapsing');
           });

           expect(content).toHaveClass('collapse');
           expect(content).toHaveClass('show');
           expect(content).not.toHaveClass('collapsing');
           expect(fixture.componentInstance.collapsed).toBe(false);

           // Collapsing
           buttonEl.click();
           expect(content).not.toHaveClass('collapse');
           expect(content).not.toHaveClass('show');
           expect(content).toHaveClass('collapsing');

           // Expanding
           buttonEl.click();
           if (reduceMotion) {
             expect(content).toHaveClass('collapse');
             expect(content).toHaveClass('show');
             expect(content).not.toHaveClass('collapsing');
           } else {
             expect(content).not.toHaveClass('collapse');
             expect(content).not.toHaveClass('show');
             expect(content).toHaveClass('collapsing');
           }
         }));
    });
  });
}

@Component({selector: 'test-cmp', template: ''})
class TestComponent {
  collapsed = false;
}
