import { getRandomDateInRange } from './date-generator';

const CONTROL_DIGIT_1 = [ 3, 7, 6, 1, 8, 9, 4, 5, 2, 1 ];
const CONTROL_DIGIT_2 = [ 5, 4, 3, 2, 7, 6, 5, 4, 3, 2, 1 ];

const zeropad = (i: number | string): string => {
    return `${i}`.padStart(2, '0');
};

const rnd = (min = 0, max = 1): number => {
    return Math.floor(Math.random() * max) + min;
};

/**
 * odd hundreds = is between 0 and 499, even are between 500 and 999
 * 1929 = 900 = odd -> 0,499
 * 2000 = 0 = even -> 500, 999
 */
export const generateINumber = (year: number | string): string => {
    const number = year < 2000 ? rnd(0, 499) : rnd(500, 999);
    return number.toString().padStart(3, '0');
};

export const createControlDigitOne = (dateAndINumber: string): number | null => {
    for (let i = 0; i < 10; i++) {
        const possibleDigit = i;
        const numberWithPossibleDigit = `${dateAndINumber}${possibleDigit}`.split('').map(Number);
        const checksum = CONTROL_DIGIT_1.reduce((a, b, i) => a + b * numberWithPossibleDigit[i], 0);
        if (checksum % 11 === 0) return possibleDigit;
    }

    console.debug('could not generate control digit one for number:', dateAndINumber);

    return null;
};

export const createControlDigitTwo = (dateAndINumberAndControlDigitOne: string): number | null => {
    if (dateAndINumberAndControlDigitOne.indexOf('null') !== -1) return null;

    for (let i = 0; i < 10; i++) {
        const possibleDigit = i;
        const numberWithPossibleDigit = `${dateAndINumberAndControlDigitOne}${possibleDigit}`.split('').map(Number);
        const checksum = CONTROL_DIGIT_2.reduce((a, b, i) => a + b * numberWithPossibleDigit[i], 0);
        if (checksum % 11 === 0) return possibleDigit;
    }

    console.debug('could not generate control digit two for number:', dateAndINumberAndControlDigitOne);
    return null;
};

const generate = (min: Date, max: Date) => {
    const date = getRandomDateInRange(min, max);
    const year = date.getFullYear();
    const datestring = `${zeropad(date.getDate())}${zeropad(date.getMonth())}${zeropad(
        date.getFullYear().toString().substring(2, 4)
    )}`;
    let iNumber = '';
    let controlDigitOne;
    let controlDigitTwo;
    let foundNumber = false;
    while (!foundNumber) {
        iNumber = generateINumber(year);
        controlDigitOne = createControlDigitOne(`${datestring}${iNumber}`);
        controlDigitTwo = createControlDigitTwo(`${datestring}${iNumber}${controlDigitOne}`);
        foundNumber = controlDigitOne !== null && controlDigitTwo !== null;
    }

    return `${datestring}${iNumber}${controlDigitOne}${controlDigitTwo}`;
};

export const generator = (minAge: number, maxAge: number, count: number): string[] => {
    const fnrs: string[] = [];
    const now = new Date();
    const birthdateRangeStart =
        minAge === 0 ? now : new Date(now.getFullYear() - minAge, now.getMonth(), now.getDate());
    const birthdateRangeEnd = new Date(now.getFullYear() - maxAge, now.getMonth(), now.getDate());
    console.log(birthdateRangeStart, birthdateRangeEnd);
    for (let i = 0; i < count; i++) {
        fnrs.push(generate(birthdateRangeStart, birthdateRangeEnd));
    }

    return fnrs;
};

export default generator;
