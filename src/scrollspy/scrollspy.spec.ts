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

import {Component, provide} from '@angular/core';

import {NgbScrollSpier, NgbScrollSpy, NgbScrollTarget} from './scrollspy';

function expectToBeActive(componentElement, idx) {
  let anchors = componentElement.querySelectorAll('a');
  Array.from(anchors).forEach((anchor, aIdx) => {
    if (aIdx === idx) {
      expect(anchor).toHaveCssClass('active');
    } else {
      expect(anchor).not.toHaveCssClass('active');
    }
  });
}

describe('ngb-scroll-spy', () => {
  let html: string;

  beforeEach(() => {
    html = `
      <div>
        <navbar>
          <nav>
            <ul>
              <li><a href [ngbScrollSpy]="selectors[0]">Anchor 1</a></li>
              <li><a href [ngbScrollSpy]="selectors[1]">Anchor 2</a></li>
              <li><a href [ngbScrollSpy]="selectors[2]">Anchor 3</a></li>
            </ul>
          </nav>
        </navbar>
        <section ngbScrollTarget>
          <div id="foo" style="height: 500px; width: 100px"></div>
          <div id="bar" style="height: 500px; width: 100px"></div>
          <div id="baz" style="height: 500px; width: 100px"></div>
        </section>
      </div>
    `;
  });

  beforeEachProviders(() => [provide(NgbScrollSpier, {useClass: NgbScrollSpier})]);

  it('should have no active class', async(inject([TestComponentBuilder], (tcb) => {
       return tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();

         let anchors = fixture.nativeElement.querySelectorAll('a');
         Array.from(anchors).forEach((anchor: Element) => { expect(anchor.classList.contains('active')).toBe(false); });
       });
     })));

  it('should set the first anchor class as active', async(inject([TestComponentBuilder], (tcb) => {
       return tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();

         fixture.nativeElement.querySelector('[ngbScrollTarget]').scrollTop = 10;
         let evt = new Event('scroll');
         fixture.nativeElement.dispatchEvent(evt);
         fixture.detectChanges();

         expectToBeActive(fixture.nativeElement, 0);
       });
     })));

  it('should set the second anchor class as active', async(inject([TestComponentBuilder], (tcb) => {
       return tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();

         fixture.nativeElement.querySelector('[ngbScrollTarget]').scrollTop = 501;
         let evt = new Event('scroll');
         fixture.nativeElement.dispatchEvent(evt);
         fixture.detectChanges();

         expectToBeActive(fixture.nativeElement, 1);
       });
     })));
});

@Component({selector: 'test-cmp', directives: [NgbScrollSpy, NgbScrollTarget], template: ''})
class TestComponent {
  selectors: Array<string> = ['#foo', '#bar', '#baz'];
}
