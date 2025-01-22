import {
	afterNextRender,
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	inject,
	input,
	viewChild,
} from '@angular/core';

import { ISnippet } from '../services/snippet';
import { CodeHighlightService } from '../services/code-highlight.service';

@Component({
	selector: 'ngbd-code',
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<pre class="language-{{ snippet().lang }}"><code #code class="language-{{ snippet().lang }}"></code></pre>
	`,
})
export class CodeComponent {
	private _codeEl = viewChild.required('code', { read: ElementRef });
	snippet = input.required<ISnippet>();

	constructor() {
		const highlightService = inject(CodeHighlightService);
		afterNextRender(() => {
			this._codeEl().nativeElement.innerHTML = highlightService.highlight(this.snippet().code, this.snippet().lang);
		});
	}
}
