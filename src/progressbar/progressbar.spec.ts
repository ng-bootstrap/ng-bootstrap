import {TestBed, ComponentFixture, inject} from '@angular/core/testing';
import {createGenericTestComponent} from '../test/common';

import {Component} from '@angular/core';

import {NgbProgressbarModule} from './progressbar.module';
import {NgbProgressbar} from './progressbar';
import {NgbProgressbarConfig} from './progressbar-config';

const createTestComponent = (html: string) =>
    createGenericTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;

function getProgressBarWidth(barEl): string {
  return barEl.style.width;
}

function getProgressBarValue(barEl): number {
  return parseInt(barEl.getAttribute('aria-valuenow'), 10);
}

function getBarWidth(nativeEl): string {
  return getProgressBarWidth(getProgressbar(nativeEl));
}

function getBarHeight(nativeEl): string {
  return nativeEl.querySelector('.progress').style.height;
}

function getBarValue(nativeEl): number {
  return getProgressBarValue(getProgressbar(nativeEl));
}

function getProgressbar(nativeEl: Element): HTMLElement {
  return nativeEl.querySelector('.progress-bar') as HTMLElement;
}

function getStackedProgressBars(nativeEl: Element): NodeListOf<Element> {
  return nativeEl.querySelectorAll('.progress-bar');
}

