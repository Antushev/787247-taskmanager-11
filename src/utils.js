const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

const getRandomNumber = (min, max) => {
  return Math.round(Math.random() * (max - min));
};

const getRandomElementFromArray = (elements) => {
  return elements[getRandomNumber(0, elements.length - 1)];
};

const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

const render = (container, element, position) => {
  switch (position) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

export {getRandomNumber, getRandomElementFromArray, createElement, render, RenderPosition};
