declare module jasmine {
  interface Matchers {
    toHaveCssClass(expected: any): boolean;
    toHaveModal(content?: string | string[]): boolean;
    toHaveBackdrop(): boolean;
  }
}
