import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    imports: [FormsModule, NgbModule],
    template: `
		<h3>Dropdown click tests</h3>
		<form>
			<div class="mb-3 row row-cols-lg-auto">
				<div class="col-12">
					<input type="text" class="form-control me-1" style="width: 100px" placeholder="before" id="before" />
				</div>

				<div class="col-12">
					<div class="input-group">
						<div ngbDropdown class="d-inline-block me-3">
							<button class="btn btn-outline-secondary" id="dropdown" ngbDropdownToggle>Choose one</button>
							<div ngbDropdownMenu aria-labelledby="dropdown">
								<a
									href
									ngbDropdownItem
									(keydown.enter)="enterKey = true"
									(click)="enterClick = true; $event.preventDefault()"
									>Enter</a
								>
								<button ngbDropdownItem (keyup.space)="spaceKey = true" (click)="spaceClick = true">Space</button>
							</div>
						</div>
					</div>
				</div>

				<div class="col-12">
					@if (spaceClick) {
						<span id="space-click" class="ms-3">SPACE-CLICK</span>
					}
					@if (enterClick) {
						<span id="enter-click" class="ms-3">ENTER-CLICK</span>
					}
					@if (enterKey) {
						<span id="enter-key" class="ms-3">ENTER-KEY</span>
					}
					@if (spaceKey) {
						<span id="space-key" class="ms-3">SPACE-KEY</span>
					}
				</div>
			</div>
		</form>
	`
})
export class DropdownClickComponent {
	enterClick = false;
	spaceClick = false;
	enterKey = false;
	spaceKey = false;
}
