import { Component } from '@angular/core';
import { NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	standalone: true,
	imports: [FormsModule, NgbModule, NgStyle],
	templateUrl: './tooltip-position.component.html',
})
export class TooltipPositionComponent {
	flexPosition = 'justify-content-start';
	content = 'Lorem ipsum dolor sit amet consectetur adipisicing elit.';
	fixedPositionLeft = '20px';
	fixedPositionRight = '';

	setPosition(position: 'start' | 'center' | 'end') {
		this.flexPosition = `justify-content-${position}`;
		switch (position) {
			case 'start':
				this.fixedPositionLeft = '20px';
				this.fixedPositionRight = '';
				break;
			case 'center':
				this.fixedPositionLeft = '50%';
				this.fixedPositionRight = '';
				break;
			case 'end':
				this.fixedPositionLeft = '';
				this.fixedPositionRight = '20px';
				break;
		}
	}
}
