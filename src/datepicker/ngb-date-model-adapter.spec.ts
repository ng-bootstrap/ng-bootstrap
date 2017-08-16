import {NgbDateModelStructAdapter} from './ngb-date-model-adapter';
import {NgbDate} from './ngb-date';

describe('ngb-date model adapter', () => {
  let pf: NgbDateModelStructAdapter;

  beforeEach(() => { pf = new NgbDateModelStructAdapter(); });

  describe('modelToNgbDate', () => {

    it('should convert null undefined as null', () => {
      expect(pf.modelToNgbDate(null)).toBeNull();
      expect(pf.modelToNgbDate(undefined)).toBeNull();
    });

    it('should convert valid date', () => { expect(pf.modelToNgbDate({year: 2016, month: 5, day: 1})).toEqual(NgbDate.from({year: 2016, month: 5, day: 12})); });

    it('should do its best parsing incomplete dates',
       () => { expect(pf.modelToNgbDate({year: 2011, month: 5, day: null})).toEqual(NgbDate.from({year: 2011, month: 5, day: 1})); });
  });

  describe('ngbDateToModel', () => {

    it('should convert null and undefined as null', () => {
      expect(pf.ngbDateToModel(null)).toBe(null);
      expect(pf.ngbDateToModel(undefined)).toBe(null);
    });

    it('should convert a valid date', () => { expect(pf.ngbDateToModel(NgbDate.from({year: 2016, month: 10, day: 15}))).toBe(NgbDate.from({year: 2016, month: 10, day: 15})); });

    it('should try its best with invalid dates', () => {
      expect(pf.ngbDateToModel(NgbDate.from({year: 2016, month: 10, day: null}))).toBe(NgbDate.from({year: 2016, month: 10, day: 1}));
    });
  });

});
