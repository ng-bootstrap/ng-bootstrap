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

let trackWarningsIgnored = false;

/**
 * This function may be called by a test in order for a track-related warning
 * to be ignored and not cause a test failure, because the warning is unavoidable
 * and the code is correct.
 */
export function ignoreTrackWarnings() {
	trackWarningsIgnored = true;
}

/**
 * This function is called by the global beforeEach in test.ts in order to
 * honor the track warnings, in case the previous test has ignored them.
 */
export function honorTrackWarnings() {
	trackWarningsIgnored = false;
}

export function areTrackWarningsIgnored() {
	return trackWarningsIgnored;
}
