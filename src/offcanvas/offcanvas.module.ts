import { NgModule } from '@angular/core';

import { NgbOffcanvas } from './offcanvas';

export { NgbOffcanvas } from './offcanvas';
export { NgbOffcanvasConfig, NgbOffcanvasOptions } from './offcanvas-config';
export { NgbOffcanvasRef, NgbActiveOffcanvas } from './offcanvas-ref';
export { OffcanvasDismissReasons } from './offcanvas-dismiss-reasons';

@NgModule({ providers: [NgbOffcanvas] })
export class NgbOffcanvasModule {}
