import { Service } from '@angular/core';
import { NgbConfig } from '@ng-bootstrap/ng-bootstrap/config';

@Service({ autoProvided: false })
export class NgbConfigAnimation extends NgbConfig {
	animation = true;
}