describe('ngb-progressbar', () => {
  describe('business logic', () => {
    let progressCmp: NgbProgressbar;

    beforeEach(() => { progressCmp = new NgbProgressbar(new NgbProgressbarConfig()); });

    it('should initialize inputs with default values', () => {
      const defaultConfig = new NgbProgressbarConfig();
      expect(progressCmp.max).toBe(defaultConfig.max);
      expect(progressCmp.animated).toBe(defaultConfig.animated);
      expect(progressCmp.striped).toBe(defaultConfig.striped);
      expect(progressCmp.type).toBe(defaultConfig.type);
    });

    it('should calculate the percentage (default max size)', () => {
      progressCmp.value = 50;
      expect(progressCmp.getPercentValue()).toBe(50);

      progressCmp.value = 25;
      expect(progressCmp.getPercentValue()).toBe(25);
    });

    it('should calculate the percentage (custom max size)', () => {
      progressCmp.max = 150;

      progressCmp.value = 75;
      expect(progressCmp.getPercentValue()).toBe(50);

      progressCmp.value = 30;
      expect(progressCmp.getPercentValue()).toBe(20);
    });

    it('should set the value to 0 for negative numbers', () => {
      progressCmp.value = -20;
      expect(progressCmp.getValue()).toBe(0);
    });

    it('should set the value to max if it is higher than max (default max size)', () => {
      progressCmp.value = 120;
      expect(progressCmp.getValue()).toBe(100);
    });

    it('should set the value to max if it is higher than max (custom max size)', () => {
      progressCmp.max = 150;
      progressCmp.value = 170;
      expect(progressCmp.getValue()).toBe(150);
    });

    it('should update the value if max updates to a smaller value', () => {
      progressCmp.value = 80;
      progressCmp.max = 70;
      expect(progressCmp.getValue()).toBe(70);
    });

    it('should not update the value if max updates to a larger value', () => {
      progressCmp.value = 120;
      progressCmp.max = 150;
      expect(progressCmp.getValue()).toBe(120);
    });
  });

  describe('UI logic', () => {

    beforeEach(() => {
      TestBed.configureTestingModule({declarations: [TestComponent], imports: [NgbProgressbarModule.forRoot()]});
    });

    it('accepts a value and respond to value changes', () => {
      const html = '<ngb-progressbar [value]="value"></ngb-progressbar>';
      const fixture = createTestComponent(html);

      expect(getBarWidth(fixture.nativeElement)).toBe('10%');

      // this might fail in IE11 if attribute binding order is not respected for the <progress> element:
      // <progress [value]="" [max]=""> will fail with value = 1
      // <progress [max]="" [value]=""> will work with value = 10
      expect(getBarValue(fixture.nativeElement)).toBe(10);

      fixture.componentInstance.value = 30;
      fixture.detectChanges();
      expect(getBarWidth(fixture.nativeElement)).toBe('30%');
      expect(getBarValue(fixture.nativeElement)).toBe(30);
    });

    it('accepts a max value and respond to max changes', () => {
      const html = '<ngb-progressbar [value]="value" [max]="max"></ngb-progressbar>';
      const fixture = createTestComponent(html);

      expect(getBarWidth(fixture.nativeElement)).toBe('20%');

      fixture.componentInstance.max = 200;
      fixture.detectChanges();
      expect(getBarWidth(fixture.nativeElement)).toBe('5%');
    });


    it('accepts a value and max value above default values', () => {
      const html = '<ngb-progressbar [value]="150" [max]="150"></ngb-progressbar>';
      const fixture = createTestComponent(html);

      expect(getBarWidth(fixture.nativeElement)).toBe('100%');
    });


    it('accepts a custom type', () => {
      const html = '<ngb-progressbar [value]="value" [type]="type"></ngb-progressbar>';
      const fixture = createTestComponent(html);

      expect(getProgressbar(fixture.nativeElement)).toHaveCssClass('bg-warning');

      fixture.componentInstance.type = 'info';
      fixture.detectChanges();
      expect(getProgressbar(fixture.nativeElement)).toHaveCssClass('bg-info');
    });

    it('accepts animated as normal attr', () => {
      const html = '<ngb-progressbar [value]="value" [animated]="animated"></ngb-progressbar>';
      const fixture = createTestComponent(html);

      expect(getProgressbar(fixture.nativeElement)).toHaveCssClass('progress-bar-animated');

      fixture.componentInstance.animated = false;
      fixture.detectChanges();
      expect(getProgressbar(fixture.nativeElement)).not.toHaveCssClass('progress-bar-animated');
    });


    it('accepts striped as normal attr', () => {
      const html = '<ngb-progressbar [value]="value" [striped]="striped"></ngb-progressbar>';
      const fixture = createTestComponent(html);

      expect(getProgressbar(fixture.nativeElement)).toHaveCssClass('progress-bar-striped');

      fixture.componentInstance.striped = false;
      fixture.detectChanges();
      expect(getProgressbar(fixture.nativeElement)).not.toHaveCssClass('progress-bar-striped');
    });


    it('should not add "false" CSS class', () => {
      const html = '<ngb-progressbar [value]="value" [striped]="striped"></ngb-progressbar>';
      const fixture = createTestComponent(html);

      expect(getProgressbar(fixture.nativeElement)).toHaveCssClass('progress-bar-striped');
      expect(getProgressbar(fixture.nativeElement)).not.toHaveCssClass('false');
    });

    it('should stay striped when the type changes', () => {
      const html = '<ngb-progressbar [value]="value" [type]="type" [striped]="true"></ngb-progressbar>';
      const fixture = createTestComponent(html);

      expect(getProgressbar(fixture.nativeElement)).toHaveCssClass('bg-warning');
      expect(getProgressbar(fixture.nativeElement)).toHaveCssClass('progress-bar-striped');

      fixture.componentInstance.type = 'success';
      fixture.detectChanges();
      expect(getProgressbar(fixture.nativeElement)).toHaveCssClass('bg-success');
      expect(getProgressbar(fixture.nativeElement)).toHaveCssClass('progress-bar-striped');
    });

    it('sets the min and max values as aria attributes', () => {
      const html = '<ngb-progressbar [value]="130" [max]="150"></ngb-progressbar>';
      const fixture = createTestComponent(html);

      expect(getProgressbar(fixture.nativeElement).getAttribute('aria-valuemin')).toBe('0');
      expect(getProgressbar(fixture.nativeElement).getAttribute('aria-valuemax')).toBe('150');
    });

    it('should display the progress-bar label', () => {
      const html = '<ngb-progressbar [value]="150" [max]="150">label goes here</ngb-progressbar>';
      const fixture = createTestComponent(html);

      expect(fixture.nativeElement.textContent).toContain('label goes here');
    });

    it('should display the current percentage value', () => {
      const html = '<ngb-progressbar [showValue]="true" [value]="150" [max]="150"></ngb-progressbar>';
      const fixture = createTestComponent(html);

      expect(fixture.nativeElement.textContent).toContain('100%');
    });

    it('should accepts height values', () => {
      const html = '<ngb-progressbar [value]="150" height="10px"></ngb-progressbar>';
      const fixture = createTestComponent(html);

      expect(getBarHeight(fixture.nativeElement)).toBe('10px');
    });
  });

  describe('Custom config', () => {
    let config: NgbProgressbarConfig;

    beforeEach(() => { TestBed.configureTestingModule({imports: [NgbProgressbarModule.forRoot()]}); });

    beforeEach(inject([NgbProgressbarConfig], (c: NgbProgressbarConfig) => {
      config = c;
      config.max = 1000;
      config.striped = true;
      config.animated = true;
      config.type = 'success';
    }));

    it('should initialize inputs with provided config', () => {
      const fixture = TestBed.createComponent(NgbProgressbar);
      fixture.detectChanges();

      let progressbar = fixture.componentInstance;
      expect(progressbar.max).toBe(config.max);
      expect(progressbar.striped).toBe(config.striped);
      expect(progressbar.animated).toBe(config.animated);
      expect(progressbar.type).toBe(config.type);
    });
  });

  describe('Custom config as provider', () => {
    let config = new NgbProgressbarConfig();
    config.max = 1000;
    config.striped = true;
    config.animated = true;
    config.type = 'success';

    beforeEach(() => {
      TestBed.configureTestingModule(
          {imports: [NgbProgressbarModule.forRoot()], providers: [{provide: NgbProgressbarConfig, useValue: config}]});
    });

    it('should initialize inputs with provided config as provider', () => {
      const fixture = TestBed.createComponent(NgbProgressbar);
      fixture.detectChanges();

      let progressbar = fixture.componentInstance;
      expect(progressbar.max).toBe(config.max);
      expect(progressbar.striped).toBe(config.striped);
      expect(progressbar.animated).toBe(config.animated);
      expect(progressbar.type).toBe(config.type);
    });
  });
});

