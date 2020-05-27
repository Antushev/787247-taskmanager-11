const Keys = {
  ESCAPE: `Escape`,
  ESC: `Esc`
};

const SortType = {
  DEFAULT: `default`,
  DATE_UP: `date-up`,
  DATE_DOWN: `date-down`
};

const getRandomNumber = (min, max) => {
  return Math.round(Math.random() * (max - min));
};

const getRandomElementFromArray = (elements) => {
  return elements[getRandomNumber(0, elements.length - 1)];
};

export {getRandomNumber, getRandomElementFromArray, Keys, SortType};
