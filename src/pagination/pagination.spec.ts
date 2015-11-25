import {
  iit,
  it,
  ddescribe,
  describe,
  expect,
  inject,
  injectAsync,
  TestComponentBuilder,
  beforeEach,
  beforeEachProviders
} from 'angular2/testing';

import {Component} from 'angular2/angular2';

import {NgbPagination} from './pagination';

function getLink(nativeEl, idx) {
  return nativeEl.querySelectorAll('li')[idx].querySelector('a');
}

function normalizeText(txt) {
  return txt.trim().replace(/\s+/g, ' ');
}

function expectPages(nativeEl, pagesDef: string[]) {
  var pages = nativeEl.querySelectorAll('li');

  expect(pages.length).toEqual(pagesDef.length);

  for (let i = 0; i < pagesDef.length; i++) {
    let pageDef = pagesDef[i];
    let classIndicator = pageDef.charAt(0);

    if (classIndicator === '+') {
      expect(pages[i]).toHaveCssClass('active');
      expect(pages[i]).not.toHaveCssClass('disabled');
      expect(normalizeText(pages[i].textContent)).toEqual(pageDef.substr(1));
    } else if (classIndicator === '-') {
      expect(pages[i]).not.toHaveCssClass('active');
      expect(pages[i]).toHaveCssClass('disabled');
      expect(normalizeText(pages[i].textContent)).toEqual(pageDef.substr(1));
    } else {
      expect(pages[i]).not.toHaveCssClass('active');
      expect(pages[i]).not.toHaveCssClass('disabled');
      expect(normalizeText(pages[i].textContent)).toEqual(pageDef);
    }
  }
}

