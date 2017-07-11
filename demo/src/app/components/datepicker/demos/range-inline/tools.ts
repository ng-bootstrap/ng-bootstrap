import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

export function equals(one: NgbDateStruct, two: NgbDateStruct) {
  return one && two && two.year === one.year && two.month === one.month && two.day === one.day;
}

export function before(one: NgbDateStruct, two: NgbDateStruct) {
  if (!one || !two) {
    return false;
  }

  if (one.year === two.year) {
    if (one.month === two.month) {
      return one.day === two.day ? false : one.day < two.day;
    } else {
      return one.month < two.month;
    }
  } else {
    return one.year < two.year;
  }
}

export function after(one: NgbDateStruct, two: NgbDateStruct) {
  if (!one || !two) {
    return false;
  }
  if (one.year === two.year) {
    if (one.month === two.month) {
      return one.day === two.day ? false : one.day > two.day;
    } else {
      return one.month > two.month;
    }
  } else {
    return one.year > two.year;
  }
}
