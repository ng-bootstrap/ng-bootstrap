import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild} from '@angular/core';

import {CodeHighlightService} from './code-highlight.service';

@Component({
  selector: 'ngbd-code',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <pre class="language-{{ lang }}"><code #code class="language-{{ lang }}"></code></pre>
  `
})
export class NgbdCodeComponent implements AfterViewInit {

  @ViewChild('code') codeEl: ElementRef;

  @Input() code = '';
  @Input() lang = '';

  constructor(private _service: CodeHighlightService) { }

  ngAfterViewInit() {
    this.codeEl.nativeElement.innerHTML = this._service.highlight(this.code, this.lang);
  }
}
