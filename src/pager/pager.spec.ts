import {inject, async, addProviders} from '@angular/core/testing';

import {TestComponentBuilder} from '@angular/compiler/testing';

import {Component} from '@angular/core';

import {NgbPager} from './pager';

function expectPager(nativeEl: HTMLElement, pagerStates: boolean[]): void {
  const pagerCtrls = nativeEl.querySelectorAll('li');

  if (pagerStates[0]) {
    expect(pagerCtrls[0]).not.toHaveCssClass('disabled');
  } else {
    expect(pagerCtrls[0]).toHaveCssClass('disabled');
  }

  if (pagerStates[1]) {
    expect(pagerCtrls[1]).not.toHaveCssClass('disabled');
  } else {
    expect(pagerCtrls[1]).toHaveCssClass('disabled');
  }
}

function getLink(nativeEl: HTMLElement, idx: number): HTMLAnchorElement {
  return <HTMLAnchorElement>nativeEl.querySelectorAll('li')[idx].querySelector('a');
}

describe('ngb-pagination', () => {
  describe('business logic', () => {

    let pager: NgbPager;

    beforeEach(() => { pager = new NgbPager(); });

    it('should properly set prev and next flags', () => {
      pager.noOfPages = 10;

      pager.page = 0;
      pager.ngOnChanges();
      expect(pager.hasPrev()).toBeFalsy();
      expect(pager.hasNext()).toBeTruthy();

      pager.page = 5;
      pager.ngOnChanges();
      expect(pager.hasPrev()).toBeTruthy();
      expect(pager.hasNext()).toBeTruthy();

      pager.page = 10;
      pager.ngOnChanges();
      expect(pager.hasPrev()).toBeTruthy();
      expect(pager.hasNext()).toBeFalsy();
    });

    it('should allow navigation to prev and next pages', () => {
      pager.noOfPages = 10;

      pager.page = 1;
      pager.ngOnChanges();
      expect(pager.hasPrev()).toBeTruthy();

      pager.prev();
      expect(pager.hasPrev()).toBeFalsy();

      pager.next();
      expect(pager.hasPrev()).toBeTruthy();
    });

  });

  describe('UI logic', () => {

    it('should render and respond to noOfPages change', async(inject([TestComponentBuilder], (tcb) => {
         const html = '<ngb-pager [noOfPages]="noOfPages" page="5"></ngb-pager>';

         tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.detectChanges();
           expectPager(fixture.nativeElement, [true, true]);

           fixture.componentInstance.noOfPages = 5;
           fixture.detectChanges();
           expectPager(fixture.nativeElement, [true, false]);

           fixture.componentInstance.noOfPages = 0;
           fixture.detectChanges();
           expectPager(fixture.nativeElement, [false, false]);
         });
       })));

    it('should render and respond to page change', async(inject([TestComponentBuilder], (tcb) => {
         const html = '<ngb-pager [noOfPages]="noOfPages" [page]="page"></ngb-pager>';

         tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.detectChanges();
           expectPager(fixture.nativeElement, [true, true]);

           fixture.componentInstance.page = 9;
           fixture.detectChanges();
           expectPager(fixture.nativeElement, [true, false]);

           fixture.componentInstance.page = 0;
           fixture.detectChanges();
           expectPager(fixture.nativeElement, [false, true]);
         });
       })));

    it('should update selected page model on prev / next click', async(inject([TestComponentBuilder], (tcb) => {
         const html = '<ngb-pager [noOfPages]="noOfPages" [page]="page"></ngb-pager>';

         tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.detectChanges();
           expectPager(fixture.nativeElement, [true, true]);

           getLink(fixture.nativeElement, 0).click();
           fixture.detectChanges();
           expectPager(fixture.nativeElement, [false, true]);

           getLink(fixture.nativeElement, 1).click();
           fixture.detectChanges();
           expectPager(fixture.nativeElement, [true, true]);
         });
       })));

    it('should have pager-prev and pager-next classes set', async(inject([TestComponentBuilder], (tcb) => {
         const html = '<ngb-pager [noOfPages]="noOfPages" page="5" [alignLinks]="shouldAlign"></ngb-pager>';

         tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.detectChanges();
           expect(fixture.nativeElement.querySelectorAll('li')[0]).toHaveCssClass('pager-prev');
           expect(fixture.nativeElement.querySelectorAll('li')[1]).toHaveCssClass('pager-next');

           const tc = fixture.componentInstance;
           tc.shouldAlign = false;
           fixture.detectChanges();
           expect(fixture.nativeElement.querySelectorAll('li')[0]).not.toHaveCssClass('pager-prev');
           expect(fixture.nativeElement.querySelectorAll('li')[1]).not.toHaveCssClass('pager-next');

         });
       })));
  });

});

@Component({selector: 'test-cmp', directives: [NgbPager], template: ''})
class TestComponent {
  noOfPages = 10;
  page = 1;
  shouldAlign = true;
}
