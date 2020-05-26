import {COLORS, MONTHS, DAYS} from './../const.js';
import AbstractComponent from './abstract-smart-component.js';

const isRepeating = (repeatingDays) => {
  return Object.values(repeatingDays).some(Boolean);
};

const colorTemplate = (color, index, currentColor) => {
  return (
    `<input
      type="radio"
      id="color-${color}-${index}"
      class="card__color-input card__color-input--${color} visually-hidden"
      name="color"
      value="${color}"
      ${currentColor === color ? `checked` : ``}
    />
    <label
      for="color-${color}-${index}"
      class="card__color card__color--${color}"
      >${color}</label
    >`
  );
};

const generateColorsTemplate = (colors, currentColor) => {
  return (
    colors.map((color, index) => {
      return colorTemplate(color, index, currentColor);
    }).join(``)
  );
};

const generateRepeatingDaysTemplate = (days, repeatingDays) => {
  return days.map((day, index) => {
    const isChecked = repeatingDays[day];
    return (
      `<input
          class="visually-hidden card__repeat-day-input"
          type="checkbox"
          id="repeat-${day}-${index}"
          name="repeat"
          value="${day}"
          ${isChecked ? `checked` : ``}
        />
        <label class="card__repeat-day" for="repeat-${day}-${index}"
          >${day}</label
        >`
    );
  })
    .join(``);
};

const createTaskEditTemplate = (taskEdit, options = {}) => {
  const {description, dueDate, color} = taskEdit;
  const {isDateShowing, isRepeatingTask, activeRepeatingDays} = options;
  const isExpired = dueDate instanceof Date && dueDate < Date.now();

  const isBlockSaveButton = (isDateShowing && isRepeatingTask) ||
    (isRepeatingTask && !!isRepeating(activeRepeatingDays));

  const date = (isDateShowing && dueDate) ? `${dueDate.getDate()} ${MONTHS[dueDate.getMonth()]}` : ``;
  const time = (isDateShowing && dueDate) ? `${dueDate.getHours()}:${dueDate.getMinutes()}` : ``;

  const repeatClass = isRepeatingTask ? `card--repeat` : ``;
  const deadlineClass = isExpired ? `card--deadline` : ``;

  const colorsMarkup = generateColorsTemplate(COLORS, `black`);
  const repeatingDaysMarkup = generateRepeatingDaysTemplate(DAYS, activeRepeatingDays);

  return (
    `<article class="card card--edit card--${color} ${repeatClass} ${deadlineClass}">
      <form class="card__form" method="get">
        <div class="card__inner">
          <div class="card__color-bar">
            <svg width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>

          <div class="card__textarea-wrap">
            <label>
              <textarea
                class="card__text"
                placeholder="Start typing your text here..."
                name="text"
              >${description}</textarea>
            </label>
          </div>

          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                <button class="card__date-deadline-toggle" type="button">
                  date: <span class="card__date-status">
                            ${isDateShowing ? `yes` : `no`}
                        </span>
                </button>
                ${isDateShowing ? `<fieldset class="card__date-deadline">
                  <label class="card__input-deadline-wrap">
                    <input
                      class="card__date"
                      type="text"
                      placeholder="23 September"
                      name="date"
                      value="${date} ${time}"
                    />
                  </label>
                </fieldset>` : ``}

                <button class="card__repeat-toggle" type="button">
                  repeat:<span class="card__repeat-status">
                        ${isRepeatingTask ? `yes` : `no`}
                        </span>
                </button>
                ${isRepeatingTask ? `<fieldset class="card__repeat-days">
                  <div class="card__repeat-days-inner">
                    ${repeatingDaysMarkup}
                  </div>
                </fieldset>` : ``}
              </div>
            </div>

            <div class="card__colors-inner">
              <h3 class="card__colors-title">Color</h3>
              <div class="card__colors-wrap">
                ${colorsMarkup}
              </div>
            </div>
          </div>

          <div class="card__status-btns">
            <button class="card__save" type="submit" ${isBlockSaveButton ? `disabled` : ``}>save</button>
            <button class="card__delete" type="button">delete</button>
          </div>
        </div>
      </form>
    </article>`
  );
};

export default class TaskEdit extends AbstractComponent {
  constructor(taskEdit) {
    super();

    this._taskEdit = taskEdit;
    this._submitHandler = null;
    this._isDateShowing = !!taskEdit.dueDate;
    this._isRepeatingTask = Object.values(taskEdit.repeatingDays).some(Boolean);
    this._activeRepeatingDays = Object.assign({}, taskEdit.repeatingDays);

    this._subscribeOnEvents();
  }

  getTemplate() {
    return createTaskEditTemplate(this._taskEdit, {
      isDateShowing: this._isDateShowing,
      isRepeatingTask: this._isRepeatingTask,
      activeRepeatingDays: this._activeRepeatingDays
    });
  }

  recoveryListener() {
    this.setSubmitClickHandler(this._submitHandler);
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();
  }

  reset() {
    const task = this._taskEdit;

    this._isDateShowing = !!task.dueDate;
    this._isRepeatingTask = Object.values(task.repeatingDays).some(Boolean);
    this._activeRepeatingDays = Object.assign({}, task.repeatingDays);

    this.rerender();
  }

  setSubmitClickHandler(handler) {
    this.getElement().querySelector(`form`).addEventListener(`submit`, handler);
    this._submitHandler = handler;
  }

  removeSubmitClickHandler(handler) {
    this.getElement().querySelector(`form`).removeEventListener(`click`, handler);
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.card__date-deadline-toggle`)
      .addEventListener(`click`, () => {
        this._isDateShowing = !this._isDateShowing;

        this.rerender();
      });

    element.querySelector(`.card__repeat-toggle`)
      .addEventListener(`click`, () => {
        this._isRepeatingTask = !this._isRepeatingTask;

        this.rerender();
      });

    const repeatDays = element.querySelector(`.card__repeat-days`);

    if (repeatDays) {
      repeatDays.addEventListener(`change`, (evt) => {
        this._activeRepeatingDays[evt.target.value] = evt.target.checked;

        this.rerender();
      });
    }
  }
}
