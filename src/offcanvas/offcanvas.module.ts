import { NgModule } from '@angular/core';
import { NgbOffcanvasBackdrop } from './offcanvas-backdrop';
import { NgbOffcanvasPanel } from './offcanvas-panel';

export { NgbOffcanvas } from './offcanvas';
export { NgbOffcanvasConfig, NgbOffcanvasOptions } from './offcanvas-config';
export { NgbOffcanvasRef, NgbActiveOffcanvas } from './offcanvas-ref';
export { OffcanvasDismissReasons } from './offcanvas-dismiss-reasons';

@NgModule({ declarations: [NgbOffcanvasPanel, NgbOffcanvasBackdrop] })
export class NgbOffcanvasModule {}
