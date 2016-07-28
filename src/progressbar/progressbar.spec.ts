import {inject, async} from '@angular/core/testing';

import {TestComponentBuilder} from '@angular/compiler/testing';

import {Component} from '@angular/core';

import {NgbProgressbar} from './progressbar';

function getBarWidth(nativeEl): string {
  return nativeEl.querySelector('.progress-bar').style.width;
}

function getProgressbar(nativeEl: Element): Element {
  return nativeEl.querySelector('progress');
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
    it('accepts a value and respond to value changes', async(inject([TestComponentBuilder], (tcb) => {
         const html = '<ngb-progressbar [value]="value"></ngb-progressbar>';

         tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.detectChanges();

           expect(getBarWidth(fixture.nativeElement)).toBe('10%');

           fixture.componentInstance.value = 30;
           fixture.detectChanges();
           expect(getBarWidth(fixture.nativeElement)).toBe('30%');
         });
       })));

    it('accepts a max value and respond to max changes', async(inject([TestComponentBuilder], (tcb) => {
         const html = '<ngb-progressbar [value]="value" [max]="max"></ngb-progressbar>';

         tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.detectChanges();

           expect(getBarWidth(fixture.nativeElement)).toBe('20%');

           fixture.componentInstance.max = 200;
           fixture.detectChanges();
           expect(getBarWidth(fixture.nativeElement)).toBe('5%');
         });
       })));

    it('accepts a value and max value above default values', async(inject([TestComponentBuilder], (tcb) => {
         const html = '<ngb-progressbar [value]="150" [max]="150"></ngb-progressbar>';

         tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.detectChanges();
           expect(getBarWidth(fixture.nativeElement)).toBe('100%');
         });
       })));

    it('accepts a custom type', async(inject([TestComponentBuilder], (tcb) => {
         const html = '<ngb-progressbar [value]="value" [type]="type"></ngb-progressbar>';

         tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.detectChanges();

           expect(getProgressbar(fixture.nativeElement)).toHaveCssClass('progress-warning');

           fixture.componentInstance.type = 'info';
           fixture.detectChanges();
           expect(getProgressbar(fixture.nativeElement)).toHaveCssClass('progress-info');
         });
       })));

    it('accepts animated as boolean attr', async(inject([TestComponentBuilder], (tcb) => {
         const html = '<ngb-progressbar [value]="value" animated></ngb-progressbar>';

         tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.detectChanges();

           expect(getProgressbar(fixture.nativeElement)).toHaveCssClass('progress-animated');
         });
       })));

    it('accepts animated as normal attr', async(inject([TestComponentBuilder], (tcb) => {
         const html = '<ngb-progressbar [value]="value" [animated]="animated"></ngb-progressbar>';

         tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.detectChanges();

           expect(getProgressbar(fixture.nativeElement)).toHaveCssClass('progress-animated');

           fixture.componentInstance.animated = false;
           fixture.detectChanges();
           expect(getProgressbar(fixture.nativeElement)).not.toHaveCssClass('progress-animated');
         });
       })));

    it('accepts striped as boolean attr', async(inject([TestComponentBuilder], (tcb) => {
         const html = '<ngb-progressbar [value]="value" striped></ngb-progressbar>';

         tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.detectChanges();

           expect(getProgressbar(fixture.nativeElement)).toHaveCssClass('progress-striped');
         });
       })));

    it('accepts striped as normal attr', async(inject([TestComponentBuilder], (tcb) => {
         const html = '<ngb-progressbar [value]="value" [striped]="striped"></ngb-progressbar>';

         tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.detectChanges();

           expect(getProgressbar(fixture.nativeElement)).toHaveCssClass('progress-striped');

           fixture.componentInstance.striped = false;
           fixture.detectChanges();
           expect(getProgressbar(fixture.nativeElement)).not.toHaveCssClass('progress-striped');
         });
       })));

    it('should not add "false" CSS class', async(inject([TestComponentBuilder], (tcb) => {
         const html = '<ngb-progressbar [value]="value" [striped]="striped"></ngb-progressbar>';

         tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.detectChanges();

           expect(getProgressbar(fixture.nativeElement)).toHaveCssClass('progress-striped');
           expect(getProgressbar(fixture.nativeElement)).not.toHaveCssClass('false');
         });
       })));
  });
});

@Component({selector: 'test-cmp', directives: [NgbProgressbar], template: ''})
class TestComponent {
  value = 10;
  max = 50;
  animated = true;
  striped = true;
  type = 'warning';
}
