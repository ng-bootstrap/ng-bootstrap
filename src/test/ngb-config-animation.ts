import { Injectable } from '@angular/core';
import { NgbConfig } from '@ng-bootstrap/ng-bootstrap/config';

@Injectable()
export class NgbConfigAnimation extends NgbConfig {
	animation = true;
}
