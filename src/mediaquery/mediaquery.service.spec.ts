import {TestBed} from '@angular/core/testing';

import {NgbMediaQueryModule, NgbMediaQuery} from './mediaquery.module';

class FakeWindow {
  document = {documentElement: {clientWidth: 1299}};

  innerWidth = 1300;

  listeners: Array<() => {}> = [];

  addEventListener(event: string, listener: () => {}) {
    if (event !== 'resize') {
      throw new Error('Fake window only accepts resize listeners');
    }
    this.listeners.push(listener);
  }

  resize(width: number) {
    this.innerWidth = width;
    this.document.documentElement.clientWidth = width - 1;
    this.listeners.forEach(listener => listener());
  }
}

describe('ngb-media-query', () => {

  describe('basic functionality', () => {

    let fakeWindow: FakeWindow;
    let mediaQuery: NgbMediaQuery;

    beforeEach(() => {
      fakeWindow = new FakeWindow();
      mediaQuery = new NgbMediaQuery();
      mediaQuery.setWindow(fakeWindow);
    });

    it('should use real window by default', () => {
      let value: string;

      mediaQuery.get().subscribe(v => value = v);

      expect(['xs', 'sm', 'md', 'lg', 'xl'].indexOf(value)).toBeGreaterThanOrEqual(0);
    });

    it('should return the current breakpoint as soon as we subscribe', () => {
      let value: string;
      mediaQuery.get().subscribe(v => value = v);
      expect(value).toBe('xl');
    });

    it('should emit a new value when the breakpoint changes', () => {
      let value: string;
      mediaQuery.get().subscribe(v => value = v);

      expect(value).toBe('xl');

      fakeWindow.resize(1200);
      expect(value).toBe('xl');

      fakeWindow.resize(1199);
      expect(value).toBe('lg');

      fakeWindow.resize(992);
      expect(value).toBe('lg');

      fakeWindow.resize(991);
      expect(value).toBe('md');

      fakeWindow.resize(768);
      expect(value).toBe('md');

      fakeWindow.resize(767);
      expect(value).toBe('sm');

      fakeWindow.resize(576);
      expect(value).toBe('sm');

      fakeWindow.resize(575);
      expect(value).toBe('xs');
    });

    it('should not emit if the breakpoint does not change', () => {
      let eventCount = 0;
      mediaQuery.get().subscribe(v => eventCount++);

      expect(eventCount).toBe(1);

      fakeWindow.resize(1250);

      expect(eventCount).toBe(1);
    });

    it('should allow configuring custom breakpoints', () => {
      mediaQuery.configure({big: 1200, medium: 800, small: 0});

      let value: string;
      mediaQuery.get().subscribe(v => value = v);

      expect(value).toBe('big');

      fakeWindow.resize(1000);
      expect(value).toBe('medium');

      fakeWindow.resize(700);
      expect(value).toBe('small');
    });
  });

  describe('NgbMediaQueryModule', () => {
    it('should provide a NgbMediaQuery service', () => {
      TestBed.configureTestingModule({imports: [NgbMediaQueryModule.forRoot()]});

      const service = TestBed.get(NgbMediaQuery);

      expect(service.get()).not.toBeNull();
    });
  });
});