describe('ngb-pagination', () => {

  describe('business logic', () => {

    var paginationCmpt: NgbPagination;

    beforeEach(() => { paginationCmpt = new NgbPagination(); });

    it('should calculate and update no of pages (default page size)', () => {
      paginationCmpt.collectionSize = 100;
      paginationCmpt.onChanges();
      expect(paginationCmpt.pages.length).toEqual(10);

      paginationCmpt.collectionSize = 200;
      paginationCmpt.onChanges();
      expect(paginationCmpt.pages.length).toEqual(20);
    });

    it('should calculate and update no of pages (custom page size)', () => {
      paginationCmpt.collectionSize = 100;
      paginationCmpt.pageSize = 20;
      paginationCmpt.onChanges();
      expect(paginationCmpt.pages.length).toEqual(5);

      paginationCmpt.collectionSize = 200;
      paginationCmpt.onChanges();
      expect(paginationCmpt.pages.length).toEqual(10);

      paginationCmpt.pageSize = 10;
      paginationCmpt.onChanges();
      expect(paginationCmpt.pages.length).toEqual(20);
    });

    it('should allow setting a page within a valid range (default page size)', () => {
      paginationCmpt.collectionSize = 100;
      paginationCmpt.page = 2;
      paginationCmpt.onChanges();
      expect(paginationCmpt.page).toEqual(2);
    });

    it('should auto-correct page no if outside of valid range (default page size)', () => {
      paginationCmpt.collectionSize = 100;
      paginationCmpt.page = 100;
      paginationCmpt.onChanges();
      expect(paginationCmpt.page).toEqual(10);

      paginationCmpt.page = -100;
      paginationCmpt.onChanges();
      expect(paginationCmpt.page).toEqual(1);

      paginationCmpt.page = 5;
      paginationCmpt.collectionSize = 10;
      paginationCmpt.onChanges();
      expect(paginationCmpt.page).toEqual(1);
    });

    it('should allow setting a page within a valid range (custom page size)', () => {
      paginationCmpt.collectionSize = 100;
      paginationCmpt.pageSize = 20;
      paginationCmpt.page = 2;
      paginationCmpt.onChanges();
      expect(paginationCmpt.page).toEqual(2);
    });

  });

  describe('UI logic', () => {

    it('should render and respond to collectionSize change', injectAsync([TestComponentBuilder], (tcb) => {
         const html = '<ngb-pagination [collection-size]="collectionSize" page="1"></ngb-pagination>';

         return tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.debugElement.componentInstance.collectionSize = 30;
           fixture.detectChanges();
           expectPages(fixture.debugElement.nativeElement, ['-« Previous', '+1', '2', '3', '» Next']);

           fixture.debugElement.componentInstance.collectionSize = 40;
           fixture.detectChanges();
           expectPages(fixture.debugElement.nativeElement, ['-« Previous', '+1', '2', '3', '4', '» Next']);
         });
       }));

    it('should render and respond to pageSize change', injectAsync([TestComponentBuilder], (tcb) => {
         const html =
             '<ngb-pagination [collection-size]="collectionSize" page="1" [page-size]="pageSize"></ngb-pagination>';

         return tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.debugElement.componentInstance.collectionSize = 30;
           fixture.debugElement.componentInstance.pageSize = 5;
           fixture.detectChanges();
           expectPages(fixture.debugElement.nativeElement, ['-« Previous', '+1', '2', '3', '4', '5', '6', '» Next']);

           fixture.debugElement.componentInstance.pageSize = 10;
           fixture.detectChanges();
           expectPages(fixture.debugElement.nativeElement, ['-« Previous', '+1', '2', '3', '» Next']);
         });
       }));

    it('should render and respond to active page change', injectAsync([TestComponentBuilder], (tcb) => {
         const html = '<ngb-pagination [collection-size]="collectionSize" [page]="page"></ngb-pagination>';

         return tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.debugElement.componentInstance.collectionSize = 30;
           fixture.debugElement.componentInstance.page = 2;
           fixture.detectChanges();
           expectPages(fixture.debugElement.nativeElement, ['« Previous', '1', '+2', '3', '» Next']);

           fixture.debugElement.componentInstance.page = 3;
           fixture.detectChanges();
           expectPages(fixture.debugElement.nativeElement, ['« Previous', '1', '2', '+3', '-» Next']);
         });
       }));

    it('should update selected page model on page no click', injectAsync([TestComponentBuilder], (tcb) => {
         const html = '<ngb-pagination [collection-size]="collectionSize" [page]="page"></ngb-pagination>';

         return tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.debugElement.componentInstance.collectionSize = 30;
           fixture.debugElement.componentInstance.page = 2;
           fixture.detectChanges();
           expectPages(fixture.debugElement.nativeElement, ['« Previous', '1', '+2', '3', '» Next']);

           getLink(fixture.debugElement.nativeElement, 1).click();
           fixture.detectChanges();
           expectPages(fixture.debugElement.nativeElement, ['-« Previous', '+1', '2', '3', '» Next']);

           getLink(fixture.debugElement.nativeElement, 3).click();
           fixture.detectChanges();
           expectPages(fixture.debugElement.nativeElement, ['« Previous', '1', '2', '+3', '-» Next']);
         });
       }));

    it('should update selected page model on prev / next click', injectAsync([TestComponentBuilder], (tcb) => {
         const html = '<ngb-pagination [collection-size]="collectionSize" [page]="page"></ngb-pagination>';

         return tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.debugElement.componentInstance.collectionSize = 30;
           fixture.detectChanges();
           expectPages(fixture.debugElement.nativeElement, ['-« Previous', '+1', '2', '3', '» Next']);

           getLink(fixture.debugElement.nativeElement, 0).click();
           fixture.detectChanges();
           expectPages(fixture.debugElement.nativeElement, ['-« Previous', '+1', '2', '3', '» Next']);

           getLink(fixture.debugElement.nativeElement, 4).click();
           fixture.detectChanges();
           expectPages(fixture.debugElement.nativeElement, ['« Previous', '1', '+2', '3', '» Next']);

           getLink(fixture.debugElement.nativeElement, 4).click();
           fixture.detectChanges();
           expectPages(fixture.debugElement.nativeElement, ['« Previous', '1', '2', '+3', '-» Next']);

           getLink(fixture.debugElement.nativeElement, 4).click();
           fixture.detectChanges();
           expectPages(fixture.debugElement.nativeElement, ['« Previous', '1', '2', '+3', '-» Next']);
         });
       }));
  });

});

@Component({selector: 'test-cmp', directives: [NgbPagination], template: ''})
class TestComponent {
  pageSize = 10;
  collectionSize = 100;
  page = 1;
}
