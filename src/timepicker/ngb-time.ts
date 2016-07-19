export class NgbTime {
  constructor(public hour = 0, public minute = 0, public second = 0) {}

  changeHour(step = 1) { this.updateHour(this.hour + step); }

  updateHour(hour: number) { this.hour = (hour < 0 ? 24 + hour : hour) % 24; }

  changeMinute(step = 1) { this.updateMinute(this.hour * 60 + this.minute + step); }

  updateMinute(minute: number) {
    this.minute = minute < 0 ? 60 + minute % 60 : minute % 60;
    this.updateHour(Math.floor(minute / 60));
  }

  changeSecond(step = 1) { this.updateSecond(this.hour * 3600 + 60 * this.minute + this.second + step); }

  updateSecond(second: number) {
    this.second = second < 0 ? 60 + second % 60 : second % 60;
    this.updateMinute(Math.floor(second / 60));
  }

  toString() { return `${this.hour}:${this.minute}:${this.second}`; }
}
