import {remove, render} from '../utils/render';

import NoTasksComponent from '../components/no-tasks';
import SortComponent from '../components/sort';
import TaskBoardBlockComponent from '../components/task-board';
import ButtonLoadMoreComponent from '../components/load-more';

import TaskController from './task.js';

import {SortType} from '../mocks/sort.js';

const TASKS_LOAD_COUNT = 8;
let tasksStartCount = 0;

const renderTasks = (tasks, boardTasks, onDataChange, onViewChange) => {
  const tasksRender = tasks.slice(tasksStartCount, tasksStartCount + TASKS_LOAD_COUNT);
  tasksStartCount = tasksStartCount + TASKS_LOAD_COUNT;

  return tasksRender.map((task) => {
    const taskController = new TaskController(boardTasks, onDataChange, onViewChange);
    taskController.render(task);

    return taskController;
  });
};

const sortTaskDateUp = (tasks) => {
  return tasks.slice().sort((taskCurrent, taskNext) => {
    return taskCurrent.dueDate - taskNext.dueDate;
  });
};

const sortTaskDateDown = (tasks) => {
  return tasks.slice().sort((taskCurrent, taskNext) => {
    return taskNext.dueDate - taskCurrent.dueDate;
  });
};

const sortTasks = (tasks, tasksDefault, sortType) => {
  tasksStartCount = 0;
  if (sortType === SortType.DATEUP) {
    return sortTaskDateUp(tasks);
  }

  if (sortType === SortType.DATEDOWN) {
    return sortTaskDateDown(tasks);
  }

  return tasksDefault;
};

export default class Board {
  constructor(container) {
    this._container = container;
    this._tasks = [];
    this._showingTaskControllers = [];

    this._taskBoardBlockComponent = new TaskBoardBlockComponent();
    this._sortComponent = new SortComponent();
    this._loadMoreButtonComponent = new ButtonLoadMoreComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
  }

  render(tasks) {
    this._tasks = tasks;

    const tasksDefault = this._tasks.slice();

    render(this._container, this._sortComponent);

    this._sortComponent.setSortButtonClick((evt) => {
      const sortCurrent = this._sortComponent.getElement().dataset.sortCurrent;
      const sortType = evt.target.dataset.sortType;
      if (sortType !== sortCurrent) {
        this._tasks = sortTasks(this._tasks, tasksDefault, sortType);
        this._taskBoardBlockComponent.getElement().innerHTML = ``;
        this._showingTaskControllers = renderTasks(this._tasks, this._taskBoardBlockComponent.getElement(),
            this._onDataChange, this._onViewChange);
        this._sortComponent.getElement().dataset.sortCurrent = sortType;
      }
    });

    const areAllTasksArchived = this._tasks.every((task) => {
      return task.isArchive;
    });
    if (areAllTasksArchived) {
      render(this._container, new NoTasksComponent().getElement());
      return;
    }

    render(this._container, this._taskBoardBlockComponent);


    render(this._container, this._loadMoreButtonComponent);

    this._showingTaskControllers = renderTasks(
        this._tasks,
        this._taskBoardBlockComponent.getElement(),
        this._onDataChange,
        this._onViewChange);

    const onButtonLoadMoreClick = () => {
      const newTasks = renderTasks(this._tasks,
          this._taskBoardBlockComponent.getElement(),
          this._onDataChange,
          this._onViewChange
      );
      this._showingTaskControllers = this._showingTaskControllers.concat(newTasks);

      if (tasksStartCount >= this._tasks.length) {
        remove(this._loadMoreButtonComponent);
        this._loadMoreButtonComponent.removeClickHandler(onButtonLoadMoreClick);
      }
    };

    this._loadMoreButtonComponent.setClickHandler(onButtonLoadMoreClick);
  }

  _onViewChange() {
    this._showingTaskControllers.forEach((task) => task.setDefaultView());
  }

  _onDataChange(taskController, oldData, newData) {
    const index = this._tasks.findIndex((task) => task === oldData);

    if (index === -1) {
      return;
    }

    this._tasks = [].concat(this._tasks.slice(0, index), newData, this._tasks.slice(index + 1));

    taskController.render(this._tasks[index]);
  }
}
