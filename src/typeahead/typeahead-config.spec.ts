import {NgbTypeaheadConfig} from './typeahead-config';

describe('ngb-typehead-config', () => {
  it('should have sensible default values', () => {
    const config = new NgbTypeaheadConfig();

    expect(config.showHint).toBe(false);
  });
});
