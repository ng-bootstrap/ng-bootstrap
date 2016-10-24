import { NgbModalRef } from './modal-ref';
import { NgbModalContainer } from './modal-container';
export declare class NgbModalStack {
    private modalContainer;
    open(content: any, options?: {}): NgbModalRef;
    registerContainer(modalContainer: NgbModalContainer): void;
}
