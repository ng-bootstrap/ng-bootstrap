import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Snippet } from '../../services/snippet';
import { LIB_VERSIONS } from '../../tokens';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { CodeComponent } from '../../shared/code.component';
import { NgbdPageWrapper } from '../../shared/page-wrapper/page-wrapper.component';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap/collapse';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap/alert';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [PageHeaderComponent, CodeComponent, NgbCollapse, NgbAlert, NgbdPageWrapper],
	templateUrl: './getting-started.page.html',
})
export class GettingStartedPage {
	bootstrapVersion = inject(LIB_VERSIONS).bootstrap;

	instructionsCollapsed = signal(true);
	olderVersionsCollapsed = signal(true);

	schematics = Snippet({
		lang: 'text',
		code: `ng add @ng-bootstrap/ng-bootstrap`,
	});

	schematicsProject = Snippet({
		lang: 'text',
		code: `ng add @ng-bootstrap/ng-bootstrap --project myProject`,
	});

	bootstrapScss = Snippet({
		lang: 'css',
		code: `
      @import "bootstrap/scss/bootstrap";
      /*
      or import only the bootstrap scss files that your application actually needs,
      as described in the Bootstrap customization guide:
      https://getbootstrap.com/docs/5.3/customize/sass/#importing
      */
		`,
	});

	bootstrapCssAngularJson = Snippet({
		lang: 'typescript',
		code: `
      "yourApp": {
        "architect": {
          "build": {
            "options": {
              "styles": [
                "node_modules/bootstrap/dist/css/bootstrap.min.css"
              ]
            }
          }
        }
      }
    `,
	});

	bootstrapInstall = Snippet({
		lang: 'text',
		code: `npm install bootstrap`,
	});

	codeInstall = Snippet({
		lang: 'text',
		code: `npm install @ng-bootstrap/ng-bootstrap`,
	});

	popperInstall = Snippet({
		lang: 'text',
		code: `npm install @popperjs/core`,
	});

	polyfillInstall = Snippet({
		lang: 'text',
		code: `ng add @angular/localize`,
	});

	codeRoot = Snippet({
		lang: 'typescript',
		code: `
      import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

      @NgModule({
        imports: [NgbModule],
      })
      export class YourAppModule {
      }
    `,
	});

	codeOther = Snippet({
		lang: 'typescript',
		code: `
      import { NgbAlert } from '@ng-bootstrap/ng-bootstrap/alert';
      import { NgbPagination,
	NgbPaginationEllipsis,
	NgbPaginationFirst,
	NgbPaginationLast,
	NgbPaginationNext,
	NgbPaginationNumber,
	NgbPaginationPrevious,
	NgbPaginationPages, } from '@ng-bootstrap/ng-bootstrap/pagination';

      @NgModule({
        imports: [NgbPagination,
	NgbPaginationEllipsis,
	NgbPaginationFirst,
	NgbPaginationLast,
	NgbPaginationNext,
	NgbPaginationNumber,
	NgbPaginationPrevious,
	NgbPaginationPages,, NgbAlert],
      })
      export class YourAppModule {
      }
    `,
	});

	codeStandalone = Snippet({
		lang: 'typescript',
		code: `
      import { NgbAlert } from '@ng-bootstrap/ng-bootstrap/alert';

      @Component({
        selector: 'app-product',
        imports: [NgbAlert],
        templateUrl: './product.component.html'
      })
      export class ProductComponent {
      }
    `,
	});
}
