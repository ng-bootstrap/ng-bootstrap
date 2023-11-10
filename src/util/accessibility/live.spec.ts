import { TestBed, ComponentFixture, inject } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Live, ARIA_LIVE_DELAY, LIVE_CONTAINER } from './live';

function getLiveElement(): HTMLElement {
	return document.body.querySelector('#ngb-live')! as HTMLElement;
}

describe('LiveAnnouncer', () => {
	let live: Live;
	let fixture: ComponentFixture<TestComponent>;

	const say = () => {
		fixture.debugElement.query(By.css('button')).nativeElement.click();
	};

	const configureTestingModule = (additionalProviders?: any[]) => {
		TestBed.configureTestingModule({
			providers: [
				Live,
				{ provide: ARIA_LIVE_DELAY, useValue: null },
				...(additionalProviders ? additionalProviders : []),
			],
			imports: [TestComponent],
		});
	};

	describe('live announcer', () => {
		describe('with the default container', () => {
			beforeEach(() => configureTestingModule());

			beforeEach(inject([Live], (_live: Live) => {
				live = _live;
				fixture = TestBed.createComponent(TestComponent);
			}));

			it('should correctly update the text message and be appended as a child of the default container', () => {
				say();
				const liveElement = getLiveElement();
				expect(liveElement.parentElement?.tagName).toBe('BODY');
				expect(liveElement.textContent).toBe('test');
				expect(liveElement.id).toBe('ngb-live');
			});

			it('should remove the used element from the DOM on destroy', () => {
				say();
				live.ngOnDestroy();

				expect(getLiveElement()).toBeFalsy();
			});
		});

		describe('with an overriding container', () => {
			it('should be correctly appended as a child of the overriding container when provided', () => {
				const containerId = 'overriding-container';
				const container = document.createElement('div');
				container.id = containerId;
				document.body.appendChild(container);
				configureTestingModule([{ provide: LIVE_CONTAINER, useValue: container }]);
				fixture = TestBed.createComponent(TestComponent);

				say();
				const liveElement = getLiveElement();
				expect(liveElement.parentElement?.id).toBe(containerId);
			});
		});
	});
});

@Component({
	template: `<button (click)="say()">say</button>`,
})
class TestComponent {
	constructor(public live: Live) {}
	say() {
		this.live.say('test');
	}
}
