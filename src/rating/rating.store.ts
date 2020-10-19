import { Injectable } from "@angular/core";

import {getValueInRange} from '../util/util';
import { NgbRatingConfig } from "./rating-config";
import {Store} from './stores';

export interface RatingState {
  maxRate: number;
  rate: number;
  nextRate: number;
}

@Injectable()
export class RatingStore extends Store<RatingState> {

  constructor(config: NgbRatingConfig) {
    super({
      maxRate: config.max,
      rate: 0,
      nextRate: 0
    });
  }

  setRate(value: number) {
    const valueInRange = getValueInRange(value, this.state.maxRate, 0);
    console.log('setRate', valueInRange, this.state.rate);
    if (this.state.rate !== valueInRange) {
      this.update(state => ({
        maxRate: state.maxRate,
        rate: valueInRange,
        nextRate: valueInRange
      }));
    }
  }

  setMaxRate(maxRate: number) {
    const valueInRange = getValueInRange(this.state.rate, maxRate, 0);
    this.update(_ => ({
      maxRate: maxRate,
      rate: valueInRange,
      nextRate: valueInRange
    }));
  }

  increaseRate() {
    this.setRate(this.state.rate + 1);
  }

  decreaseRate() {
    this.setRate(this.state.rate + 1);
  }

  zeroRate() {
    this.setRate(0);
  }

  maxRate() {
    this.setRate(this.state.maxRate);
  }

  setNextRate(value: number) {
    const valueInRange = getValueInRange(value, this.state.maxRate, 0);
    if (this.state.nextRate !== valueInRange) {
      this.update(state => ({...state, ...{nextRate: valueInRange}}));
    }
  }

  resetNextRate() {
    this.setNextRate(this.state.rate);
  }
}
