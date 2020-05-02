const getRandomNumber = (min, max) => {
  return Math.round(Math.random() * (max - min));
};

const getRandomElementFromArray = (elements) => {
  return elements[getRandomNumber(0, elements.length - 1)];
};

export {getRandomNumber, getRandomElementFromArray};
