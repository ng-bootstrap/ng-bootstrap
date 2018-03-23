declare module jasmine {
  interface Matchers<T> {
    toHaveCssClass(expected: any): boolean;
    toHaveModal(content?: string | string[], selector?: string): boolean;
    toHaveBackdrop(): boolean;
    toBeShown(): boolean;
  }
}
