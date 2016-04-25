import {
  iit,
  it,
  ddescribe,
  describe,
  expect,
  inject,
  async,
  TestComponentBuilder,
  beforeEach,
  beforeEachProviders
} from 'angular2/testing';

import {Component} from 'angular2/core';

import {NgbTabset, NgbTab, NgbTabContent, NgbTabTitle} from './tabset';

function getTabTitles(nativeEl: HTMLElement) {
  return nativeEl.querySelectorAll('.nav-link');
}

function getTabContent(nativeEl: HTMLElement) {
  return nativeEl.querySelectorAll('.tab-content .tab-pane');
}

function expectActiveTabs(nativeEl: HTMLElement, active: boolean[]) {
  var tabTitles = getTabTitles(nativeEl);
  var tabContent = getTabContent(nativeEl);

  expect(tabTitles.length).toBe(active.length);
  expect(tabContent.length).toBe(active.length);

  for (var i = 0; i < active.length; i++) {
    if (active[i]) {
      expect(tabTitles[i]).toHaveCssClass('active');
      expect(tabContent[i]).toHaveCssClass('active');
    } else {
      expect(tabTitles[i]).not.toHaveCssClass('active');
      expect(tabContent[i]).not.toHaveCssClass('active');
    }
  }
}

describe('ngb-tabset', () => {

  it('should render tabs and select first tab as active by default', async(inject([TestComponentBuilder], (tcb) => {
       const html = `
      <ngb-tabset>
        <ngb-tab title="foo"><template ngb-tab-content>Foo</template></ngb-tab>
        <ngb-tab title="bar"><template ngb-tab-content>Bar</template></ngb-tab>
      </ngb-tabset>
    `;

       tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();

         var tabTitles = getTabTitles(fixture.nativeElement);
         var tabContent = getTabContent(fixture.nativeElement);

         expect(tabTitles[0].textContent).toMatchPattern(/foo/);
         expect(tabTitles[1].textContent).toMatchPattern(/bar/);
         expect(tabContent[0].textContent).toMatchPattern(/Foo/);
         expect(tabContent[1].textContent).toMatchPattern(/Bar/);

         expectActiveTabs(fixture.nativeElement, [true, false]);
       });
     })));

  it('should allow mix of text and HTML in tab titles', async(inject([TestComponentBuilder], (tcb) => {
       const html = `
      <ngb-tabset>
        <ngb-tab title="foo"><template ngb-tab-content>Foo</template></ngb-tab>
        <ngb-tab>
          <template ngb-tab-title><b>bar</b></template>
          <template ngb-tab-content>Bar</template>
        </ngb-tab>
        <ngb-tab title="baz">
          <template ngb-tab-title>baz</template>
          <template ngb-tab-content>Baz</template>
        </ngb-tab>
      </ngb-tabset>
    `;

       tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();

         var tabTitles = getTabTitles(fixture.nativeElement);

         expect(tabTitles[0].textContent).toMatchPattern(/foo/);
         expect(tabTitles[1].innerHTML).toMatchPattern(/<b>bar<\/b>/);
         expect(tabTitles[2].textContent).toMatchPattern(/bazbaz/);
       });
     })));

  it('should mark the requested tab as active', async(inject([TestComponentBuilder], (tcb) => {
       const html = `
      <ngb-tabset [activeIdx]="1">
        <ngb-tab title="foo"><template ngb-tab-content>Foo</template></ngb-tab>
        <ngb-tab title="bar"><template ngb-tab-content>Bar</template></ngb-tab>
      </ngb-tabset>
    `;

       tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();
         expectActiveTabs(fixture.nativeElement, [false, true]);
       });
     })));

  it('should auto-correct requested active tab index', async(inject([TestComponentBuilder], (tcb) => {
       const html = `
      <ngb-tabset [activeIdx]="activeTabIdx">
        <ngb-tab title="foo"><template ngb-tab-content>Foo</template></ngb-tab>
        <ngb-tab title="bar"><template ngb-tab-content>Bar</template></ngb-tab>
      </ngb-tabset>
    `;

       tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.componentInstance.activeTabIdx = 100;
         fixture.detectChanges();
         expectActiveTabs(fixture.nativeElement, [false, true]);

         fixture.componentInstance.activeTabIdx = -100;
         fixture.detectChanges();
         expectActiveTabs(fixture.nativeElement, [true, false]);
       });
     })));

  it('should change active tab on tab title click', async(inject([TestComponentBuilder], (tcb) => {
       const html = `
      <ngb-tabset [activeIdx]="activeTabIdx">
        <ngb-tab title="foo"><template ngb-tab-content>Foo</template></ngb-tab>
        <ngb-tab title="bar"><template ngb-tab-content>Bar</template></ngb-tab>
      </ngb-tabset>
    `;

       tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();

         var tabTitles = getTabTitles(fixture.nativeElement);

         (<HTMLAnchorElement>tabTitles[1]).click();
         fixture.detectChanges();
         expectActiveTabs(fixture.nativeElement, [false, true]);

         (<HTMLAnchorElement>tabTitles[0]).click();
         fixture.detectChanges();
         expectActiveTabs(fixture.nativeElement, [true, false]);
       });
     })));

});

@Component({selector: 'test-cmp', directives: [NgbTabset, NgbTab, NgbTabContent, NgbTabTitle], template: ''})
class TestComponent {
  activeTabIdx;
}
