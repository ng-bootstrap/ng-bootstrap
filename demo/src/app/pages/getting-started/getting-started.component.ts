import {Component} from '@angular/core';
import {Snippet} from '../../shared/code/snippet';

@Component({
  templateUrl: './getting-started.component.html'
})
export class GettingStartedPage {

  bootstrapCss = Snippet({
    lang: 'css',
    code: `
      /* update your 'styles.css' with */
      @import '~bootstrap/dist/css/bootstrap.css';

      /* or your 'styles.scss' with */
      @import "~bootstrap/scss/bootstrap";
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

  polyfillInstall = Snippet({
    lang: 'bash',
    code: `ng add @angular/localize`,
  });

  codeRoot = Snippet({
    lang: 'typescript',
    code: `
      import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

      @NgModule({
        ...
        imports: [NgbModule, ...],
        ...
      })
      export class YourAppModule {
      }
    `,
  });

  codeOther = Snippet({
    lang: 'typescript',
    code: `
      import {NgbPaginationModule, NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';

      @NgModule({
        ...
        imports: [NgbPaginationModule, NgbAlertModule, ...],
        ...
      })
      export class YourAppModule {
      }
    `,
  });
}
