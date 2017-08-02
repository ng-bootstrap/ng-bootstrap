export declare class NgbDate {
    year: number;
    month: number;
    day: number;
    static from(date: {
        year: number;
        month: number;
        day?: number;
    }): NgbDate;
    constructor(year: number, month: number, day: number);
    equals(other: NgbDate): boolean;
    before(other: NgbDate): boolean;
    after(other: NgbDate): boolean;
    toString(): string;
}
