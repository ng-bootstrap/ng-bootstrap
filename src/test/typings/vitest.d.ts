import 'vitest';

interface CustomMatchers<R = unknown> {
	toHaveCssClass: (className: string) => R;
	toHaveModal: (content?: string | string[], selector?: string) => R;
	toHaveBackdrop: () => R;
	toHaveOffcanvas: (content?: string | string[], selector?: string) => R;
	toHaveOffcanvasBackdrop: (selector?: string) => R;
	toBeShown: () => R;
}

declare module 'vitest' {
	interface Matchers<T = any> extends CustomMatchers<T> {}
}
