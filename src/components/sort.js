import AbstractComponent from './abstract-component.js';
import {SORTS} from '../mocks/sort.js';

const createSortItem = (sortItem) => {
  return `<a href="#" class="board__filter" data-sort-type="${sortItem.replace(` `, `-`).toLowerCase()}">${sortItem}</a>`;
};

const createSortItems = (allSorts) => {
  return allSorts.map((sortItem) => {
    return createSortItem(sortItem);
  }).join(``);
};

const createSortTemplate = () => {
  return (
    `<div class="board__filter-list" data-sort-current="default">
        ${createSortItems(SORTS)}
    </div>`
  );
};

export default class Sort extends AbstractComponent {
  getTemplate() {
    return createSortTemplate();
  }

  setSortButtonClick(handler) {
    this.getElement().addEventListener(`click`, handler);
  }
}
