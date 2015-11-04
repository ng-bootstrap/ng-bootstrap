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
      expect(progressCmp.calculatePercentage()).toBe(50);

      progressCmp.value = 25;
      expect(progressCmp.calculatePercentage()).toBe(25);
    });

    it('should calculate the percentage (custom max size)', () => {
      progressCmp.max = 150;

      progressCmp.value = 75;
      expect(progressCmp.calculatePercentage()).toBe(50);

      progressCmp.value = 30;
      expect(progressCmp.calculatePercentage()).toBe(20);
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
