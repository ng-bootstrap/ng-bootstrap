import {inject, async, addProviders} from '@angular/core/testing';

import {TestComponentBuilder} from '@angular/compiler/testing';

import {Component} from '@angular/core';
import {By} from '@angular/platform-browser';

import {NgbScrollSpy, NgbScrollTarget} from './scrollspy';

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

describe('ngb-scrollspy', () => {
  let html: string;

  beforeEach(() => {
    html = `
      <div>
        <navbar>
          <nav>
            <ul>
              <li><a [ngbScrollSpy]="selectors[0]">Anchor 1</a></li>
              <li><a [ngbScrollSpy]="selectors[1]">Anchor 2</a></li>
              <li><a [ngbScrollSpy]="selectors[2]">Anchor 3</a></li>
            </ul>
          </nav>
        </navbar>
        <section ngbScrollTarget style="height: 100px;overflow: scroll;">
          <div id="foo" style="height: 500px; width: 100px"></div>
          <div id="bar" style="height: 500px; width: 100px"></div>
          <div id="baz" style="height: 500px; width: 100px"></div>
        </section>
      </div>
    `;
  });

  it('should have no active class when initialized', async(inject([TestComponentBuilder], (tcb) => {
       tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();

         let anchors = fixture.nativeElement.querySelectorAll('a');
         Array.from(anchors).forEach((anchor: Element) => { expect(anchor.classList.contains('active')).toBe(false); });
       });
     })));

  it('should set the first anchor class as active', async(inject([TestComponentBuilder], (tcb) => {
       tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();

         fixture.nativeElement.querySelector('[ngbScrollTarget]').scrollTop = 10;
         let evt = new Event('scroll');
         fixture.nativeElement.querySelector('[ngbScrollTarget]').dispatchEvent(evt);
         fixture.detectChanges();

         expectToBeActive(fixture.nativeElement, 0);
       });
     })));

  it('should set the second anchor class as active', async(inject([TestComponentBuilder], (tcb) => {
       tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();

         fixture.nativeElement.querySelector('[ngbScrollTarget]').scrollTop = 501;
         let evt = new Event('scroll');
         fixture.nativeElement.querySelector('[ngbScrollTarget]').dispatchEvent(evt);
         fixture.detectChanges();

         expectToBeActive(fixture.nativeElement, 1);
       });
     })));

  it('should set the selected anchor as active', async(inject([TestComponentBuilder], (tcb) => {
       tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
         fixture.detectChanges();

         let anchors = fixture.nativeElement.querySelectorAll('a');
         anchors[0].click();
         fixture.detectChanges();

         expectToBeActive(fixture.nativeElement, 0);

         anchors[1].click();
         fixture.detectChanges();

         expectToBeActive(fixture.nativeElement, 1);

       });
     })));
});

@Component({selector: 'test-cmp', directives: [NgbScrollSpy, NgbScrollTarget], template: ''})
class TestComponent {
  selectors: string[] = ['foo', 'bar', 'baz'];
}
