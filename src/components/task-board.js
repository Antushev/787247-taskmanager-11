import {createElement} from './../utils.js';

const createTaskBoardTemplate = () => {
  return (
    `<div class="board__tasks"></div>`
  );
};

export default class TaskBoard {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createTaskBoardTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
