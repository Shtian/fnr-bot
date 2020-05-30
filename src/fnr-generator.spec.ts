import generator from "./fnr-generator";

describe('fnr-generator', () => {
    test('should return a number with 11 digits', () => {
        const res = generator();
        expect(res.length).toBe(11);
    });
});