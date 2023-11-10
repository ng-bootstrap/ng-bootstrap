import { ElementRef } from '@angular/core';

export function getShadowRootContainerIfAny(elementRef: ElementRef): Node | null {
	const _nativeElement = elementRef.nativeElement as HTMLInputElement;
	const rootNode = _nativeElement.getRootNode();
	return rootNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? rootNode : null;
}
