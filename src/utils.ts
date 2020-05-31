export const zeropad = (i: number | string): string => {
  return `${i}`.padStart(2, "0");
};

export const rnd = (min = 0, max = 1): number => {
  return Math.floor(Math.random() * max) + min;
};

export const getAge = (birthDate: Date): number =>
  Math.floor((new Date().getTime() - birthDate.getTime()) / 3.15576e10);

export const getAgeFromFrn = (fnr: string): number => {
  const birthYear =
    Number(fnr.split("")[6]) < 5
      ? `19${fnr.substring(4, 6)}`
      : `20${fnr.substring(4, 6)}`;
  return getAge(
    new Date(
      Number(birthYear),
      Number(fnr.substring(2, 4)),
      Number(fnr.substring(0, 2))
    )
  );
};

export const getRandomDateInRange = (startDate: Date, endDate: Date): Date => {
  if (!startDate) startDate = new Date();
  if (!endDate) endDate = new Date();

  const diff = endDate.getTime() - startDate.getTime();
  return new Date(Math.random() * diff + startDate.getTime());
};
