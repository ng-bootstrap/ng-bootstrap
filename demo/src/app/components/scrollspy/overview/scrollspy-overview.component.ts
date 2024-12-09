import { Component } from '@angular/core';

import { Snippet } from '../../../services/snippet';
import { NgbAlertModule, NgbScrollSpyModule } from '@ng-bootstrap/ng-bootstrap';
import { CodeComponent } from '../../../shared/code.component';
import { RouterLink } from '@angular/router';
import { NgbdApiDocsBadge } from '../../../shared/api-docs';
import { PageHeaderComponent } from '../../../shared/page-header.component';
import { NgbdOverviewPage } from '../../../shared/overview-page/overview-page.class';

@Component({
    selector: 'ngbd-scrollspy-overview',
    imports: [NgbAlertModule, NgbScrollSpyModule, CodeComponent, RouterLink, NgbdApiDocsBadge, PageHeaderComponent],
    templateUrl: './scrollspy-overview.component.html',
    host: { '[class.overview]': 'true' }
})
export class NgbdScrollSpyOverviewComponent extends NgbdOverviewPage {
	SERVICE = Snippet({
		lang: 'ts',
		code: `
      // get the service
      let service = inject(NgbScrollSpyService);

      // get notified when visible fragment changes
      service.active$.subscribe((activeId) => {
        // ...
      });

      // watch fragments you're interested in
      // they can also be provided via start options
      service.observe('section-one-id');

      // start the service when you're ready and pass options
      service.start({ ... });

      // stop the service when you're done
      service.stop();
    `,
	});

	CUSTOMIZATION = Snippet({
		lang: 'ts',
		code: `
      myCustomProcess(
        state: {
          entries: IntersectionObserverEntry[];
          rootElement: HTMLElement;
          fragments: Set<Element>;
          scrollSpy: NgbScrollSpyService;
          options: NgbScrollSpyOptions;
        },
        changeActive: (active: string) => void,
        context: object,
      )
      {
        changeActive('one'); // change active fragment to 'one'
      }
    `,
	});

	ITEM_BASIC = Snippet({
		lang: 'html',
		code: `
    <ul class="nav nav-pills">
      <li class="nav-item">
        <!-- ScrollSpy comes from DI -->
        <button class="nav-link" ngbScrollSpyItem="one" #item="ngbScrollSpyItem">one</button>

        <!-- ScrollSpy is referenced explicitly -->
        <button class="nav-link" [ngbScrollSpyItem]="myScrollSpy" fragment='one'>one</button>
      </li>
    </ul>

    <pre>{{ item.isActive() }}</pre>  <!-- true -->
    <button (click)="item.scrollTo()">Scroll to </button> <!-- scrolls to 'one' -->
    `,
	});

	ITEM_SYNTAX = Snippet({
		lang: 'html',
		code: `
      <span ngbScrollSpyItem="one" parent="one-parent">one</span>
      <span ngbScrollSpyItem fragment="one" parent="one-parent">one</span>
      <span [ngbScrollSpyItem]="spy" fragment="one" parent="one-parent">one</span>
      <span [ngbScrollSpyItem]="[spy, 'one', 'one-parent']">one</span>
    `,
	});

	MENU = Snippet({
		lang: 'html',
		code: `
      <!-- Can reference ScrollSpy or get it from DI -->
      <nav [ngbScrollSpyMenu]="spy" class="nav nav-pills">
        <a role="button" class="nav-link" ngbScrollSpyItem="parent-1">Item 1</a>
        <nav class="nav nav-pills">
          <a role="button" class="nav-link" ngbScrollSpyItem="child-1" parent="parent-1">Item 1-1</a>
        </nav>
      </nav>
    `,
	});

	DIRECTIVE = Snippet({
		lang: 'html',
		code: `
      <div ngbScrollSpy #spy="ngbScrollSpy">
        <div ngbScrollSpyFragment='one'>one</div>
        <div ngbScrollSpyFragment='two'>two</div>
        <div ngbScrollSpyFragment='three'>three</div>
      </div>

      <pre>{{ spy.active }}</pre> // 'one'
    `,
	});
}
