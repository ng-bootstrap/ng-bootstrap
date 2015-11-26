import {iit, it, ddescribe, describe, expect, injectAsync, TestComponentBuilder} from 'angular2/testing';

import {Component} from 'angular2/angular2';

import {NgbProgressbar} from "./progressbar";

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
    it('accepts a value and respond to value changes', injectAsync([TestComponentBuilder], (tcb) => {
         const html = '<ngb-progressbar [value]="value"></ngb-progressbar>';

         return tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.detectChanges();

           expect(getBarWidth(fixture.debugElement.nativeElement)).toBe('10%');

           fixture.debugElement.componentInstance.value = 30;
           fixture.detectChanges();
           expect(getBarWidth(fixture.debugElement.nativeElement)).toBe('30%');
         });
       }));

    it('accepts a max value and respond to max changes', injectAsync([TestComponentBuilder], (tcb) => {
         const html = '<ngb-progressbar [value]="value" [max]="max"></ngb-progressbar>';

         return tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.detectChanges();

           expect(getBarWidth(fixture.debugElement.nativeElement)).toBe('20%');

           fixture.debugElement.componentInstance.max = 200;
           fixture.detectChanges();
           expect(getBarWidth(fixture.debugElement.nativeElement)).toBe('5%');
         });
       }));

    it('accepts a value and max value above default values', injectAsync([TestComponentBuilder], (tcb) => {
         const html = '<ngb-progressbar [value]="150" [max]="150"></ngb-progressbar>';

         return tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.detectChanges();
           expect(getBarWidth(fixture.debugElement.nativeElement)).toBe('100%');
         });
       }));

    it('accepts a custom type', injectAsync([TestComponentBuilder], (tcb) => {
         const html = '<ngb-progressbar [value]="value" [type]="type"></ngb-progressbar>';

         return tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.detectChanges();

           expect(getProgressbar(fixture.debugElement.nativeElement)).toHaveCssClass('progress-warning');

           fixture.debugElement.componentInstance.type = 'info';
           fixture.detectChanges();
           expect(getProgressbar(fixture.debugElement.nativeElement)).toHaveCssClass('progress-info');
         });
       }));

    it('accepts striped as boolean attr', injectAsync([TestComponentBuilder], (tcb) => {
         const html = '<ngb-progressbar [value]="value" striped></ngb-progressbar>';

         return tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.detectChanges();

           expect(getProgressbar(fixture.debugElement.nativeElement)).toHaveCssClass('progress-striped');
         });
       }));

    it('accepts striped as normal attr', injectAsync([TestComponentBuilder], (tcb) => {
         const html = '<ngb-progressbar [value]="value" [striped]="striped"></ngb-progressbar>';

         return tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.detectChanges();

           expect(getProgressbar(fixture.debugElement.nativeElement)).toHaveCssClass('progress-striped');

           fixture.debugElement.componentInstance.striped = false;
           fixture.detectChanges();
           expect(getProgressbar(fixture.debugElement.nativeElement)).not.toHaveCssClass('progress-striped');
         });
       }));
  });
});

@Component({selector: 'test-cmp', directives: [NgbProgressbar], template: ''})
class TestComponent {
  value = 10;
  max = 50;
  striped = true;
  type = 'warning';
}
