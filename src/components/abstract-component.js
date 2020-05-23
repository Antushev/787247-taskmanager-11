import {createElement} from '../utils/render.js';

export default class AbstractComponent {
  constructor() {
    if (new.target === AbstractComponent) {
      throw new Error(`Нельзя создать экземпляр абстрактного класса`);
    }

    this._element = null;
  }

  getTemplate() {
    throw new Error(`Данный метод нужно обязательно переопределить`);
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
