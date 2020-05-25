import {remove, render, replace} from '../utils/render';
import NoTasksComponent from '../components/no-tasks';
import SortComponent from '../components/sort';
import TaskBoardBlockComponent from '../components/task-board';
import ButtonLoadMoreComponent from '../components/load-more';
import TaskComponent from '../components/task';
import TaskEditComponent from '../components/task-edit';

const TASKS_LOAD_COUNT = 8;
let tasksStartCount = 0;

const renderTasks = (allTasks, boardTasks) => {
  const tasksRender = allTasks.slice(tasksStartCount, tasksStartCount + TASKS_LOAD_COUNT);

  tasksRender.forEach((task) => {
    renderTask(task, boardTasks);
  });

  tasksStartCount = tasksStartCount + TASKS_LOAD_COUNT;
};

const renderTask = (task, tasksList) => {
  const taskComponent = new TaskComponent(task);
  const taskEditComponent = new TaskEditComponent(task);

  const replaceTaskToEdit = () => {
    replace(taskEditComponent, taskComponent);
  };
  const replaceEditToTask = () => {
    replace(taskComponent, taskEditComponent);
  };

  const onEscapeKeyDown = (evt) => {
    const isEscape = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscape) {
      replaceEditToTask();

      document.removeEventListener(`keydown`, onEscapeKeyDown);
    }
  };
  const onButtonSubmitClick = () => {
    replaceEditToTask();

    document.removeEventListener(`keydown`, onEscapeKeyDown);
    taskEditComponent.removeSubmitClickHandler(onButtonSubmitClick);
    taskComponent.setEditClickHandler(onEditTaskToEdit);
  };
  const onEditTaskToEdit = () => {
    replaceTaskToEdit();

    document.addEventListener(`keydown`, onEscapeKeyDown);
    taskEditComponent.setSubmitClickHandler(onButtonSubmitClick);
  };

  taskComponent.setEditClickHandler(onEditTaskToEdit);

  render(tasksList, taskComponent);
};

const sortTasks = (tasks, tasksDefault, sortType) => {
  tasksStartCount = 0;
  if (sortType === `date-up`) {
    return tasks.slice().sort((taskCurrent, taskNext) => {
      return taskCurrent.dueDate - taskNext.dueDate;
    });
  } else if (sortType === `date-down`) {
    return tasks.slice().sort((taskCurrent, taskNext) => {
      return taskNext.dueDate - taskCurrent.dueDate;
    });
  }

  return tasksDefault;
};

export default class BoardController {
  constructor(container) {
    this._container = container;

    this._taskBoardBlockComponent = new TaskBoardBlockComponent();
    this._sortComponent = new SortComponent();
    this._loadMoreButtonComponent = new ButtonLoadMoreComponent();
  }

  render(tasks) {
    const tasksDefault = tasks.slice();

    render(this._container, this._sortComponent);

    this._sortComponent.setSortButtonClick((evt) => {
      const sortCurrent = this._sortComponent.getElement().dataset.sortCurrent;
      const sortType = evt.target.dataset.sortType;
      if (sortType !== sortCurrent) {
        tasks = sortTasks(tasks, tasksDefault, sortType);
        this._taskBoardBlockComponent.getElement().innerHTML = ``;
        renderTasks(tasks, this._taskBoardBlockComponent.getElement());
        this._sortComponent.getElement().dataset.sortCurrent = sortType;
      }
    });

    const areAllTasksArchived = tasks.every((task) => {
      return task.isArchive;
    });
    if (areAllTasksArchived) {
      render(this._container, new NoTasksComponent().getElement());
      return;
    }

    render(this._container, this._taskBoardBlockComponent);


    render(this._container, this._loadMoreButtonComponent);

    renderTasks(tasks, this._taskBoardBlockComponent.getElement());

    const onButtonLoadMoreClick = () => {
      renderTasks(tasks, this._taskBoardBlockComponent.getElement());
      if (tasksStartCount >= tasks.length) {
        remove(this._loadMoreButtonComponent);
        this._loadMoreButtonComponent.removeClickHandler(onButtonLoadMoreClick);
      }
    };

    this._loadMoreButtonComponent.setClickHandler(onButtonLoadMoreClick);
  }
}
