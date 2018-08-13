import {TestBed, ComponentFixture, inject, fakeAsync, tick} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {Location} from '@angular/common';
import {Router} from '@angular/router';
import {createGenericTestComponent} from '../../test/common';

import {Component} from '@angular/core';

import {NgbTabsetModule} from '../tabset.module';
import {NgbTabsetRoutingModule} from '.';

const createTestComponent = (html: string) =>
    createGenericTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;

const getTabTitles = (nativeEl: HTMLElement) => Array.prototype.slice.apply(nativeEl.querySelectorAll('.nav-link'));
const mapToHref = (items: HTMLElement[]) => items.map(item => item.getAttribute('href'));
const mapToActive = (items: HTMLElement[]) => items.map(item => item.classList.contains('active'));

describe('ngb-tabset-routing', () => {

  let fixture: ComponentFixture<TestComponent>;
  let router: Router;
  let location: Location;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [
        NgbTabsetModule.forRoot(),
        RouterTestingModule.withRoutes(
            [{path: 'firstTab', children: []}, {path: 'secondTab', children: []}, {path: 'thirdTab', children: []}]),
        NgbTabsetRoutingModule
      ]
    });
    fixture = createTestComponent(`
        <ngb-tabset routerControlled>
          <ngb-tab title="first tab" routerLink="firstTab" preserveFragment></ngb-tab>
          <ngb-tab title="second tab" routerLink="secondTab" preserveFragment></ngb-tab>
          <ngb-tab title="third tab" routerLink="thirdTab" preserveFragment></ngb-tab>
        </ngb-tabset>
      `);
    router = TestBed.get(Router);
    location = TestBed.get(Location);
    location.go('/secondTab');
    router.initialNavigation();
    tick(1);
    fixture.detectChanges();
  }));

  it('should initially have the right hrefs and active tab', () => {
    const titles = getTabTitles(fixture.nativeElement);
    expect(location.path()).toBe('/secondTab');
    expect(mapToHref(titles)).toEqual(['/firstTab', '/secondTab', '/thirdTab']);
    expect(mapToActive(titles)).toEqual([false, true, false]);
  });

  it('should change the active tab depending on the url', fakeAsync(() => {
       const titles = getTabTitles(fixture.nativeElement);

       location.go('/thirdTab');
       tick(1);
       fixture.detectChanges();

       expect(location.path()).toBe('/thirdTab');
       expect(mapToHref(titles)).toEqual(['/firstTab', '/secondTab', '/thirdTab']);
       expect(mapToActive(titles)).toEqual([false, false, true]);
     }));

  it('should navigate when clicking on a tab', fakeAsync(() => {
       const titles = getTabTitles(fixture.nativeElement);
       titles[2].click();
       tick(1);
       fixture.detectChanges();

       expect(location.path()).toBe('/thirdTab');
       expect(mapToHref(titles)).toEqual(['/firstTab', '/secondTab', '/thirdTab']);
       expect(mapToActive(titles)).toEqual([false, false, true]);
     }));


  it('should update the href on navigation', fakeAsync(() => {
       location.go('/secondTab#withHash');
       tick(1);
       fixture.detectChanges();

       const titles = getTabTitles(fixture.nativeElement);
       expect(location.path()).toBe('/secondTab#withHash');
       expect(mapToHref(titles)).toEqual(['/firstTab#withHash', '/secondTab#withHash', '/thirdTab#withHash']);
       expect(mapToActive(titles)).toEqual([false, true, false]);
     }));
});

@Component({selector: 'test-cmp', template: ''})
class TestComponent {
}
