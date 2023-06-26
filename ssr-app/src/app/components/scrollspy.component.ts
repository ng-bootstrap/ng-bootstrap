import { Component } from '@angular/core';
import { NgbScrollSpyModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'scrollspy-component',
	standalone: true,
	imports: [NgbScrollSpyModule],
	template: `
		<div class="row">
			<div class="col-4">
				<nav [ngbScrollSpyMenu]="spy" class="h-100 flex-column align-items-stretch pe-4 border-end">
					<nav class="nav nav-pills flex-column">
						<a role="button" class="nav-link" ngbScrollSpyItem="nested-1">Item 1</a>
						<nav class="nav nav-pills flex-column">
							<a role="button" class="nav-link ms-3 my-1" ngbScrollSpyItem="nested-1-1" parent="nested-1">Item 1-1</a>
						</nav>
					</nav>
				</nav>
			</div>

			<div class="col-8">
				<div
					ngbScrollSpy
					#spy="ngbScrollSpy"
					rootMargin="16px"
					class="bg-light p-3 rounded-2 mb-3"
					style="height: 300px"
				>
					<h4 ngbScrollSpyFragment="nested-1">Item 1</h4>
					<p>
						Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth
						master cleanse. Mustache cliche tempor, williamsburg carles vegan helvetica. Reprehenderit butcher retro
						keffiyeh dreamcatcher synth. Cosby sweater eu banh mi, qui irure terry richardson ex squid. Aliquip placeat
						salvia cillum iphone. Seitan aliquip quis cardigan american apparel, butcher voluptate nisi qui.
					</p>
					<h5 ngbScrollSpyFragment="nested-1-1">Item 1-1</h5>
					<p>
						Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth
						master cleanse. Mustache cliche tempor, williamsburg carles vegan helvetica. Reprehenderit butcher retro
						keffiyeh dreamcatcher synth. Cosby sweater eu banh mi, qui irure terry richardson ex squid. Aliquip placeat
						salvia cillum iphone. Seitan aliquip quis cardigan american apparel, butcher voluptate nisi qui.
					</p>
				</div>
			</div>
		</div>
	`,
})
export class ScrollSpyComponent {}
