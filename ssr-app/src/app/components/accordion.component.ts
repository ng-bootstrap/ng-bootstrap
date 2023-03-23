import { Component } from '@angular/core';

@Component({
	selector: 'accordion-component',
	template: `
		<style>
			.custom-header::after {
				content: none;
			}
		</style>
		<div ngbAccordion>
			<div ngbAccordionItem="first" [collapsed]="false">
				<div ngbAccordionHeader class="accordion-button custom-header justify-content-between">
					<p class="m-0">First panel</p>
					<button ngbAccordionToggle class="btn btn-link p-0">Toggle first</button>
				</div>
				<div ngbAccordionCollapse>
					<div ngbAccordionBody>
						<ng-template>
							Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf
							moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod.
							Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda
							shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea
							proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim
							aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
						</ng-template>
					</div>
				</div>
			</div>
			<div ngbAccordionItem="second" [destroyOnHide]="false">
				<h2 ngbAccordionHeader>
					<button ngbAccordionButton>Toggle second</button>
				</h2>
				<div ngbAccordionCollapse>
					<div ngbAccordionBody>
						<ng-template>
							Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf
							moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod.
							Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda
							shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea
							proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim
							aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
						</ng-template>
					</div>
				</div>
			</div>
		</div>
	`,
})
export class AccordionComponent {}
