import { rnd, zeropad, getAgeFromFrn, getRandomDateInRange } from "./utils";

export type BinaryGender = "male" | "female";

export interface FnrInfo {
  age: number;
  gender: BinaryGender;
  fnr: string;
}

const CONTROL_SEQUENCE_1 = [3, 7, 6, 1, 8, 9, 4, 5, 2, 1];
const CONTROL_SEQUENCE_2 = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2, 1];

/**
 * Odd hundreds = is between 0 and 499, even are between 500 and 999
 * 1929 = 900 = odd -> 0,499
 * 2000 = 0 = even -> 500, 999
 */
export const generateINumber = (year: number): string => {
  const number = year < 2000 ? rnd(0, 499) : rnd(500, 999);
  return number.toString().padStart(3, "0");
};

/**
 * Multiply digits with control sequence one, if the product is divisible by 11, the digit is valid
 * @param dateAndINumber string
 */
export const createControlDigitOne = (
  dateAndINumber: string,
): number | null => {
  for (let i = 0; i < 10; i++) {
    const possibleDigit = i;
    const numberWithPossibleDigit = `${dateAndINumber}${possibleDigit}`
      .split("")
      .map(Number);
    const checksum = CONTROL_SEQUENCE_1.reduce(
      (a, b, i) => a + b * numberWithPossibleDigit[i],
      0,
    );
    if (checksum % 11 === 0) return possibleDigit;
  }

  console.debug(
    "Could not generate control digit one for number:",
    dateAndINumber,
  );

  return null;
};

/**
 * Multiply digits with control sequence two, if the product is divisible by 11, the digit is valid
 * @param dateAndINumber
 * @param controlDigitOne
 */
export const createControlDigitTwo = (
  dateAndINumber: string,
  controlDigitOne: number | null,
): number | null => {
  if (controlDigitOne === null) return null;

  const dateWithControlDigitOne = `${dateAndINumber}${controlDigitOne}`;

  for (let i = 0; i < 10; i++) {
    const possibleDigit = i;
    const numberWithPossibleDigit = `${dateWithControlDigitOne}${possibleDigit}`
      .split("")
      .map(Number);
    const checksum = CONTROL_SEQUENCE_2.reduce(
      (a, b, i) => a + b * numberWithPossibleDigit[i],
      0,
    );
    if (checksum % 11 === 0) return possibleDigit;
  }

  console.debug(
    "Could not generate control digit two for number:",
    dateWithControlDigitOne,
  );

  return null;
};

const generate = (min: Date, max: Date) => {
  const date = getRandomDateInRange(min, max);
  const year = date.getFullYear();
  const datestring = `${zeropad(date.getDate())}${zeropad(
    date.getMonth() + 1,
  )}${zeropad(date.getFullYear().toString().substring(2, 4))}`;

  let iNumber = "";
  let controlDigitOne;
  let controlDigitTwo;
  let foundNumber = false;
  let retries = 0;
  while (!foundNumber && retries < 20) {
    retries++;
    iNumber = generateINumber(year);
    const dateAndINumber = `${datestring}${iNumber}`;
    controlDigitOne = createControlDigitOne(dateAndINumber);
    controlDigitTwo = createControlDigitTwo(dateAndINumber, controlDigitOne);
    foundNumber = controlDigitOne !== null && controlDigitTwo !== null;
  }

  if (!foundNumber) {
    console.debug(
      `Could not generate control digits for ${datestring} ${iNumber}`,
    );
    return null;
  }

  return `${datestring}${iNumber}${controlDigitOne}${controlDigitTwo}`;
};

export const generator = (
  minAge: number,
  maxAge: number,
  count: number,
): FnrInfo[] => {
  const fnrs: FnrInfo[] = [];
  const now = new Date();
  const birthdateRangeStart =
    minAge === 0
      ? now
      : new Date(now.getFullYear() - minAge, now.getMonth(), now.getDate());
  const birthdateRangeEnd = new Date(
    now.getFullYear() - maxAge,
    now.getMonth(),
    now.getDate(),
  );

  for (let i = 0; i < count; i++) {
    const fnr = generate(birthdateRangeStart, birthdateRangeEnd);
    if (fnr === null) continue;
    const gender = Number(fnr.split("")[8]) % 2 ? "male" : "female";
    const age = getAgeFromFrn(fnr);
    fnrs.push({ age, gender, fnr });
  }

  return fnrs;
};

export default generator;