describe('ngb-progressbar-stack', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [TestComponent], imports: [NgbProgressbarModule.forRoot()]});
  });

  it('should render bars and display correct value for each bar', () => {
    const fixture = createTestComponent(`
      <ngb-progressbar-stack>
        <ngb-progressbar [showValue]="true" [value]="100" [max]="200" type="warning" 
                         [striped]="true" [animated]="false"></ngb-progressbar>
        <ngb-progressbar [showValue]="true" [value]="55" type="success" [striped]="false" [animated]="true"></ngb-progressbar>
      </ngb-progressbar-stack>
    `);

    const bars = getStackedProgressBars(fixture.nativeElement);

    expect(bars.length).toBe(2);
    expect(getProgressBarWidth(bars[0])).toBe('50%');
    expect(getProgressBarValue(bars[0])).toBe(100);
    expect(bars[0]).toHaveCssClass('bg-warning');
    expect(bars[0]).toHaveCssClass('progress-bar-striped');
    expect(bars[0]).not.toHaveCssClass('progress-bar-animated');

    expect(getProgressBarWidth(bars[1])).toBe('55%');
    expect(getProgressBarValue(bars[1])).toBe(55);
    expect(bars[1]).toHaveCssClass('bg-success');
    expect(bars[1]).not.toHaveCssClass('progress-bar-striped');
    expect(bars[1]).toHaveCssClass('progress-bar-animated');
  });

  it('should set height value in stack level and ignore height in progressbar', () => {
    const fixture = createTestComponent(`
      <ngb-progressbar-stack height="10px">
        <ngb-progressbar [value]="10" height="1px"></ngb-progressbar>
        <ngb-progressbar [value]="20" height="2px"></ngb-progressbar>
        <ngb-progressbar [value]="30" height="3px"></ngb-progressbar>        
      </ngb-progressbar-stack>
    `);

    expect(getBarHeight(fixture.nativeElement)).toBe('10px');
  });

  it('should conditionally show and hide stacked bars', () => {
    const fixture = createTestComponent(`
      <ngb-progressbar-stack>
        <ngb-progressbar [value]="10" *ngIf="showStackedBar"></ngb-progressbar>
        <ngb-progressbar [value]="20"></ngb-progressbar>
        <ngb-progressbar [value]="30"></ngb-progressbar>        
      </ngb-progressbar-stack>
    `);

    let bars = getStackedProgressBars(fixture.nativeElement);
    expect(bars.length).toBe(3);
    expect(getProgressBarValue(bars[0])).toBe(10);

    fixture.componentInstance.showStackedBar = false;
    fixture.detectChanges();
    bars = getStackedProgressBars(fixture.nativeElement);
    expect(bars.length).toBe(2);
    expect(getProgressBarValue(bars[0])).toBe(20);

    fixture.componentInstance.showStackedBar = true;
    fixture.detectChanges();
    bars = getStackedProgressBars(fixture.nativeElement);
    expect(bars.length).toBe(3);
    expect(getProgressBarValue(bars[0])).toBe(10);
  });
});

@Component({selector: 'test-cmp', template: ''})
class TestComponent {
  value = 10;
  max = 50;
  animated = true;
  striped = true;
  type = 'warning';

  showStackedBar = true;
}
