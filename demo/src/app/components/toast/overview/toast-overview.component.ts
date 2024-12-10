import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Snippet } from '../../../services/snippet';
import { RouterLink } from '@angular/router';
import { CodeComponent } from '../../../shared/code.component';
import { NgbAlertModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { PageHeaderComponent } from '../../../shared/page-header.component';
import { NgbdOverviewPage } from '../../../shared/overview-page/overview-page.class';

@Component({
	selector: 'ngbd-toast-overview',
	imports: [NgbAlertModule, NgbNavModule, RouterLink, CodeComponent, PageHeaderComponent],
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
      <!-- Using @if to toggle display (showToast = true initially) -->
      @if (showToast) {
        <ngb-toast header="I can be closed!" (hidden)="showToast = false">
          <!-- Content here -->
        </ngb-toast>
      }

      <!-- or looping over a collection of toasts with @for -->
      @for (toast of toasts; track toast; let i = $index) {
        <ngb-toast [header]="'Toast #'+index+' here!'" (hidden)="toasts.splice(i, 1)">
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
        toasts: ToastInfo[] = [];

        show(header: string, body: string) {
          this.toasts.push({ header, body });
        }
      }`,
	});

	APP_TOAST_SERVICE_REMOVE = Snippet({
		lang: 'typescript',
		code: `
      remove(toast: ToastInfo) {
        this.toasts = this.toasts.filter(t => t != toast);
      }`,
	});

	APP_TOASTS_CONTAINER_TPL = Snippet({
		lang: 'html',
		code: `
      @for (toast of toastService.toasts; track toast) {
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
        constructor(public toastService: AppToastService) {}
      }`,
	});

	CONTAINER_USAGE = Snippet({
		lang: 'html',
		code: `
      <!-- somewhere in your root component template -->
      <app-toasts aria-live="polite" aria-atomic="true"></app-toasts>`,
	});
}
