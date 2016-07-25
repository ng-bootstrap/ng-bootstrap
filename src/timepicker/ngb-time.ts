import {toInteger} from '../util/util';

export class NgbTime {
  hour: number;
  minute: number;
  second: number;

  constructor(hour?: number, minute?: number, second?: number) {
    this.hour = toInteger(hour);
    this.minute = toInteger(minute);
    this.second = toInteger(second);
  }

  changeHour(step = 1) { this.updateHour((isNaN(this.hour) ? 0 : this.hour) + step); }

  updateHour(hour: number) { this.hour = (hour < 0 ? 24 + hour : hour) % 24; }

  changeMinute(step = 1) { this.updateMinute((isNaN(this.minute) ? 0 : this.minute) + step); }

  updateMinute(minute: number) {
    this.minute = minute % 60 < 0 ? 60 + minute % 60 : minute % 60;
    this.changeHour(Math.floor(minute / 60));
  }

  changeSecond(step = 1) { this.updateSecond((isNaN(this.second) ? 0 : this.second) + step); }

  updateSecond(second: number) {
    this.second = second < 0 ? 60 + second % 60 : second % 60;
    this.changeMinute(Math.floor(second / 60));
  }

  toString() { return `${this.hour || 0}:${this.minute || 0}:${this.second || 0}`; }
}
