import { Component } from '@angular/core';
import { Snippet } from '../../services/snippet';
import { NgbdCodeComponent } from '../../shared/code/code.component';
import { NgbdPageWrapper } from '../../shared/page-wrapper/page-wrapper.component';
import { RouterLink } from '@angular/router';
import { NgbdApiDocsBadge } from '../../shared/api-docs';
import { NgbdPageHeaderComponent } from '../../shared/page-wrapper/page-header.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	standalone: true,
	imports: [
		NgbdCodeComponent,
		NgbdPageWrapper,
		RouterLink,
		NgbdApiDocsBadge,
		NgbdPageHeaderComponent,
		NgbTooltipModule,
	],
	templateUrl: './positioning.component.html',
})
export class PositioningPage {
	rightExample = Snippet({
		lang: 'html',
		code: `<button ngbTooltip="I'll always open to the right" placement="right">Hover me</button>`,
	});

	rtl = Snippet({
		lang: 'html',
		code: `
      <!-- RIGHT placement -->
      <button ngbTooltip="..." placement="right"></button>

      <!-- END placement -->
      <button ngbTooltip="..." placement="end"></button>
    `,
	});

	placement = Snippet({
		lang: 'html',
		code: `
      <!-- tooltip will be positioned automatically to fit in the viewport -->
      <button ngbTooltip="..."></button>

      <!-- tooltip will always be on the right, even if it doesn't fit -->
      <button ngbTooltip="..." placement="right"></button>

      <!-- tooltip be on the left. If it doesn't fit, it will be on the right -->
      <button ngbTooltip="..." placement="left right"></button>

      <!-- you can also provide an array of strings -->
      <button ngbTooltip="..." [placement]="['left', 'right']"></button>
    `,
	});

	auto = Snippet({
		lang: 'html',
		code: `
      <!-- tooltip will be positioned in the "auto" preference order -->
      <button ngbTooltip="..." placement="auto"></button>

      <!-- tooltip will be positioned on the left. If it doesn't fit, it will follow the "auto" order -->
      <button ngbTooltip="..." placement="left auto"></button>
    `,
	});

	container = Snippet({
		lang: 'html',
		code: `
      <!-- tooltip will be attached next to the <button> element -->
      <button ngbTooltip="..."></button>

      <!-- tooltip will be attached as a last child of the <body> element -->
      <button ngbTooltip="..." container="body"></button>
    `,
	});

	dropdown = Snippet({
		lang: 'html',
		code: `
      <!-- Dropdown menu will be positioned dynamically, even if inside navbar -->
      <div ngbDropdown display="dynamic"></div>
    `,
	});
}
