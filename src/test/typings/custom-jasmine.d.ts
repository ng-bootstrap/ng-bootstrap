declare module jasmine {
  interface Matchers {
    toHaveCssClass(expected: any): boolean;
    toHaveModal(content?: string | string[], selector?: string): boolean;
    toHaveBackdrop(): boolean;
    toBeShown(): boolean;
  }
}
