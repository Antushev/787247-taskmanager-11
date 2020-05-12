import {createElement} from './../utils.js';

const createFilterTemplate = (name, count) => {
  return (
    `<input
      type="radio"
      id="filter__all"
      class="filter__input visually-hidden"
      name="filter"
      checked
    />
    <label for="filter__all" class="filter__label">
      ${name} <span class="filter__all-count">${count}</span></label>`
  );
};

const createFiltersMarkup = (filters) => {
  return filters
    .map((filter) => {
      return createFilterTemplate(filter.title, filter.count);
    }).join(``);
};

const createFiltersTemplate = (filters) => {
  return (
    `<section class="main__filter filter container">
        ${createFiltersMarkup(filters)}
      </section>`
  );
};

export default class Filters {
  constructor(filters) {
    this._filters = filters;

    this._element = null;
  }

  getTemplate() {
    return createFiltersTemplate(this._filters);
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

