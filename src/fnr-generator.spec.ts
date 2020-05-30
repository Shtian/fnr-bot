import {createControlDigitOne, createControlDigitTwo, generator} from "./fnr-generator";

describe('fnr generate', () => {
    test('should return a number with 11 digits', () => {
        const res = generator(0, 120, 1);
        expect(res[0].fnr.length).toBe(11);
        console.log(res);
    });
});

describe('fnr control digits', () => {
    test('should create legal control digit 1', () => {
        const res = createControlDigitOne('311299567');
        expect(res).toBe(1);
    });

    test('should create legal control digit 2', () => {
        const res = createControlDigitTwo('3112995671');
        expect(res).toBe(5);
    });
});