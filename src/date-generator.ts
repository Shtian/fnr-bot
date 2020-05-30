export const getRandomDateInRange = (startDate: Date, endDate: Date): Date => {
  if (!startDate) startDate = new Date();
  if (!endDate) endDate = new Date();

  const diff = endDate.getTime() - startDate.getTime();
  return new Date(Math.random() * diff + startDate.getTime());
};
