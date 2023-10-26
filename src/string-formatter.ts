import { BinaryGender } from "./fnr-generator";

const getEmojiBaby = () =>
  ["👶", "👶🏻", "👶🏼", "👶🏽", "👶🏾", "👶🏿"][Math.floor(Math.random() * 6)];
const getEmojiGirl = () =>
  ["👧", "👧🏻", "👧🏼", "👧🏽", "👧🏾", "👧🏿"][Math.floor(Math.random() * 6)];
const getEmojiBoy = () =>
  ["👦", "👦🏻", "👦🏼", "👦🏽", "👦🏾", "👦🏿"][Math.floor(Math.random() * 6)];
const getEmojiWoman = () =>
  ["👩", "👩🏻", "👩🏼", "👩🏽", "👩🏾", "👩🏿"][Math.floor(Math.random() * 6)];
const getEmojiMan = () =>
  ["👨", "👨🏻", "👨🏼", "👨🏽", "👨🏾", "👨🏿"][Math.floor(Math.random() * 6)];
const getEmojiOldMan = () =>
  ["👴", "👴🏻", "👴🏼", "👴🏽", "👴🏾", "👴🏿"][Math.floor(Math.random() * 6)];
const getEmojiOldWoman = () =>
  ["👵", "👵🏻", "👵🏼", "👵🏽", "👵🏾", "👵🏿"][Math.floor(Math.random() * 6)];

const getFemaleAgeEmoji = (age: number): string => {
  if (age < 3) {
    return getEmojiBaby();
  }
  if (age <= 18) {
    return getEmojiGirl();
  }
  if (age < 60) {
    return getEmojiWoman();
  }
  if (age < 100) {
    return getEmojiOldWoman();
  }
  return "🦖";
};

const getMaleAgeEmoji = (age: number): string => {
  if (age < 3) {
    return getEmojiBaby();
  }
  if (age < 19) {
    return getEmojiBoy();
  }
  if (age < 60) {
    return getEmojiMan();
  }
  if (age < 100) {
    return getEmojiOldMan();
  }
  return "🦖";
};

export const fnrInfoToEmojiString = (
  age: number,
  gender: BinaryGender,
  fnr: string,
): string => {
  switch (gender) {
    case "female":
      return `${getFemaleAgeEmoji(age)} - ${fnr}`;
    case "male":
      return `${getMaleAgeEmoji(age)} - ${fnr}`;
  }
};
