import {TestBed, ComponentFixture} from '@angular/core/testing';

import {Component} from '@angular/core';

import {NgbProgressbarModule} from './index';
import {NgbProgressbar} from './progressbar';

function getBarWidth(nativeEl): string {
  return nativeEl.querySelector('.progress-bar').style.width;
}

function getProgressbar(nativeEl: Element): Element {
  return nativeEl.querySelector('progress');
}

function createTestComponent(html: string): ComponentFixture<TestComponent> {
  TestBed.overrideComponent(TestComponent, {set: {template: html}});
  const fixture = TestBed.createComponent(TestComponent);
  fixture.detectChanges();
  return fixture;
}

describe('ng-progressbar', () => {
  describe('business logic', () => {
    let progressCmp: NgbProgressbar;

    beforeEach(() => { progressCmp = new NgbProgressbar(); });

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

    beforeEach(
        () => { TestBed.configureTestingModule({declarations: [TestComponent], imports: [NgbProgressbarModule]}); });

    it('accepts a value and respond to value changes', () => {
      const html = '<ngb-progressbar [value]="value"></ngb-progressbar>';
      const fixture = createTestComponent(html);

      expect(getBarWidth(fixture.nativeElement)).toBe('10%');

      // this might fail in IE11 if attribute binding order is not respected for the <progress> element:
      // <progress [value]="" [max]=""> will fail with value = 1
      // <progress [max]="" [value]=""> will work with value = 10
      expect(getProgressbar(fixture.nativeElement).getAttribute('value')).toBe('10');

      fixture.componentInstance.value = 30;
      fixture.detectChanges();
      expect(getBarWidth(fixture.nativeElement)).toBe('30%');
      expect(getProgressbar(fixture.nativeElement).getAttribute('value')).toBe('30');
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

      expect(getProgressbar(fixture.nativeElement)).toHaveCssClass('progress-warning');

      fixture.componentInstance.type = 'info';
      fixture.detectChanges();
      expect(getProgressbar(fixture.nativeElement)).toHaveCssClass('progress-info');
    });

    it('accepts animated as normal attr', () => {
      const html = '<ngb-progressbar [value]="value" [animated]="animated"></ngb-progressbar>';
      const fixture = createTestComponent(html);

      expect(getProgressbar(fixture.nativeElement)).toHaveCssClass('progress-animated');

      fixture.componentInstance.animated = false;
      fixture.detectChanges();
      expect(getProgressbar(fixture.nativeElement)).not.toHaveCssClass('progress-animated');
    });


    it('accepts striped as normal attr', () => {
      const html = '<ngb-progressbar [value]="value" [striped]="striped"></ngb-progressbar>';
      const fixture = createTestComponent(html);

      expect(getProgressbar(fixture.nativeElement)).toHaveCssClass('progress-striped');

      fixture.componentInstance.striped = false;
      fixture.detectChanges();
      expect(getProgressbar(fixture.nativeElement)).not.toHaveCssClass('progress-striped');
    });


    it('should not add "false" CSS class', () => {
      const html = '<ngb-progressbar [value]="value" [striped]="striped"></ngb-progressbar>';
      const fixture = createTestComponent(html);

      expect(getProgressbar(fixture.nativeElement)).toHaveCssClass('progress-striped');
      expect(getProgressbar(fixture.nativeElement)).not.toHaveCssClass('false');
    });
  });
});

@Component({selector: 'test-cmp', template: ''})
class TestComponent {
  value = 10;
  max = 50;
  animated = true;
  striped = true;
  type = 'warning';
}
