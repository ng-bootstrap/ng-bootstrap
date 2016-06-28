import {
  iit,
  it,
  ddescribe,
  describe,
  expect,
  inject,
  async,
  beforeEach,
  beforeEachProviders
} from '@angular/core/testing';

import {TestComponentBuilder} from '@angular/compiler/testing';

import {Component} from '@angular/core';

import {NgbTabset, NgbTab, NgbTabContent, NgbTabTitle} from './tabset';

function getTabTitles(nativeEl: HTMLElement) {
  return nativeEl.querySelectorAll('.nav-link');
}

function getTabContent(nativeEl: HTMLElement) {
  return nativeEl.querySelectorAll('.tab-content .tab-pane');
}

function expectTabs(nativeEl: HTMLElement, active: boolean[], disabled?: boolean[]) {
  const tabTitles = getTabTitles(nativeEl);
  const tabContent = getTabContent(nativeEl);

  expect(tabTitles.length).toBe(active.length);
  expect(tabContent.length).toBe(active.length);

  if (disabled) {
    expect(disabled.length).toBe(active.length);
  } else {
    disabled = new Array(active.length);  // tabs are not disabled by default
  }

  for (let i = 0; i < active.length; i++) {
    if (active[i]) {
      expect(tabTitles[i]).toHaveCssClass('active');
      expect(tabContent[i]).toHaveCssClass('active');
    } else {
      expect(tabTitles[i]).not.toHaveCssClass('active');
      expect(tabContent[i]).not.toHaveCssClass('active');
    }

    if (disabled[i]) {
      expect(tabTitles[i]).toHaveCssClass('disabled');
    } else {
      expect(tabTitles[i]).not.toHaveCssClass('disabled');
    }
  }
}

