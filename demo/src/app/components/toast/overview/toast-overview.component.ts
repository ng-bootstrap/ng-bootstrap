import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Snippet } from '../../../services/snippet';
import { RouterLink } from '@angular/router';
import { CodeComponent } from '../../../shared/code.component';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap/alert';
import {
	NgbNavContent,
	NgbNav,
	NgbNavItem,
	NgbNavItemRole,
	NgbNavLink,
	NgbNavLinkBase,
	NgbNavOutlet,
} from '@ng-bootstrap/ng-bootstrap/nav';
import { PageHeaderComponent } from '../../../shared/page-header.component';
import { NgbdOverviewPage } from '../../../shared/overview-page/overview-page.class';

@Component({
	selector: 'ngbd-toast-overview',
	imports: [
		NgbAlert,
		NgbNavContent,
		NgbNav,
		NgbNavItem,
		NgbNavItemRole,
		NgbNavLink,
		NgbNavLinkBase,
		NgbNavOutlet,
		RouterLink,
		CodeComponent,
		PageHeaderComponent,
	],
	templateUrl: './toast-overview.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { '[class.overview]': 'true' },
})
export class NgbdToastOverviewComponent extends NgbdOverviewPage {
	TOAST_INLINE_BASIC = Snippet({
		lang: 'html',
		code: `
      <ngb-toast header="Notification header">
        Content of the notification
      </ngb-toast>`,
	});

	TOAST_INLINE_LIFECYCLE = Snippet({
		lang: 'html',
		code: `
      <!-- Using @if to toggle display (showToast is a signal with true as initial value) -->
      @if (showToast()) {
        <ngb-toast header="I can be closed!" (hidden)="showToast.set(false)">
          <!-- Content here -->
        </ngb-toast>
      }

      <!-- or looping over a collection of toasts with @for -->
      @for (toast of toasts(); track toast) {
        <ngb-toast [header]="'Toast #' + $index + ' here!'" (hidden)="removeToast(toast)">
          <!-- Content here -->
        </ngb-toast>
      }`,
	});

	APP_TOAST_SERVICE = Snippet({
		lang: 'typescript',
		code: `
      export interface ToastInfo {
        header: string;
        body: string;
        delay?: number;
      }

      @Injectable({ providedIn: 'root' })
      export class AppToastService {
        private readonly _toasts = signal<ToastInfo[]>([]);
        readonly toasts = this.toasts.asReadonly();

        show(header: string, body: string) {
          this._toasts.push({ header, body });
        }
      }`,
	});

	APP_TOAST_SERVICE_REMOVE = Snippet({
		lang: 'typescript',
		code: `
      remove(toast: ToastInfo) {
        this._toasts.update(toasts => toasts.filter(t => t != toast));
      }`,
	});

	APP_TOASTS_CONTAINER_TPL = Snippet({
		lang: 'html',
		code: `
      @for (toast of toastService.toasts(); track toast) {
        <ngb-toast
          [header]="toast.header" [autohide]="true" [delay]="toast.delay || 5000"
          (hidden)="toastService.remove(toast)"
        >{{ toast.body }}</ngb-toast>
      }
`,
	});

	APP_TOASTS_CONTAINER_STYLES = Snippet({
		lang: 'css',
		code: `
      :host {
        position: fixed;
        top: 0;
        right: 0;
        margin: 0.5em;
        z-index: 1200;
      }`,
	});

	APP_TOASTS_CONTAINER = Snippet({
		lang: 'typescript',
		code: `
      @Component({
        selector: 'app-toasts',
        template: ' ... ',
        styles: ' ... '
      })
      export class AppToastsComponent {
        readonly toastService = inject(AppToastService);
      }`,
	});

	CONTAINER_USAGE = Snippet({
		lang: 'html',
		code: `
      <!-- somewhere in your root component template -->
      <app-toasts aria-live="polite" aria-atomic="true"></app-toasts>`,
	});
}
