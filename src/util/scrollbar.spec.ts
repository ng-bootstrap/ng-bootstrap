import {ScrollBar} from './scrollbar';
import {noop} from 'rxjs';

describe('scrollbars', () => {
  describe('creation', () => {
    it('should create instance with valid param', () => {
      const scrollbar = new ScrollBar(document);

      expect(scrollbar).toBeDefined();
    });

    it('should create instance undefined param', () => {
      const scrollbar = new ScrollBar(undefined);

      expect(scrollbar).toBeDefined();
    });
  });

  describe('compensate', () => {
    let scrollbar: ScrollBar;
    let userSetPadding: string;

    beforeAll(() => {
      scrollbar = new ScrollBar(document);
      userSetPadding = document.body.style.paddingRight;
    });

    afterAll(() => { document.body.style.paddingRight = userSetPadding; });

    it('when scrollbars are not presents returns noop', () => {
      // measure left/right and compare with width
      spyOn(document.body, 'getBoundingClientRect').and.returnValue({ right: 5, left: 5 } as DOMRect);
      const innerWidthPropertySpy = spyOnProperty(window, 'innerWidth').and.returnValue(1);

      const converter = scrollbar.compensate();

      expect(converter).toEqual(noop);
      expect(document.body.getBoundingClientRect).toHaveBeenCalledTimes(1);
      expect(innerWidthPropertySpy).toHaveBeenCalledTimes(1);
    });

    it('when scrollbars are presents returns custom converter function', () => {
      const measurerWidth = 9;
      const windowPaddingRight = 9;
      const expectedWidth = `${measurerWidth + windowPaddingRight}px`;
      spyOn(document.body, 'getBoundingClientRect').and.returnValue({ left: 1, right: 1 } as DOMRect);
      spyOnProperty(window, 'innerWidth').and.returnValue(5);
      const element = document.createElement('div');
      spyOnProperty(element, 'clientWidth').and.returnValue(0);
      spyOnProperty(element, 'className').and.callThrough();
      spyOn(element, 'getBoundingClientRect').and.returnValue({ width: measurerWidth } as DOMRect);
      spyOn(document.body, 'appendChild').and.callThrough();
      spyOn(document.body, 'removeChild').and.callThrough();
      spyOn(document, 'createElement').and.returnValue(element);
      spyOn(window, 'getComputedStyle').and.returnValue(({
        'padding-right': `${windowPaddingRight}`
      } as unknown) as CSSStyleDeclaration);

      const compensationReverter = scrollbar.compensate();

      expect(compensationReverter).not.toEqual(noop, 'Custom converter function should be returned');
      expect(element.className).toBe('modal-scrollbar-measure');
      expect(document.body.appendChild).toHaveBeenCalledWith(element);
      expect(document.body.removeChild).toHaveBeenCalledWith(element);
      expect(document.body.style.paddingRight).toEqual(expectedWidth);
      expect(document.body.style.paddingRight).not.toEqual(userSetPadding);

      // when reverted the padding should have initial value
      compensationReverter();

      expect(document.body.style.paddingRight).toEqual(userSetPadding);
    });
  });
});
