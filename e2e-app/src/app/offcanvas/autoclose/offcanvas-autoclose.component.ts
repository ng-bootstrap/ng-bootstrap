import { ChangeDetectionStrategy, ChangeDetectorRef, Component, TemplateRef } from '@angular/core';
import { OffcanvasDismissReasons, NgbOffcanvas, NgbOffcanvasRef } from '@ng-bootstrap/ng-bootstrap';

@Component({ templateUrl: './offcanvas-autoclose.component.html', changeDetection: ChangeDetectionStrategy.OnPush })
export class OffcanvasAutoCloseComponent {
	private offcanvasRef: NgbOffcanvasRef | null = null;
	reason = '';
	options = {};

	constructor(private offcanvasService: NgbOffcanvas, private cd: ChangeDetectorRef) {}

	openOffcanvas(content?: TemplateRef<any>) {
		this.offcanvasRef = this.offcanvasService.open(content, this.options);
		this.offcanvasRef.result.then(
			() => {
				this.reason = `Closed`;
				this.cd.markForCheck();
			},
			(reason) => {
				if (reason === OffcanvasDismissReasons.BACKDROP_CLICK) {
					this.reason = 'Click';
				} else if (reason === OffcanvasDismissReasons.ESC) {
					this.reason = 'Escape';
				} else {
					this.reason = 'Other';
				}
				this.cd.markForCheck();
			},
		);
	}

	closeOffcanvas() {
		if (this.offcanvasRef) {
			this.offcanvasRef.close();
			this.offcanvasRef = null;
		}
	}

	reset() {
		this.closeOffcanvas();
		this.reason = '';
		this.options = {};
	}
}
