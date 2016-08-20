import {fakeAsync, discardPeriodicTasks, tick, TestBed, ComponentFixture} from '@angular/core/testing';
import {createGenericTestComponent} from '../util/tests';

import {By} from '@angular/platform-browser';
import {Component} from '@angular/core';

import {NgbCarouselModule} from './index';
import {NgbCarousel} from './carousel';

const createTestComponent = (html: string) =>
    createGenericTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;

function expectActiveSlides(nativeEl: HTMLDivElement, active: boolean[]) {
  const slideElms = nativeEl.querySelectorAll('.carousel-item');
  const indicatorElms = nativeEl.querySelectorAll('ol.carousel-indicators > li');

  expect(slideElms.length).toBe(active.length);
  expect(indicatorElms.length).toBe(active.length);

  for (let i = 0; i < active.length; i++) {
    if (active[i]) {
      expect(slideElms[i]).toHaveCssClass('active');
      expect(indicatorElms[i]).toHaveCssClass('active');
    } else {
      expect(slideElms[i]).not.toHaveCssClass('active');
      expect(indicatorElms[i]).not.toHaveCssClass('active');
    }
  }
}

describe('ngb-carousel', () => {
  beforeEach(() => { TestBed.configureTestingModule({declarations: [TestComponent], imports: [NgbCarouselModule]}); });

  it('should render slides and navigation indicators', fakeAsync(() => {
       const html = `
      <ngb-carousel>
        <template ngbSlide>foo</template>
        <template ngbSlide>bar</template>
      </ngb-carousel>
    `;
       const fixture = createTestComponent(html);

       const slideElms = fixture.nativeElement.querySelectorAll('.carousel-item');
       expect(slideElms.length).toBe(2);
       expect(slideElms[0].textContent).toMatch(/foo/);
       expect(slideElms[1].textContent).toMatch(/bar/);

       expect(fixture.nativeElement.querySelectorAll('ol.carousel-indicators > li').length).toBe(2);

       discardPeriodicTasks();
     }));


  it('should mark the first slide as active by default', fakeAsync(() => {
       const html = `
      <ngb-carousel>
        <template ngbSlide>foo</template>
        <template ngbSlide>bar</template>
      </ngb-carousel>
    `;

       const fixture = createTestComponent(html);
       expectActiveSlides(fixture.nativeElement, [true, false]);

       discardPeriodicTasks();
     }));


  it('should mark the requested slide as active', fakeAsync(() => {
       const html = `
       <ngb-carousel [activeId]="activeSlideId">
         <template ngbSlide id="1">foo</template>
         <template ngbSlide id="2">bar</template>
       </ngb-carousel>
     `;

       const fixture = createTestComponent(html);

       fixture.componentInstance.activeSlideId = 1;
       fixture.detectChanges();
       expectActiveSlides(fixture.nativeElement, [true, false]);

       discardPeriodicTasks();
     }));

  it('should auto-correct when slide index is undefined', fakeAsync(() => {
       const html = `
            <ngb-carousel [activeId]="doesntExist">
              <template ngbSlide>foo</template>
              <template ngbSlide>bar</template>
            </ngb-carousel>
          `;

       const fixture = createTestComponent(html);
       expectActiveSlides(fixture.nativeElement, [true, false]);

       discardPeriodicTasks();
     }));


  it('should change slide on indicator click', fakeAsync(() => {
       const html = `
      <ngb-carousel>
        <template ngbSlide>foo</template>
        <template ngbSlide>bar</template>
      </ngb-carousel>
    `;

       const fixture = createTestComponent(html);
       const indicatorElms = fixture.nativeElement.querySelectorAll('ol.carousel-indicators > li');

       expectActiveSlides(fixture.nativeElement, [true, false]);

       indicatorElms[1].click();
       fixture.detectChanges();
       expectActiveSlides(fixture.nativeElement, [false, true]);

       discardPeriodicTasks();
     }));


  it('should change slide on carousel control click', fakeAsync(() => {
       const html = `
      <ngb-carousel>
        <template ngbSlide>foo</template>
        <template ngbSlide>bar</template>
      </ngb-carousel>
    `;

       const fixture = createTestComponent(html);

       const controlElms = fixture.nativeElement.querySelectorAll('.carousel-control');

       expectActiveSlides(fixture.nativeElement, [true, false]);

       controlElms[1].click();  // next
       fixture.detectChanges();
       expectActiveSlides(fixture.nativeElement, [false, true]);

       controlElms[0].click();  // prev
       fixture.detectChanges();
       expectActiveSlides(fixture.nativeElement, [true, false]);

       discardPeriodicTasks();
     }));

  it('should change slide on time passage (default interval value)', fakeAsync(() => {
       const html = `
      <ngb-carousel>
        <template ngbSlide>foo</template>
        <template ngbSlide>bar</template>
      </ngb-carousel>
    `;

       const fixture = createTestComponent(html);

       expectActiveSlides(fixture.nativeElement, [true, false]);

       tick(6000);
       fixture.detectChanges();
       expectActiveSlides(fixture.nativeElement, [false, true]);

       discardPeriodicTasks();
     }));

  it('should change slide on time passage (custom interval value)', fakeAsync(() => {
       const html = `
      <ngb-carousel [interval]="2000">
        <template ngbSlide>foo</template>
        <template ngbSlide>bar</template>
      </ngb-carousel>
    `;

       const fixture = createTestComponent(html);

       expectActiveSlides(fixture.nativeElement, [true, false]);

       tick(1000);
       fixture.detectChanges();
       expectActiveSlides(fixture.nativeElement, [true, false]);

       tick(1200);
       fixture.detectChanges();
       expectActiveSlides(fixture.nativeElement, [false, true]);

       discardPeriodicTasks();
     }));

  it('should pause / resume slide change with time passage on mouse enter / leave', fakeAsync(() => {
       const html = `
      <ngb-carousel>
        <template ngbSlide>foo</template>
        <template ngbSlide>bar</template>
      </ngb-carousel>
    `;

       const fixture = createTestComponent(html);

       const carouselDebugEl = fixture.debugElement.query(By.directive(NgbCarousel));

       expectActiveSlides(fixture.nativeElement, [true, false]);

       carouselDebugEl.triggerEventHandler('mouseenter', {});
       fixture.detectChanges();
       expectActiveSlides(fixture.nativeElement, [true, false]);

       tick(6000);
       fixture.detectChanges();
       expectActiveSlides(fixture.nativeElement, [true, false]);

       carouselDebugEl.triggerEventHandler('mouseleave', {});
       fixture.detectChanges();
       expectActiveSlides(fixture.nativeElement, [true, false]);

       tick(6000);
       fixture.detectChanges();
       expectActiveSlides(fixture.nativeElement, [false, true]);

       discardPeriodicTasks();
     }));

  it('should wrap slide changes by default', fakeAsync(() => {
       const html = `
      <ngb-carousel>
        <template ngbSlide>foo</template>
        <template ngbSlide>bar</template>
      </ngb-carousel>
    `;

       const fixture = createTestComponent(html);

       const controlElms = fixture.nativeElement.querySelectorAll('.carousel-control');

       expectActiveSlides(fixture.nativeElement, [true, false]);

       controlElms[1].click();  // next
       fixture.detectChanges();
       expectActiveSlides(fixture.nativeElement, [false, true]);

       controlElms[1].click();  // next
       fixture.detectChanges();
       expectActiveSlides(fixture.nativeElement, [true, false]);

       controlElms[0].click();  // prev
       fixture.detectChanges();
       expectActiveSlides(fixture.nativeElement, [false, true]);

       discardPeriodicTasks();
     }));

  it('should not wrap slide changes by when requested', fakeAsync(() => {
       const html = `
      <ngb-carousel [wrap]="false">
        <template ngbSlide>foo</template>
        <template ngbSlide>bar</template>
      </ngb-carousel>
    `;

       const fixture = createTestComponent(html);

       const controlElms = fixture.nativeElement.querySelectorAll('.carousel-control');

       expectActiveSlides(fixture.nativeElement, [true, false]);

       controlElms[0].click();  // prev
       fixture.detectChanges();
       expectActiveSlides(fixture.nativeElement, [true, false]);

       controlElms[1].click();  // next
       fixture.detectChanges();
       expectActiveSlides(fixture.nativeElement, [false, true]);

       controlElms[1].click();  // next
       fixture.detectChanges();
       expectActiveSlides(fixture.nativeElement, [false, true]);

       discardPeriodicTasks();
     }));

  it('should change on key arrowRight and arrowLeft', fakeAsync(() => {
       const html = `
            <ngb-carousel [keyboard]="keyboard" [wrap]="false">
              <template ngbSlide>foo</template>
              <template ngbSlide>bar</template>
            </ngb-carousel>
          `;

       const fixture = createTestComponent(html);
       expectActiveSlides(fixture.nativeElement, [true, false]);

       fixture.debugElement.query(By.directive(NgbCarousel)).triggerEventHandler('keyup.arrowRight', {});  // next()
       fixture.detectChanges();
       expectActiveSlides(fixture.nativeElement, [false, true]);

       fixture.debugElement.query(By.directive(NgbCarousel)).triggerEventHandler('keyup.arrowLeft', {});  // prev()
       fixture.detectChanges();
       expectActiveSlides(fixture.nativeElement, [true, false]);

       fixture.componentInstance.keyboard = false;
       fixture.detectChanges();
       fixture.debugElement.query(By.directive(NgbCarousel)).triggerEventHandler('keyup.arrowRight', {});  // prev()
       fixture.detectChanges();
       expectActiveSlides(fixture.nativeElement, [true, false]);


       discardPeriodicTasks();

     }));

  it('should listen to keyevents based on keyboard attribute', fakeAsync(() => {
       const html = `
               <ngb-carousel [keyboard]="keyboard" >
                 <template ngbSlide>foo</template>
                 <template ngbSlide>bar</template>
               </ngb-carousel>
             `;

       const fixture = createTestComponent(html);
       expectActiveSlides(fixture.nativeElement, [true, false]);

       fixture.componentInstance.keyboard = false;
       fixture.detectChanges();
       fixture.debugElement.query(By.directive(NgbCarousel)).triggerEventHandler('keyup.arrowRight', {});  // prev()
       fixture.detectChanges();
       expectActiveSlides(fixture.nativeElement, [true, false]);

       fixture.componentInstance.keyboard = true;
       fixture.detectChanges();
       fixture.debugElement.query(By.directive(NgbCarousel)).triggerEventHandler('keyup.arrowRight', {});  // next()
       fixture.detectChanges();
       expectActiveSlides(fixture.nativeElement, [false, true]);

       discardPeriodicTasks();

     }));

});

@Component({selector: 'test-cmp', template: ''})
class TestComponent {
  activeSlideId;
  keyboard = true;
}
