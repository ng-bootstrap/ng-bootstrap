import {inject, async} from '@angular/core/testing';
import {TestComponentBuilder, ComponentFixture} from '@angular/compiler/testing';

import {Component} from '@angular/core';

import {NgbHighlight} from './highlight';


/**
 * Get generated innerHtml without HTML comments and Angular debug attributes
 */
function highlightHtml(fixture) {
  const elms = fixture.nativeElement.children[0].childNodes;
  let elm;
  let result = '';
  let nodeName;

  for (let i = 0; i < elms.length; i++) {
    elm = elms[i];

    if (elm.nodeType === Node.ELEMENT_NODE) {
      nodeName = elm.nodeName.toLowerCase();
      result += `<${nodeName} class="${elm.className}">${elm.textContent}</${nodeName}>`;
    } else if (elm.nodeType === Node.TEXT_NODE) {
      result += elm.wholeText;
    }
  }

  return result;
}

describe('ngb-highlight', () => {

  it('should render highlighted text when there is one match', async(inject([TestComponentBuilder], (tcb) => {
       const html = '<ngb-highlight result="foo bar baz" term="bar"></ngb-highlight>';
       tcb.overrideTemplate(TestComponent, html)
           .createAsync(TestComponent)
           .then((fixture: ComponentFixture<TestComponent>) => {
             fixture.detectChanges();
             expect(highlightHtml(fixture)).toBe('foo <span class="ngb-highlight">bar</span> baz');
           });
     })));

  it('should render highlighted text when there are multiple matches', async(inject([TestComponentBuilder], (tcb) => {
       const html = '<ngb-highlight result="foo bar baz bar foo" term="bar"></ngb-highlight>';
       tcb.overrideTemplate(TestComponent, html)
           .createAsync(TestComponent)
           .then((fixture: ComponentFixture<TestComponent>) => {
             fixture.detectChanges();
             expect(highlightHtml(fixture))
                 .toBe('foo <span class="ngb-highlight">bar</span> baz <span class="ngb-highlight">bar</span> foo');
           });
     })));

  it('should render highlighted text when there is a match at the beginning',
     async(inject([TestComponentBuilder], (tcb) => {
       const html = '<ngb-highlight result="bar baz" term="bar"></ngb-highlight>';
       tcb.overrideTemplate(TestComponent, html)
           .createAsync(TestComponent)
           .then((fixture: ComponentFixture<TestComponent>) => {
             fixture.detectChanges();
             expect(highlightHtml(fixture)).toBe('<span class="ngb-highlight">bar</span> baz');
           });
     })));

  it('should render highlighted text when there is a match at the end', async(inject([TestComponentBuilder], (tcb) => {
       const html = '<ngb-highlight result="bar baz" term="baz"></ngb-highlight>';
       tcb.overrideTemplate(TestComponent, html)
           .createAsync(TestComponent)
           .then((fixture: ComponentFixture<TestComponent>) => {
             fixture.detectChanges();
             expect(highlightHtml(fixture)).toBe('bar <span class="ngb-highlight">baz</span>');
           });
     })));

  it('should render highlighted text when there is a case-insensitive match',
     async(inject([TestComponentBuilder], (tcb) => {
       const html = '<ngb-highlight result="foo bAR baz" term="bar"></ngb-highlight>';
       tcb.overrideTemplate(TestComponent, html)
           .createAsync(TestComponent)
           .then((fixture: ComponentFixture<TestComponent>) => {
             fixture.detectChanges();
             expect(highlightHtml(fixture)).toBe('foo <span class="ngb-highlight">bAR</span> baz');
           });
     })));

  it('should render highlighted text with special characters', async(inject([TestComponentBuilder], (tcb) => {
       const html = '<ngb-highlight result="foo (bAR baz" term="(BAR"></ngb-highlight>';
       tcb.overrideTemplate(TestComponent, html)
           .createAsync(TestComponent)
           .then((fixture: ComponentFixture<TestComponent>) => {
             fixture.detectChanges();
             expect(highlightHtml(fixture)).toBe('foo <span class="ngb-highlight">(bAR</span> baz');
           });
     })));

  it('should render highlighted text for stringified non-string args', async(inject([TestComponentBuilder], (tcb) => {
       const html = '<ngb-highlight [result]="123" term="2"></ngb-highlight>';
       tcb.overrideTemplate(TestComponent, html)
           .createAsync(TestComponent)
           .then((fixture: ComponentFixture<TestComponent>) => {
             fixture.detectChanges();
             expect(highlightHtml(fixture)).toBe('1<span class="ngb-highlight">2</span>3');
           });
     })));

  it('should behave reasonably for blank result', async(inject([TestComponentBuilder], (tcb) => {
       const html = '<ngb-highlight [result]="null" term="2"></ngb-highlight>';
       tcb.overrideTemplate(TestComponent, html)
           .createAsync(TestComponent)
           .then((fixture: ComponentFixture<TestComponent>) => {
             fixture.detectChanges();
             expect(highlightHtml(fixture)).toBe('');
           });
     })));

  it('should not convert null result to string', async(inject([TestComponentBuilder], (tcb) => {
       const html = '<ngb-highlight [result]="null" term="null"></ngb-highlight>';
       tcb.overrideTemplate(TestComponent, html)
           .createAsync(TestComponent)
           .then((fixture: ComponentFixture<TestComponent>) => {
             fixture.detectChanges();
             expect(highlightHtml(fixture)).toBe('');
           });
     })));

  it('should properly detect matches in 0 result', async(inject([TestComponentBuilder], (tcb) => {
       const html = '<ngb-highlight [result]="0" term="0"></ngb-highlight>';
       tcb.overrideTemplate(TestComponent, html)
           .createAsync(TestComponent)
           .then((fixture: ComponentFixture<TestComponent>) => {
             fixture.detectChanges();
             expect(highlightHtml(fixture)).toBe(`<span class="ngb-highlight">0</span>`);
           });
     })));

  it('should not higlight anything for blank term', async(inject([TestComponentBuilder], (tcb) => {
       const html = '<ngb-highlight result="1null23" [term]="null"></ngb-highlight>';
       tcb.overrideTemplate(TestComponent, html)
           .createAsync(TestComponent)
           .then((fixture: ComponentFixture<TestComponent>) => {
             fixture.detectChanges();
             expect(highlightHtml(fixture)).toBe('1null23');
           });
     })));

  it('should not higlight anything for blank term', async(inject([TestComponentBuilder], (tcb) => {
       const html = `<ngb-highlight result="123" [term]="''"></ngb-highlight>`;
       tcb.overrideTemplate(TestComponent, html)
           .createAsync(TestComponent)
           .then((fixture: ComponentFixture<TestComponent>) => {
             fixture.detectChanges();
             expect(highlightHtml(fixture)).toBe('123');
           });
     })));

  it('should properly higlight zeros', async(inject([TestComponentBuilder], (tcb) => {
       const html = `<ngb-highlight result="0123" [term]="0"></ngb-highlight>`;
       tcb.overrideTemplate(TestComponent, html)
           .createAsync(TestComponent)
           .then((fixture: ComponentFixture<TestComponent>) => {
             fixture.detectChanges();
             expect(highlightHtml(fixture)).toBe('<span class="ngb-highlight">0</span>123');
           });
     })));

  it('should support custom highlight class', async(inject([TestComponentBuilder], (tcb) => {
       const html = '<ngb-highlight result="123" [term]="2" highlightClass="my"></ngb-highlight>';
       tcb.overrideTemplate(TestComponent, html)
           .createAsync(TestComponent)
           .then((fixture: ComponentFixture<TestComponent>) => {
             fixture.detectChanges();
             expect(highlightHtml(fixture)).toBe('1<span class="my">2</span>3');
           });
     })));
});


@Component({selector: 'test-cmp', directives: [NgbHighlight], template: ''})
class TestComponent {
}
