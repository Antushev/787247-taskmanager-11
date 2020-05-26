import AbstractComponent from './abstract-component.js';

export default class AbstractSmartComponent extends AbstractComponent {
  recoveryListener() {
    throw new Error(`Данный метод нельзя вызывать в экземпляре абстрактного класса`);
  }

  rerender() {
    const oldElement = this.getElement();

    this.removeElement();

    const newElement = this.getElement();

    oldElement.replaceWith(newElement);

    this.recoveryListener();
  }
}
