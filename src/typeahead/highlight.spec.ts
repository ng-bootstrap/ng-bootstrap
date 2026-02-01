import { describe, expect, it } from 'vitest';
import { createGenericAsyncTestComponent } from '../test/common';

import { Component } from '@angular/core';

import { NgbHighlight } from './highlight';

const createTestComponent = (html: string) => createGenericAsyncTestComponent(html, TestComponent);

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
	it('should render highlighted text when there is one match', async () => {
		const fixture = await createTestComponent('<ngb-highlight result="foo bar baz" term="bar"></ngb-highlight>');

		expect(highlightHtml(fixture)).toBe('foo <span class="ngb-highlight">bar</span> baz');
	});

	it('should render highlighted text when there are multiple matches', async () => {
		const fixture = await createTestComponent(
			'<ngb-highlight result="foo bar baz bar foo" term="bar"></ngb-highlight>',
		);

		expect(highlightHtml(fixture)).toBe(
			'foo <span class="ngb-highlight">bar</span> baz <span class="ngb-highlight">bar</span> foo',
		);
	});

	it('should render highlighted text when there is a match at the beginning', async () => {
		const fixture = await createTestComponent('<ngb-highlight result="bar baz" term="bar"></ngb-highlight>');

		expect(highlightHtml(fixture)).toBe('<span class="ngb-highlight">bar</span> baz');
	});

	it('should render highlighted text when there is a match at the end', async () => {
		const fixture = await createTestComponent('<ngb-highlight result="bar baz" term="baz"></ngb-highlight>');

		expect(highlightHtml(fixture)).toBe('bar <span class="ngb-highlight">baz</span>');
	});

	it('should render highlighted text when there is a case-insensitive match', async () => {
		const fixture = await createTestComponent('<ngb-highlight result="foo bAR baz" term="bar"></ngb-highlight>');

		expect(highlightHtml(fixture)).toBe('foo <span class="ngb-highlight">bAR</span> baz');
	});

	it('should render highlighted text with special characters', async () => {
		const fixture = await createTestComponent('<ngb-highlight result="foo (bAR baz" term="(BAR"></ngb-highlight>');

		expect(highlightHtml(fixture)).toBe('foo <span class="ngb-highlight">(bAR</span> baz');
	});

	it('should render highlighted text for stringified non-string args', async () => {
		const fixture = await createTestComponent('<ngb-highlight [result]="123" term="2"></ngb-highlight>');
		expect(highlightHtml(fixture)).toBe('1<span class="ngb-highlight">2</span>3');
	});

	it('should behave reasonably for blank result', async () => {
		const fixture = await createTestComponent('<ngb-highlight [result]="null" term="2"></ngb-highlight>');

		expect(highlightHtml(fixture)).toBe('');
	});

	it('should not convert null result to string', async () => {
		const fixture = await createTestComponent('<ngb-highlight [result]="null" term="null"></ngb-highlight>');

		expect(highlightHtml(fixture)).toBe('');
	});

	it('should properly detect matches in 0 result', async () => {
		const fixture = await createTestComponent('<ngb-highlight [result]="0" term="0"></ngb-highlight>');

		expect(highlightHtml(fixture)).toBe(`<span class="ngb-highlight">0</span>`);
	});

	it('should not highlight anything for blank term', async () => {
		const fixture = await createTestComponent('<ngb-highlight result="1null23" [term]="null"></ngb-highlight>');

		expect(highlightHtml(fixture)).toBe('1null23');
	});

	it('should not highlight anything for blank term', async () => {
		const fixture = await createTestComponent(`<ngb-highlight result="123" [term]="''"></ngb-highlight>`);

		expect(highlightHtml(fixture)).toBe('123');
	});

	it('should properly highlight zeros', async () => {
		const fixture = await createTestComponent(`<ngb-highlight result="0123" [term]="0"></ngb-highlight>`);

		expect(highlightHtml(fixture)).toBe('<span class="ngb-highlight">0</span>123');
	});

	it('should support custom highlight class', async () => {
		const fixture = await createTestComponent(
			'<ngb-highlight result="123" [term]="2" highlightClass="my"></ngb-highlight>',
		);

		expect(highlightHtml(fixture)).toBe('1<span class="my">2</span>3');
	});

	it('should highlight when term contains array with 1 item', async () => {
		const fixture = await createTestComponent(`<ngb-highlight result="foo bar baz" [term]="['bar']"></ngb-highlight>`);

		expect(highlightHtml(fixture)).toBe('foo <span class="ngb-highlight">bar</span> baz');
	});

	it('should highlight when term contains array with several items', async () => {
		const fixture = await createTestComponent(
			`<ngb-highlight result="foo bar baz" [term]="['foo', 'baz']"></ngb-highlight>`,
		);

		expect(highlightHtml(fixture)).toBe(
			'<span class="ngb-highlight">foo</span> bar <span class="ngb-highlight">baz</span>',
		);
	});

	it('should highlight when term contains array with several items and the terms in text stand together', async () => {
		const fixture = await createTestComponent(
			`<ngb-highlight result="foobar baz" [term]="['foo', 'bar']"></ngb-highlight>`,
		);

		expect(highlightHtml(fixture)).toBe(
			'<span class="ngb-highlight">foo</span><span class="ngb-highlight">bar</span> baz',
		);
	});

	it('should not fail when term contains null element', async () => {
		const fixture = await createTestComponent(
			`<ngb-highlight result="foo bar baz" [term]="[null, 'bar']"></ngb-highlight>`,
		);

		expect(highlightHtml(fixture)).toBe('foo <span class="ngb-highlight">bar</span> baz');
	});

	it('should highlight when term contains mix of strings and numbers', async () => {
		const fixture = await createTestComponent(
			`<ngb-highlight [result]="1123456789" [term]="[123, 345, '678']"></ngb-highlight>`,
		);

		expect(highlightHtml(fixture)).toBe(
			'1<span class="ngb-highlight">123</span>45<span class="ngb-highlight">678</span>9',
		);
	});

	if (typeof String.prototype.normalize !== 'undefined') {
		it(
			'should highlight without sensitivity to accents in terms or result when accentSensitive is false ' +
				'and String.prototype.normalize is defined',
			async () => {
				const fixture = await createTestComponent(
					`<ngb-highlight [result]="'Il fait beau en été. Moins à Noël.'" ` +
						`[term]="['eté', 'a', 'noel']" [accentSensitive]="false"></ngb-highlight>`,
				);

				expect(highlightHtml(fixture)).toBe(
					'Il f<span class="ngb-highlight">a</span>it be<span class="ngb-highlight">a</span>u en ' +
						'<span class="ngb-highlight">été</span>. Moins <span class="ngb-highlight">à</span> ' +
						'<span class="ngb-highlight">Noël</span>.',
				);
			},
		);
	} else {
		it(
			'should highlight with sensitivity to accents in terms or result when accentSensitive is false ' +
				'and String.prototype.normalize is undefined',
			async () => {
				const fixture = await createTestComponent(
					`<ngb-highlight [result]="'Il fait beau en été. Moins à Noël.'" ` +
						`[term]="['eté', 'a', 'noel']" [accentSensitive]="false"></ngb-highlight>`,
				);

				expect(highlightHtml(fixture)).toBe(
					'Il f<span class="ngb-highlight">a</span>it be<span class="ngb-highlight">a</span>u en été. Moins à Noël.',
				);
			},
		);
	}

	it('should highlight with sensitivity to accents in terms or result when accentSensitive is true', async () => {
		const fixture = await createTestComponent(
			`<ngb-highlight [result]="'Il fait beau en été. Moins à Noël.'" ` +
				`[term]="['eté', 'a', 'noel']"></ngb-highlight>`,
		);

		expect(highlightHtml(fixture)).toBe(
			'Il f<span class="ngb-highlight">a</span>it be<span class="ngb-highlight">a</span>u en été. Moins à Noël.',
		);
	});
});

@Component({
	selector: 'test-cmp',
	imports: [NgbHighlight],
	template: '',
})
class TestComponent {}
