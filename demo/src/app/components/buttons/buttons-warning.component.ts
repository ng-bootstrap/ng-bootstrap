import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'ngbd-buttons-warning',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ngb-alert type="danger" [dismissible]="false" class="mb-5 d-flex flex-row">
      <div class="me-2">
        <svg:svg ngbdIcon="lightbulb" fill="currentColor" />
      </div>
      <div>
        Button directives are deprecated since version <span class="badge bg-info text-dark">12.0.0</span>
        and will be removed in <span class="badge bg-info text-dark">13.0.0</span>.
        Please use <a routerLink="/components/buttons/overview" fragment="bootstrap-5">native Angular code </a> as a more flexible alternative.
      </div>
    </ngb-alert>
  `
})
export class NgbdButtonsWarningComponent {
}
