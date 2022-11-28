import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Snippet } from '../../services/snippet';
import { versions } from '../../../environments/versions';
import { NgbdPageHeaderComponent } from '../../shared/page-wrapper/page-header.component';
import { NgbdCodeComponent } from '../../shared/code/code.component';
import { NgbdPageWrapper } from '../../shared/page-wrapper/page-wrapper.component';
import { NgbAlertModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { NgIf } from '@angular/common';

@Component({
	standalone: true,
	imports: [NgbdPageHeaderComponent, NgbdCodeComponent, NgbCollapseModule, NgbAlertModule, NgIf, NgbdPageWrapper],
	templateUrl: './getting-started.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GettingStartedPage {
	instructionsCollapsed = true;
	olderVersionsCollapsed = true;
	bsVersion = versions.bootstrap;

	schematics = Snippet({
		lang: 'bash',
		code: `ng add @ng-bootstrap/ng-bootstrap`,
	});

	schematicsProject = Snippet({
		lang: 'bash',
		code: `ng add @ng-bootstrap/ng-bootstrap --project myProject`,
	});

	bootstrapScss = Snippet({
		lang: 'css',
		code: `
      @import "bootstrap/scss/bootstrap";
      /*
      or import only the bootstrap scss files that your application actually needs,
      as described in the Bootstrap customization guide:
      https://getbootstrap.com/docs/5.2/customize/sass/#importing
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
		lang: 'bash',
		code: `npm install bootstrap`,
	});

	codeInstall = Snippet({
		lang: 'bash',
		code: `npm install @ng-bootstrap/ng-bootstrap`,
	});

	popperInstall = Snippet({
		lang: 'bash',
		code: `npm install @popperjs/core`,
	});

	polyfillInstall = Snippet({
		lang: 'bash',
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
      import { NgbPaginationModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

      @NgModule({
        imports: [NgbPaginationModule, NgbAlertModule],
      })
      export class YourAppModule {
      }
    `,
	});

	codeStandalone = Snippet({
		lang: 'typescript',
		code: `
      import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';

      @Component({
        selector: 'app-product',
        standalone: true,
        imports: [NgbAlert],
        templateUrl: './product.component.html'
      })
      export class ProductComponent {
      }
    `,
	});
}
