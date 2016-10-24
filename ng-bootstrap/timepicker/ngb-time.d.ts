export declare class NgbTime {
    hour: number;
    minute: number;
    second: number;
    constructor(hour?: number, minute?: number, second?: number);
    changeHour(step?: number): void;
    updateHour(hour: number): void;
    changeMinute(step?: number): void;
    updateMinute(minute: number): void;
    changeSecond(step?: number): void;
    updateSecond(second: number): void;
    isValid(checkSecs?: boolean): boolean;
    toString(): string;
}
