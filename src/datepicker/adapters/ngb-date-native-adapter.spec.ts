import {NgbDateNativeAdapter} from './ngb-date-native-adapter';

describe('ngb-date-native model adapter', () => {
  let adapter: NgbDateNativeAdapter;

  beforeEach(() => { adapter = new NgbDateNativeAdapter(); });

  describe('fromModel', () => {

    it('should convert invalid and incomplete values to null', () => {
      expect(adapter.fromModel(null)).toBeNull();
      expect(adapter.fromModel(undefined)).toBeNull();
      expect(adapter.fromModel(<any>'')).toBeNull();
      expect(adapter.fromModel(<any>'s')).toBeNull();
      expect(adapter.fromModel(<any>2)).toBeNull();
      expect(adapter.fromModel(<any>{})).toBeNull();
      expect(adapter.fromModel(<any>{year: 2017, month: 10})).toBeNull();
    });

    it('should convert valid date',
       () => { expect(adapter.fromModel(new Date(2016, 4, 1))).toEqual({year: 2016, month: 5, day: 1}); });
  });

  describe('toModel', () => {

    it('should convert invalid and incomplete values to null', () => {
      expect(adapter.toModel(null)).toBeNull();
      expect(adapter.toModel(undefined)).toBeNull();
      expect(adapter.toModel(<any>'')).toBeNull();
      expect(adapter.toModel(<any>'s')).toBeNull();
      expect(adapter.toModel(<any>2)).toBeNull();
      expect(adapter.toModel(<any>{})).toBeNull();
      expect(adapter.toModel(<any>new Date())).toBeNull();
    });

    it('should convert a valid date',
       () => { expect(adapter.toModel({year: 2016, month: 10, day: 15})).toEqual(new Date(2016, 9, 15)); });
  });

});
