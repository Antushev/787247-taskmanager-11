import AbstractComponent from './abstract-component.js';

const createButtonLoadMore = () => {
  return `<button class="load-more" type="button">load more</button>`;
};

export default class ButtonLoadMore extends AbstractComponent {
  getTemplate() {
    return createButtonLoadMore();
  }

  setClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }

  removeClickHandler(handler) {
    this.getElement().removeEventListener(`click`, handler);
  }
}
