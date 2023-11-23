import { DebugElement } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

export function createGenericTestComponent<T>(
	html: string,
	type: { new (...args: any[]): T },
	detectChanges = true,
): ComponentFixture<T> {
	TestBed.overrideComponent(type, { set: { template: html } });
	const fixture = TestBed.createComponent(type);
	if (detectChanges) {
		fixture.detectChanges();
	}
	return fixture as ComponentFixture<T>;
}

export function isBrowserVisible(suiteName: string) {
	if (document.hidden) {
		console.warn(`${suiteName} tests were skipped because browser tab running these tests is hidden or inactive`);
		return false;
	}
	return true;
}

export function triggerEvent(element: DebugElement | HTMLElement, eventName: string) {
	const evt = new Event(eventName, { bubbles: true, cancelable: false });
	(element instanceof DebugElement ? element.nativeElement : element).dispatchEvent(evt);
}
