export function getNavigationLinks(element: HTMLElement): HTMLElement[] {
	return <HTMLElement[]>Array.from(element.querySelectorAll('button'));
}

export function getYearSelect(element: HTMLElement): HTMLSelectElement {
	return element.querySelectorAll('select')[0] as HTMLSelectElement;
}
