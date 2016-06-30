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

import {NgbPagination} from './pagination';

function expectPages(nativeEl: HTMLElement, pagesDef: string[]): void {
  const pages = nativeEl.querySelectorAll('li');

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

function getLink(nativeEl: HTMLElement, idx: number): HTMLAnchorElement {
  return <HTMLAnchorElement>nativeEl.querySelectorAll('li')[idx].querySelector('a');
}

function normalizeText(txt: string): string {
  return txt.trim().replace(/\s+/g, ' ');
}

describe('ngb-pagination', () => {

  describe('business logic', () => {

    let pagination: NgbPagination;

    beforeEach(() => { pagination = new NgbPagination(); });

    it('should calculate and update no of pages (default page size)', () => {
      pagination.collectionSize = 100;
      pagination.ngOnChanges();
      expect(pagination.pages.length).toEqual(10);

      pagination.collectionSize = 200;
      pagination.ngOnChanges();
      expect(pagination.pages.length).toEqual(20);
    });

    it('should calculate and update no of pages (custom page size)', () => {
      pagination.collectionSize = 100;
      pagination.pageSize = 20;
      pagination.ngOnChanges();
      expect(pagination.pages.length).toEqual(5);

      pagination.collectionSize = 200;
      pagination.ngOnChanges();
      expect(pagination.pages.length).toEqual(10);

      pagination.pageSize = 10;
      pagination.ngOnChanges();
      expect(pagination.pages.length).toEqual(20);
    });

    it('should allow setting a page within a valid range (default page size)', () => {
      pagination.collectionSize = 100;
      pagination.page = 2;
      pagination.ngOnChanges();
      expect(pagination.page).toEqual(2);
    });

    it('should auto-correct page no if outside of valid range (default page size)', () => {
      pagination.collectionSize = 100;
      pagination.page = 100;
      pagination.ngOnChanges();
      expect(pagination.page).toEqual(10);

      pagination.page = -100;
      pagination.ngOnChanges();
      expect(pagination.page).toEqual(1);

      pagination.page = 5;
      pagination.collectionSize = 10;
      pagination.ngOnChanges();
      expect(pagination.page).toEqual(1);
    });

    it('should allow setting a page within a valid range (custom page size)', () => {
      pagination.collectionSize = 100;
      pagination.pageSize = 20;
      pagination.page = 2;
      pagination.ngOnChanges();
      expect(pagination.page).toEqual(2);
    });

  });

  describe('UI logic', () => {

    it('should render and respond to collectionSize change', async(inject([TestComponentBuilder], (tcb) => {
         const html = '<ngb-pagination [collectionSize]="collectionSize" page="1"></ngb-pagination>';

         tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.componentInstance.collectionSize = 30;
           fixture.detectChanges();
           expectPages(fixture.nativeElement, ['-« Previous', '+1', '2', '3', '» Next']);

           fixture.componentInstance.collectionSize = 40;
           fixture.detectChanges();
           expectPages(fixture.nativeElement, ['-« Previous', '+1', '2', '3', '4', '» Next']);
         });
       })));

    it('should render and respond to pageSize change', async(inject([TestComponentBuilder], (tcb) => {
         const html =
             '<ngb-pagination [collectionSize]="collectionSize" page="1" [pageSize]="pageSize"></ngb-pagination>';

         tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.componentInstance.collectionSize = 30;
           fixture.componentInstance.pageSize = 5;
           fixture.detectChanges();
           expectPages(fixture.nativeElement, ['-« Previous', '+1', '2', '3', '4', '5', '6', '» Next']);

           fixture.componentInstance.pageSize = 10;
           fixture.detectChanges();
           expectPages(fixture.nativeElement, ['-« Previous', '+1', '2', '3', '» Next']);
         });
       })));

    it('should render and respond to active page change', async(inject([TestComponentBuilder], (tcb) => {
         const html = '<ngb-pagination [collectionSize]="collectionSize" [page]="page"></ngb-pagination>';

         tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.componentInstance.collectionSize = 30;
           fixture.componentInstance.page = 2;
           fixture.detectChanges();
           expectPages(fixture.nativeElement, ['« Previous', '1', '+2', '3', '» Next']);

           fixture.componentInstance.page = 3;
           fixture.detectChanges();
           expectPages(fixture.nativeElement, ['« Previous', '1', '2', '+3', '-» Next']);
         });
       })));

    it('should update selected page model on page no click', async(inject([TestComponentBuilder], (tcb) => {
         const html = '<ngb-pagination [collectionSize]="collectionSize" [page]="page"></ngb-pagination>';

         tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.componentInstance.collectionSize = 30;
           fixture.componentInstance.page = 2;
           fixture.detectChanges();
           expectPages(fixture.nativeElement, ['« Previous', '1', '+2', '3', '» Next']);

           getLink(fixture.nativeElement, 0).click();
           fixture.detectChanges();
           expectPages(fixture.nativeElement, ['-« Previous', '+1', '2', '3', '» Next']);


           getLink(fixture.nativeElement, 3).click();
           fixture.detectChanges();
           expectPages(fixture.nativeElement, ['« Previous', '1', '2', '+3', '-» Next']);
         });
       })));

    it('should update selected page model on prev / next click', async(inject([TestComponentBuilder], (tcb) => {
         const html =
             '<ngb-pagination [collectionSize]="collectionSize" [page]="page" [directionLinks]="directionLinks"></ngb-pagination>';

         tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.componentInstance.collectionSize = 30;
           fixture.detectChanges();
           expectPages(fixture.nativeElement, ['+1', '2', '3']);

           fixture.componentInstance.directionLinks = true;
           fixture.detectChanges();
           expectPages(fixture.nativeElement, ['-« Previous', '+1', '2', '3', '» Next']);

           getLink(fixture.nativeElement, 0).click();
           fixture.detectChanges();
           expectPages(fixture.nativeElement, ['-« Previous', '+1', '2', '3', '» Next']);

           getLink(fixture.nativeElement, 4).click();
           fixture.detectChanges();
           expectPages(fixture.nativeElement, ['« Previous', '1', '+2', '3', '» Next']);

           getLink(fixture.nativeElement, 4).click();
           fixture.detectChanges();
           expectPages(fixture.nativeElement, ['« Previous', '1', '2', '+3', '-» Next']);

           getLink(fixture.nativeElement, 4).click();
           fixture.detectChanges();
           expectPages(fixture.nativeElement, ['« Previous', '1', '2', '+3', '-» Next']);
         });
       })));

    it('should update selected page model on first / last click', async(inject([TestComponentBuilder], (tcb) => {
         const html =
             '<ngb-pagination [collectionSize]="collectionSize" [page]="page" [boundaryLinks]="boundaryLinks"></ngb-pagination>';

         tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.componentInstance.collectionSize = 30;
           fixture.detectChanges();
           expectPages(fixture.nativeElement, ['-« Previous', '+1', '2', '3', '» Next']);

           fixture.componentInstance.boundaryLinks = true;
           fixture.detectChanges();
           expectPages(fixture.nativeElement, ['-«« First', '-« Previous', '+1', '2', '3', '» Next', '»» Last']);

           getLink(fixture.nativeElement, 0).click();
           fixture.detectChanges();
           expectPages(fixture.nativeElement, ['-«« First', '-« Previous', '+1', '2', '3', '» Next', '»» Last']);

           getLink(fixture.nativeElement, 6).click();
           fixture.detectChanges();
           expectPages(fixture.nativeElement, ['«« First', '« Previous', '1', '2', '+3', '-» Next', '-»» Last']);

           getLink(fixture.nativeElement, 3).click();
           fixture.detectChanges();
           expectPages(fixture.nativeElement, ['«« First', '« Previous', '1', '+2', '3', '» Next', '»» Last']);

           getLink(fixture.nativeElement, 0).click();
           fixture.detectChanges();
           expectPages(fixture.nativeElement, ['-«« First', '-« Previous', '+1', '2', '3', '» Next', '»» Last']);
         });
       })));
  });

});

@Component({selector: 'test-cmp', directives: [NgbPagination], template: ''})
class TestComponent {
  pageSize = 10;
  collectionSize = 100;
  page = 1;
  boundaryLinks = false;
  directionLinks = false;
}
