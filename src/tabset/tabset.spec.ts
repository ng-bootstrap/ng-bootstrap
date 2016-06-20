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

function expectActiveTabs(nativeEl: HTMLElement, active: boolean[]) {
  const tabTitles = getTabTitles(nativeEl);
  const tabContent = getTabContent(nativeEl);

  expect(tabTitles.length).toBe(active.length);
  expect(tabContent.length).toBe(active.length);

  for (let i = 0; i < active.length; i++) {
    if (active[i]) {
      expect(tabTitles[i]).toHaveCssClass('active');
      expect(tabContent[i]).toHaveCssClass('active');
    } else {
      expect(tabTitles[i]).not.toHaveCssClass('active');
      expect(tabContent[i]).not.toHaveCssClass('active');
    }
  }
}

function expectDisabledTabs(nativeEl: HTMLElement, disabled: boolean[]) {
  const tabTitles = getTabTitles(nativeEl);
  const tabContent = getTabContent(nativeEl);

  expect(tabTitles.length).toBe(disabled.length);
  expect(tabContent.length).toBe(disabled.length);

  for (let i = 0; i < disabled.length; i++) {
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

         expectActiveTabs(fixture.nativeElement, [true, false]);
         expectDisabledTabs(fixture.nativeElement, [false, false]);
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

  it('should mark the requested tab as active', async(inject([TestComponentBuilder], (tcb) => {
       const html = `
      <ngb-tabset [activeIdx]="1">
        <ngb-tab title="foo"><template ngbTabContent>Foo</template></ngb-tab>
        <ngb-tab title="bar"><template ngbTabContent>Bar</template></ngb-tab>
      </ngb-tabset>
    `;

       tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();
         expectActiveTabs(fixture.nativeElement, [false, true]);
         expectDisabledTabs(fixture.nativeElement, [false, false]);
       });
     })));

  it('should auto-correct requested active tab index', async(inject([TestComponentBuilder], (tcb) => {
       const html = `
      <ngb-tabset [activeIdx]="activeTabIdx">
        <ngb-tab title="foo"><template ngbTabContent>Foo</template></ngb-tab>
        <ngb-tab title="bar"><template ngbTabContent>Bar</template></ngb-tab>
      </ngb-tabset>
    `;

       tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.componentInstance.activeTabIdx = 100;
         fixture.detectChanges();
         expectActiveTabs(fixture.nativeElement, [false, true]);
         expectDisabledTabs(fixture.nativeElement, [false, false]);

         fixture.componentInstance.activeTabIdx = -100;
         fixture.detectChanges();
         expectActiveTabs(fixture.nativeElement, [true, false]);
         expectDisabledTabs(fixture.nativeElement, [false, false]);
       });
     })));

  it('should change active tab on tab title click', async(inject([TestComponentBuilder], (tcb) => {
       const html = `
      <ngb-tabset [activeIdx]="activeTabIdx">
        <ngb-tab title="foo"><template ngbTabContent>Foo</template></ngb-tab>
        <ngb-tab title="bar"><template ngbTabContent>Bar</template></ngb-tab>
      </ngb-tabset>
    `;

       tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();

         const tabTitles = getTabTitles(fixture.nativeElement);

         (<HTMLAnchorElement>tabTitles[1]).click();
         fixture.detectChanges();
         expectActiveTabs(fixture.nativeElement, [false, true]);
         expectDisabledTabs(fixture.nativeElement, [false, false]);

         (<HTMLAnchorElement>tabTitles[0]).click();
         fixture.detectChanges();
         expectActiveTabs(fixture.nativeElement, [true, false]);
         expectDisabledTabs(fixture.nativeElement, [false, false]);
       });
     })));

  it('should have disabled class on disabled tab', async(inject([TestComponentBuilder], (tcb) => {
       const html = `
         <ngb-tabset [activeIdx]="activeTabIdx">
           <ngb-tab title="foo" [disabled]=true><template ngbTabContent>Foo</template></ngb-tab>
         </ngb-tabset>
       `;

       tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();

         const tabTitles = getTabTitles(fixture.nativeElement);

         (<HTMLAnchorElement>tabTitles[0]).click();
         fixture.detectChanges();
         expectActiveTabs(fixture.nativeElement, [false]);
         expectDisabledTabs(fixture.nativeElement, [true]);
       });
     })));

  it('should not change active tab on disabled tab title click', async(inject([TestComponentBuilder], (tcb) => {
       const html = `
         <ngb-tabset [activeIdx]="activeTabIdx">
           <ngb-tab title="foo"><template ngbTabContent>Foo</template></ngb-tab>
           <ngb-tab title="bar" [disabled]=true><template ngbTabContent>Bar</template></ngb-tab>
         </ngb-tabset>
       `;

       tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();
         expectDisabledTabs(fixture.nativeElement, [false, true]);

         const tabTitles = getTabTitles(fixture.nativeElement);

         (<HTMLAnchorElement>tabTitles[1]).click();
         fixture.detectChanges();
         expectActiveTabs(fixture.nativeElement, [false, false]);
         expectDisabledTabs(fixture.nativeElement, [false, true]);
       });
     })));
});

@Component({selector: 'test-cmp', directives: [NgbTabset, NgbTab, NgbTabContent, NgbTabTitle], template: ''})
class TestComponent {
  activeTabIdx;
}