describe('ngb-tabset', () => {

  it('should render tabs and select first tab as active by default', async(inject([TestComponentBuilder], (tcb) => {
       const html = `
      <ngb-tabset>
        <ngb-tab title="foo"><template ngbTabContent>Foo</template></ngb-tab>
        <ngb-tab title="bar"><template ngbTabContent>Bar</template></ngb-tab>
      </ngb-tabset>
    `;

       tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();

         const tabTitles = getTabTitles(fixture.nativeElement);
         const tabContent = getTabContent(fixture.nativeElement);

         expect(tabTitles[0].textContent).toMatchPattern(/foo/);
         expect(tabTitles[1].textContent).toMatchPattern(/bar/);
         expect(tabContent[0].textContent).toMatchPattern(/Foo/);
         expect(tabContent[1].textContent).toMatchPattern(/Bar/);

         expectTabs(fixture.nativeElement, [true, false]);
       });
     })));

  it('should allow mix of text and HTML in tab titles', async(inject([TestComponentBuilder], (tcb) => {
       const html = `
      <ngb-tabset>
        <ngb-tab title="foo"><template ngbTabContent>Foo</template></ngb-tab>
        <ngb-tab>
          <template ngbTabTitle><b>bar</b></template>
          <template ngbTabContent>Bar</template>
        </ngb-tab>
        <ngb-tab title="baz">
          <template ngbTabTitle>baz</template>
          <template ngbTabContent>Baz</template>
        </ngb-tab>
      </ngb-tabset>
    `;

       tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();

         const tabTitles = getTabTitles(fixture.nativeElement);

         expect(tabTitles[0].textContent).toMatchPattern(/foo/);
         expect(tabTitles[1].innerHTML).toMatchPattern(/<b>bar<\/b>/);
         expect(tabTitles[2].textContent).toMatchPattern(/bazbaz/);
       });
     })));

  it('should not crash for empty tabsets', async(inject([TestComponentBuilder], (tcb) => {
       const html = `<ngb-tabset activeId="2"></ngb-tabset>`;

       tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();
         expectTabs(fixture.nativeElement, []);
       });
     })));

  it('should mark the requested tab as active', async(inject([TestComponentBuilder], (tcb) => {
       const html = `
      <ngb-tabset activeId="2">
        <ngb-tab title="foo" id="1"><template ngbTabContent>Foo</template></ngb-tab>
        <ngb-tab title="bar" id="2"><template ngbTabContent>Bar</template></ngb-tab>
      </ngb-tabset>
    `;

       tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();
         expectTabs(fixture.nativeElement, [false, true]);
       });
     })));

  it('should auto-correct requested active tab index', async(inject([TestComponentBuilder], (tcb) => {
       const html = `
      <ngb-tabset activeId="doesntExist">
        <ngb-tab title="foo"><template ngbTabContent>Foo</template></ngb-tab>
        <ngb-tab title="bar"><template ngbTabContent>Bar</template></ngb-tab>
      </ngb-tabset>
    `;

       tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();
         expectTabs(fixture.nativeElement, [true, false]);
       });
     })));

  it('should auto-correct requested active tab index for undefined indexes',
     async(inject([TestComponentBuilder], (tcb) => {
       const html = `
      <ngb-tabset [activeId]="activeTabId">
        <ngb-tab title="foo"><template ngbTabContent>Foo</template></ngb-tab>
        <ngb-tab title="bar"><template ngbTabContent>Bar</template></ngb-tab>
      </ngb-tabset>
    `;

       tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();
         expectTabs(fixture.nativeElement, [true, false]);
       });
     })));

  it('should change active tab on tab title click', async(inject([TestComponentBuilder], (tcb) => {
       const html = `
      <ngb-tabset>
        <ngb-tab title="foo"><template ngbTabContent>Foo</template></ngb-tab>
        <ngb-tab title="bar"><template ngbTabContent>Bar</template></ngb-tab>
      </ngb-tabset>
    `;

       tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();

         const tabTitles = getTabTitles(fixture.nativeElement);

         (<HTMLAnchorElement>tabTitles[1]).click();
         fixture.detectChanges();
         expectTabs(fixture.nativeElement, [false, true]);

         (<HTMLAnchorElement>tabTitles[0]).click();
         fixture.detectChanges();
         expectTabs(fixture.nativeElement, [true, false]);
       });
     })));

  it('should support disabled tabs', async(inject([TestComponentBuilder], (tcb) => {
       const html = `
         <ngb-tabset>
           <ngb-tab title="foo"><template ngbTabContent>Foo</template></ngb-tab>
           <ngb-tab title="bar" [disabled]="true"><template ngbTabContent>Bar</template></ngb-tab>
         </ngb-tabset>
       `;

       tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();

         expectTabs(fixture.nativeElement, [true, false], [false, true]);
       });
     })));

  it('should not change active tab on disabled tab title click', async(inject([TestComponentBuilder], (tcb) => {
       const html = `
         <ngb-tabset>
           <ngb-tab title="foo"><template ngbTabContent>Foo</template></ngb-tab>
           <ngb-tab title="bar" [disabled]="true"><template ngbTabContent>Bar</template></ngb-tab>
         </ngb-tabset>
       `;

       tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();
         expectTabs(fixture.nativeElement, [true, false], [false, true]);

         (<HTMLAnchorElement>getTabTitles(fixture.nativeElement)[1]).click();
         fixture.detectChanges();
         expectTabs(fixture.nativeElement, [true, false], [false, true]);
       });
     })));

  it('should allow initially active and disabled tabs', async(inject([TestComponentBuilder], (tcb) => {
       const html = `
         <ngb-tabset>
           <ngb-tab title="bar" [disabled]="true"><template ngbTabContent>Bar</template></ngb-tab>
         </ngb-tabset>
       `;

       tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();
         expectTabs(fixture.nativeElement, [true], [true]);
       });
     })));

  it('should have nav-tabs default', async(inject([TestComponentBuilder], (tcb) => {
       const html = `
         <ngb-tabset>
           <ngb-tab title="bar"><template ngbTabContent>Bar</template></ngb-tab>
         </ngb-tabset>
       `;

       tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();

         expect(fixture.nativeElement.querySelector('ul')).toHaveCssClass('nav-tabs');
         expect(fixture.nativeElement.querySelector('ul')).not.toHaveCssClass('nav-pills');

       });
     })));

  it('should have pills upon setting pills', async(inject([TestComponentBuilder], (tcb) => {
       const html = `
         <ngb-tabset type="pills">
           <ngb-tab title="bar"><template ngbTabContent>Bar</template></ngb-tab>
         </ngb-tabset>
       `;

       tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();

         expect(fixture.nativeElement.querySelector('ul')).toHaveCssClass('nav-pills');
         expect(fixture.nativeElement.querySelector('ul')).not.toHaveCssClass('nav-tabs');

       });
     })));
});

@Component({selector: 'test-cmp', directives: [NgbTabset, NgbTab, NgbTabContent, NgbTabTitle], template: ''})
class TestComponent {
  activeTabId;
}
