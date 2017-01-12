import {TestBed, ComponentFixture, inject} from '@angular/core/testing';
import {createGenericTestComponent} from '../test/common';

import {Component} from '@angular/core';

import {NgbTabsetModule} from './tabset.module';
import {NgbTabsetConfig} from './tabset-config';
import {NgbTabset} from './tabset';

const createTestComponent = (html: string) =>
    createGenericTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;

function getTabTitles(nativeEl: HTMLElement) {
  return nativeEl.querySelectorAll('.nav-link');
}

function getTabContent(nativeEl: HTMLElement) {
  return nativeEl.querySelectorAll('.tab-content .tab-pane');
}

function expectTabs(nativeEl: HTMLElement, active: boolean[], disabled?: boolean[]) {
  const tabTitles = getTabTitles(nativeEl);
  const tabContent = getTabContent(nativeEl);
  const anyTabsActive = active.reduce((prev, curr) => prev || curr, false);

  expect(tabTitles.length).toBe(active.length);
  expect(tabContent.length).toBe(anyTabsActive ? 1 : 0);  // only 1 tab content in DOM at a time

  if (disabled) {
    expect(disabled.length).toBe(active.length);
  } else {
    disabled = new Array(active.length);  // tabs are not disabled by default
  }

  for (let i = 0; i < active.length; i++) {
    if (active[i]) {
      expect(tabTitles[i]).toHaveCssClass('active');
    } else {
      expect(tabTitles[i]).not.toHaveCssClass('active');
    }

    if (disabled[i]) {
      expect(tabTitles[i]).toHaveCssClass('disabled');
    } else {
      expect(tabTitles[i]).not.toHaveCssClass('disabled');
    }
  }
}

function getButton(nativeEl: HTMLElement) {
  return nativeEl.querySelectorAll('button');
}

