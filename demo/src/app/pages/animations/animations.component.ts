import {Component} from '@angular/core';
import {Snippet} from '../../shared/code/snippet';
import {versions} from '../../../environments/versions';

@Component({templateUrl: './animations.component.html'})
export class AnimationsPage {
  bsVersion = versions.bootstrap;

  install = Snippet({
    lang: 'bash',
    code: `npm install @ng-bootstrap/ng-bootstrap@next`
  });

  config = Snippet({
    lang: 'typescript',
    code: `
    import {NgbConfig} from '@ng-bootstrap/ng-bootstrap';

    export class AppComponent {
      constructor(ngbConfig: NgbConfig) {
        ngbConfig.animation = false;
      }
    }
    `
  });

  widgetConfig = Snippet({
    lang: 'typescript',
    code: `
    import {NgbAlertConfig} from '@ng-bootstrap/ng-bootstrap';

    export class AppComponent {
      constructor(ngbAlertConfig: NgbAlertConfig) {
        ngbAlertConfig.animation = false;
      }
    }
    `
  });

  widget = Snippet({
    lang: 'html',
    code: `
    <ngb-alert [animation]="false">
      No animation for this alert
    </ngb-alert>
    `
  });

  alert = Snippet({lang: 'html', code: `<ngb-alert *ngIf="isOpen" (closed)="isOpen = false">I'm open</ngb-alert>`});
}
