import {getBrowser, isBrowser} from './common';

const sampleAgents = {
  ie9: 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 7.1; Trident/5.0)',
  ie10: 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64; Trident/6.0)',
  ie11: 'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS; rv:11.0) like Gecko',
  firefox: 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.1',
  edge:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246',
  chrome: 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36',
  safari:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.75.14 (KHTML, like Gecko) Version/7.0.3 Safari/7046A194A',
  unknown: 'Something that wont match at all'
};

describe('test-tools', () => {

  describe('getBrowser()', () => {

    it('should detect browsers', () => {
      expect(getBrowser(sampleAgents.ie11)).toBe('ie11');
      expect(getBrowser(sampleAgents.ie10)).toBe('ie10');
      expect(getBrowser(sampleAgents.ie9)).toBe('ie9');
      expect(getBrowser(sampleAgents.edge)).toBe('edge');
      expect(getBrowser(sampleAgents.chrome)).toBe('chrome');
      expect(getBrowser(sampleAgents.safari)).toBe('safari');
      expect(getBrowser(sampleAgents.firefox)).toBe('firefox');
    });

    it('should crash for an unknown browser', () => { expect(() => { getBrowser(sampleAgents.unknown); }).toThrow(); });
  });

  describe('isBrowser()', () => {

    it('should match browser to the current one', () => {
      expect(isBrowser('ie9', sampleAgents.ie9)).toBeTruthy();
      expect(isBrowser('ie9', sampleAgents.ie10)).toBeFalsy();
    });

    it('should match an array of browsers to the current one', () => {
      expect(isBrowser(['ie10', 'ie11'], sampleAgents.ie9)).toBeFalsy();
      expect(isBrowser(['ie9', 'ie11'], sampleAgents.ie9)).toBeTruthy();
    });

    it('should match all ie browsers as one', () => {
      expect(isBrowser('ie', sampleAgents.ie9)).toBeTruthy();
      expect(isBrowser(['ie'], sampleAgents.ie10)).toBeTruthy();
      expect(isBrowser(['ie', 'edge'], sampleAgents.ie11)).toBeTruthy();
      expect(isBrowser('edge', sampleAgents.ie11)).toBeFalsy();
    });
  });


});