describe('ngb-tabset', () => {
  beforeEach(
      () => { TestBed.configureTestingModule({declarations: [TestComponent], imports: [NgbTabsetModule.forRoot()]}); });

  it('should initialize inputs with default values', () => {
    const defaultConfig = new NgbTabsetConfig();
    const tabset = new NgbTabset(new NgbTabsetConfig());
    expect(tabset.type).toBe(defaultConfig.type);
  });

  it('should render tabs and select first tab as active by default', () => {
    const fixture = createTestComponent(`
      <ngb-tabset>
        <ngb-tab title="foo"><template ngbTabContent>Foo</template></ngb-tab>
        <ngb-tab title="bar"><template ngbTabContent>Bar</template></ngb-tab>
      </ngb-tabset>
    `);

    const tabTitles = getTabTitles(fixture.nativeElement);
    const tabContent = getTabContent(fixture.nativeElement);

    expect(tabTitles[0].textContent).toMatch(/foo/);
    expect(tabTitles[1].textContent).toMatch(/bar/);
    expect(tabContent.length).toBe(1);
    expect(tabContent[0].textContent).toMatch(/Foo/);

    expectTabs(fixture.nativeElement, [true, false]);
  });

  it('should have aria attributes', () => {
    const fixture = createTestComponent(`
      <ngb-tabset>
        <ngb-tab title="foo"><template ngbTabContent>Foo</template></ngb-tab>
        <ngb-tab title="bar"><template ngbTabContent>Bar</template></ngb-tab>
      </ngb-tabset>
    `);

    const tabTitles = getTabTitles(fixture.nativeElement);
    const tabContent = getTabContent(fixture.nativeElement);

    expect(tabTitles[0].getAttribute('role')).toBe('tab');
    expect(tabTitles[0].getAttribute('aria-expanded')).toBe('true');
    expect(tabTitles[1].getAttribute('aria-expanded')).toBe('false');
    expect(tabTitles[0].getAttribute('aria-controls')).toBe(tabContent[0].getAttribute('id'));
  });

  it('should allow mix of text and HTML in tab titles', () => {
    const fixture = createTestComponent(`
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
    `);

    const tabTitles = getTabTitles(fixture.nativeElement);

    expect(tabTitles[0].textContent).toMatch(/foo/);
    expect(tabTitles[1].innerHTML).toMatch(/<b>bar<\/b>/);
    expect(tabTitles[2].textContent).toMatch(/bazbaz/);
  });


  it('should not crash for empty tabsets', () => {
    const fixture = createTestComponent(`<ngb-tabset activeId="2"></ngb-tabset>`);

    expectTabs(fixture.nativeElement, []);
  });


  it('should mark the requested tab as active', () => {
    const fixture = createTestComponent(`
      <ngb-tabset activeId="2">
        <ngb-tab title="foo" id="1"><template ngbTabContent>Foo</template></ngb-tab>
        <ngb-tab title="bar" id="2"><template ngbTabContent>Bar</template></ngb-tab>
      </ngb-tabset>
    `);

    expectTabs(fixture.nativeElement, [false, true]);
  });


  it('should auto-correct requested active tab id', () => {
    const fixture = createTestComponent(`
      <ngb-tabset activeId="doesntExist">
        <ngb-tab title="foo"><template ngbTabContent>Foo</template></ngb-tab>
        <ngb-tab title="bar"><template ngbTabContent>Bar</template></ngb-tab>
      </ngb-tabset>
    `);

    expectTabs(fixture.nativeElement, [true, false]);
  });


  it('should auto-correct requested active tab id for undefined ids', () => {
    const fixture = createTestComponent(`
      <ngb-tabset [activeId]="activeTabId">
        <ngb-tab title="foo"><template ngbTabContent>Foo</template></ngb-tab>
        <ngb-tab title="bar"><template ngbTabContent>Bar</template></ngb-tab>
      </ngb-tabset>
    `);

    expectTabs(fixture.nativeElement, [true, false]);
  });


  it('should change active tab on tab title click', () => {
    const fixture = createTestComponent(`
      <ngb-tabset>
        <ngb-tab title="foo"><template ngbTabContent>Foo</template></ngb-tab>
        <ngb-tab title="bar"><template ngbTabContent>Bar</template></ngb-tab>
      </ngb-tabset>
    `);

    const tabTitles = getTabTitles(fixture.nativeElement);

    (<HTMLElement>tabTitles[1]).click();
    fixture.detectChanges();
    expectTabs(fixture.nativeElement, [false, true]);

    (<HTMLElement>tabTitles[0]).click();
    fixture.detectChanges();
    expectTabs(fixture.nativeElement, [true, false]);
  });


  it('should support disabled tabs', () => {
    const fixture = createTestComponent(`
         <ngb-tabset>
           <ngb-tab title="foo"><template ngbTabContent>Foo</template></ngb-tab>
           <ngb-tab title="bar" [disabled]="true"><template ngbTabContent>Bar</template></ngb-tab>
         </ngb-tabset>
       `);

    expectTabs(fixture.nativeElement, [true, false], [false, true]);
  });


  it('should not change active tab on disabled tab title click', () => {
    const fixture = createTestComponent(`
         <ngb-tabset>
           <ngb-tab title="foo"><template ngbTabContent>Foo</template></ngb-tab>
           <ngb-tab title="bar" [disabled]="true"><template ngbTabContent>Bar</template></ngb-tab>
         </ngb-tabset>
       `);

    expectTabs(fixture.nativeElement, [true, false], [false, true]);

    (<HTMLElement>getTabTitles(fixture.nativeElement)[1]).click();
    fixture.detectChanges();
    expectTabs(fixture.nativeElement, [true, false], [false, true]);
  });


  it('should allow initially active and disabled tabs', () => {
    const fixture = createTestComponent(`
         <ngb-tabset>
           <ngb-tab title="bar" [disabled]="true"><template ngbTabContent>Bar</template></ngb-tab>
         </ngb-tabset>
       `);

    expectTabs(fixture.nativeElement, [true], [true]);
  });


  it('should have nav-tabs default', () => {
    const fixture = createTestComponent(`
         <ngb-tabset>
           <ngb-tab title="bar"><template ngbTabContent>Bar</template></ngb-tab>
         </ngb-tabset>
       `);

    expect(fixture.nativeElement.querySelector('ul')).toHaveCssClass('nav-tabs');
    expect(fixture.nativeElement.querySelector('ul')).not.toHaveCssClass('nav-pills');
  });


  it('should have pills upon setting pills', () => {
    const fixture = createTestComponent(`
         <ngb-tabset type="pills">
           <ngb-tab title="bar"><template ngbTabContent>Bar</template></ngb-tab>
         </ngb-tabset>
       `);

    expect(fixture.nativeElement.querySelector('ul')).toHaveCssClass('nav-pills');
    expect(fixture.nativeElement.querySelector('ul')).not.toHaveCssClass('nav-tabs');
  });

  it('should have the nav left-aligned by default', () => {
    const fixture = createTestComponent(`
         <ngb-tabset>
           <ngb-tab title="bar"><template ngbTabContent>Bar</template></ngb-tab>
         </ngb-tabset>
       `);

    expect(fixture.nativeElement.querySelector('ul')).toHaveCssClass('justify-content-start');
  });

  it('should have the nav center-aligned upon setting justify center', () => {
    const fixture = createTestComponent(`
         <ngb-tabset justify="center">
           <ngb-tab title="bar"><template ngbTabContent>Bar</template></ngb-tab>
         </ngb-tabset>
       `);

    expect(fixture.nativeElement.querySelector('ul')).toHaveCssClass('justify-content-center');
  });

  it('should have the nav right-aligned upon setting justify end', () => {
    const fixture = createTestComponent(`
         <ngb-tabset justify="end">
           <ngb-tab title="bar"><template ngbTabContent>Bar</template></ngb-tab>
         </ngb-tabset>
       `);

    expect(fixture.nativeElement.querySelector('ul')).toHaveCssClass('justify-content-end');
  });


  it('should change active tab by calling select on an exported directive instance', () => {
    const fixture = createTestComponent(`
          <ngb-tabset #myTabSet="ngbTabset">
            <ngb-tab id="myFirstTab" title="foo"><template ngbTabContent>Foo</template></ngb-tab>
            <ngb-tab id="mySecondTab" title="bar"><template ngbTabContent>Bar</template></ngb-tab>
          </ngb-tabset>
          <button (click)="myTabSet.select('myFirstTab')">Select the first Tab</button>
          <button (click)="myTabSet.select('mySecondTab')">Select the second Tab</button>
        `);

    const button = getButton(fixture.nativeElement);

    // Click on a button to select the second tab
    (<HTMLElement>button[1]).click();
    fixture.detectChanges();
    expectTabs(fixture.nativeElement, [false, true]);

    // Click on a button to select the first tab
    (<HTMLElement>button[0]).click();
    fixture.detectChanges();
    expectTabs(fixture.nativeElement, [true, false]);
  });


  it('should not change active tab by calling select on an exported directive instance in case of disable tab', () => {
    const fixture = createTestComponent(`
          <ngb-tabset #myTabSet="ngbTabset">
            <ngb-tab id="myFirstTab" title="foo"><template ngbTabContent>Foo</template></ngb-tab>
            <ngb-tab id="mySecondTab" title="bar" [disabled]="true"><template ngbTabContent>Bar</template></ngb-tab>
          </ngb-tabset>
          <button (click)="myTabSet.select('mySecondTab')">Select the second Tab</button>
        `);

    const button = getButton(fixture.nativeElement);

    // Click on a button to select the second disabled tab (should not change active tab).
    (<HTMLElement>button[0]).click();
    fixture.detectChanges();
    expectTabs(fixture.nativeElement, [true, false], [false, true]);
  });


  it('should emit tab change event when switching tabs', () => {
    const fixture = createTestComponent(`
          <ngb-tabset #myTabSet="ngbTabset" (tabChange)="changeCallback($event)">
            <ngb-tab id="first" title="first"><template ngbTabContent>First</template></ngb-tab>
            <ngb-tab id="second" title="second"><template ngbTabContent>Second</template></ngb-tab>
          </ngb-tabset>
          <button (click)="myTabSet.select('first')">Select the first Tab</button>
          <button (click)="myTabSet.select('second')">Select the second Tab</button>
        `);

    const button = getButton(fixture.nativeElement);

    spyOn(fixture.componentInstance, 'changeCallback');

    // Select the second tab -> change event
    (<HTMLElement>button[1]).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.changeCallback)
        .toHaveBeenCalledWith(jasmine.objectContaining({activeId: 'first', nextId: 'second'}));

    // Select the first tab again -> change event
    (<HTMLElement>button[0]).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.changeCallback)
        .toHaveBeenCalledWith(jasmine.objectContaining({activeId: 'second', nextId: 'first'}));
  });

  it('should not emit tab change event when selecting currently active and disabled tabs', () => {
    const fixture = createTestComponent(`
          <ngb-tabset #myTabSet="ngbTabset" (tabChange)="changeCallback($event)">
            <ngb-tab id="first" title="first"><template ngbTabContent>First</template></ngb-tab>
            <ngb-tab id="second" title="second" [disabled]="true"><template ngbTabContent>Second</template></ngb-tab>
          </ngb-tabset>
          <button (click)="myTabSet.select('first')">Select the first Tab</button>
          <button (click)="myTabSet.select('second')">Select the second Tab</button>
        `);

    const button = getButton(fixture.nativeElement);

    spyOn(fixture.componentInstance, 'changeCallback');

    // Select the currently active tab -> no change event
    (<HTMLElement>button[0]).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.changeCallback).not.toHaveBeenCalled();

    // Select the disabled tab -> no change event
    (<HTMLElement>button[1]).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.changeCallback).not.toHaveBeenCalled();
  });

  it('should cancel tab change when preventDefault() is called', () => {
    const fixture = createTestComponent(`
          <ngb-tabset #myTabSet="ngbTabset" (tabChange)="changeCallback($event)">
            <ngb-tab id="first" title="first"><template ngbTabContent>First</template></ngb-tab>
            <ngb-tab id="second" title="second"><template ngbTabContent>Second</template></ngb-tab>
          </ngb-tabset>
          <button (click)="myTabSet.select('first')">Select the first Tab</button>
          <button (click)="myTabSet.select('second')">Select the second Tab</button>
        `);

    const button = getButton(fixture.nativeElement);

    let changeEvent = null;
    fixture.componentInstance.changeCallback = (event) => {
      changeEvent = event;
      event.preventDefault();
    };

    // Select the second tab -> selection will be canceled
    (<HTMLElement>button[1]).click();
    fixture.detectChanges();
    expect(changeEvent).toEqual(jasmine.objectContaining({activeId: 'first', nextId: 'second'}));
    expectTabs(fixture.nativeElement, [true, false]);
  });

  describe('Custom config', () => {
    let config: NgbTabsetConfig;

    beforeEach(() => { TestBed.configureTestingModule({imports: [NgbTabsetModule.forRoot()]}); });

    beforeEach(inject([NgbTabsetConfig], (c: NgbTabsetConfig) => {
      config = c;
      config.type = 'pills';
    }));

    it('should initialize inputs with provided config', () => {
      const fixture = TestBed.createComponent(NgbTabset);
      fixture.detectChanges();

      let tabset = fixture.componentInstance;
      expect(tabset.type).toBe(config.type);
    });
  });

  describe('Custom config as provider', () => {
    let config = new NgbTabsetConfig();
    config.type = 'pills';

    beforeEach(() => {
      TestBed.configureTestingModule(
          {imports: [NgbTabsetModule.forRoot()], providers: [{provide: NgbTabsetConfig, useValue: config}]});
    });

    it('should initialize inputs with provided config as provider', () => {
      const fixture = TestBed.createComponent(NgbTabset);
      fixture.detectChanges();

      let tabset = fixture.componentInstance;
      expect(tabset.type).toBe(config.type);
    });
  });
});

@Component({selector: 'test-cmp', template: ''})
class TestComponent {
  activeTabId: string;
  changeCallback = (event: any) => {};
}
