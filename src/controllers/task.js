import {Keys} from '../utils/common.js';
import {render, replace} from '../utils/render';

import TaskComponent from '../components/task';
import TaskEditComponent from '../components/task-edit';

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`
};

export default class TaskController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._mode = Mode.DEFAULT;

    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._taskComponent = null;
    this._taskEditComponent = null;
    this._onEscapeKeyDown = this._onEscapeKeyDown.bind(this);
  }

  render(task) {
    const oldTaskComponent = this._taskComponent;
    const oldTaskEditComponent = this._taskEditComponent;

    this._taskComponent = new TaskComponent(task);
    this._taskEditComponent = new TaskEditComponent(task);

    const onButtonSubmitClick = () => {
      this._replaceEditToTask();

      document.removeEventListener(`keydown`, this._onEscapeKeyDown);
      this._taskEditComponent.removeSubmitClickHandler(onButtonSubmitClick);
      this._taskComponent.setEditClickHandler(onEditTaskToEdit);
    };
    const onEditTaskToEdit = () => {
      this._replaceTaskToEdit();

      document.addEventListener(`keydown`, this._onEscapeKeyDown);
      this._taskEditComponent.setSubmitClickHandler(onButtonSubmitClick);
    };

    this._taskComponent.setEditClickHandler(onEditTaskToEdit);

    this._taskComponent.setArchiveClickHandler(() => {
      this._onDataChange(this, task, Object.assign({}, task, {
        isArchive: !task.isArchive
      }));
    });

    this._taskComponent.setFavoritesClickHandler(() => {
      this._onDataChange(this, task, Object.assign({}, task, {
        isFavorite: !task.isFavorite
      }));
    });

    if (oldTaskComponent && oldTaskEditComponent) {
      replace(this._taskComponent, oldTaskComponent);
      replace(this._taskEditComponent, oldTaskEditComponent);
    } else {
      render(this._container, this._taskComponent);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToTask();
    }
  }

  _replaceTaskToEdit() {
    this._onViewChange();
    replace(this._taskEditComponent, this._taskComponent);
    this._mode = Mode.EDIT;
  }

  _replaceEditToTask() {
    replace(this._taskComponent, this._taskEditComponent);
    this._taskEditComponent.reset();
    this._mode = Mode.DEFAULT;
  }

  _onEscapeKeyDown(evt) {
    const isEscapePressed = evt.key === Keys.ESCAPE || evt.key === Keys.ESC;

    if (isEscapePressed) {
      this._replaceEditToTask();

      document.removeEventListener(`keydown`, this._onEscapeKeyDown);
    }
  }
}
