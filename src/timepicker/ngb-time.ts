export class NgbTime {
  constructor(public hour = 0, public minute = 0, public second = 0) {}

  changeHour(step = 1) { this.updateHour(this.hour + step); }

  updateHour(hour: number) { this.hour = (hour < 0 ? 24 + hour : hour) % 24; }

  changeMinute(step = 1) { this.updateMinute(this.minute + step); }

  updateMinute(minute: number) {
    this.minute = minute % 60 < 0 ? 60 + minute % 60 : minute % 60;
    this.changeHour(Math.floor(minute / 60));
  }

  changeSecond(step = 1) { this.updateSecond(this.second + step); }

  updateSecond(second: number) {
    this.second = second < 0 ? 60 + second % 60 : second % 60;
    this.changeMinute(Math.floor(second / 60));
  }

  toString() { return `${this.hour}:${this.minute}:${this.second}`; }
}
