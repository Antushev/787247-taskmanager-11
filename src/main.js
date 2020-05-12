import {render} from './utils.js';

import TaskBoardBlockComponent from './components/task-board.js';
import TaskEditComponent from './components/task-edit.js';
import TaskComponent from './components/task.js';
import ButtonLoadMoreComponent from './components/load-more.js';

import BoardComponent from './components/board.js';
import MenuComponent from './components/menu.js';
import SortComponent from './components/sort.js';
import FiltersComponent from './components/filters.js';

import NoTasksComponent from './components/no-tasks.js';

import {generateTasks} from './mocks/task.js';
import {generateFilters} from './mocks/filters.js';

const TASKS_NUMBER = 0;
const TASKS_LOAD_COUNT = 8;
let tasksStartCount = 0;

const tasks = generateTasks(TASKS_NUMBER);
const filters = generateFilters(tasks);

const mainPage = document.querySelector(`.main`);
const mainMenu = mainPage.querySelector(`.main__control`);
const boardComponent = new BoardComponent();

const renderMainBlocks = () => {
  render(mainMenu, new MenuComponent().getElement());
  render(mainPage, new FiltersComponent(filters).getElement());
  render(mainPage, boardComponent.getElement());
};

const renderTasks = (allTasks, boardTasks) => {
  const tasksRender = allTasks.slice(tasksStartCount, tasksStartCount + TASKS_LOAD_COUNT);

  tasksRender.forEach((task) => {
    renderTask(task, boardTasks);
  });

  tasksStartCount = tasksStartCount + TASKS_LOAD_COUNT;
};
const renderBoard = (allTasks, boardMainComponent) => {
  const mainTasksBlock = boardMainComponent.getElement();
  const isAllTasksArchive = tasks.every((task) => {
    return task.isArchive;
  });
  if (isAllTasksArchive) {
    render(mainTasksBlock, new NoTasksComponent().getElement());
    return;
  }

  render(mainTasksBlock, new SortComponent().getElement());
  render(mainTasksBlock, new TaskBoardBlockComponent().getElement());
  render(mainTasksBlock, new ButtonLoadMoreComponent().getElement());

  const buttonLoadMore = mainTasksBlock.querySelector(`.load-more`);

  const boardTasks = mainTasksBlock.querySelector(`.board__tasks`);
  renderTasks(tasks, boardTasks);

  const onButtonLoadMoreClick = () => {
    renderTasks(tasks, boardTasks);
    if (tasksStartCount >= TASKS_NUMBER) {
      buttonLoadMore.remove();
      buttonLoadMore.removeEventListener(`click`, onButtonLoadMoreClick);
    }
  };
  buttonLoadMore.addEventListener(`click`, onButtonLoadMoreClick);
};
const renderTask = (task, tasksList) => {
  const taskComponent = new TaskComponent(task);
  const taskEditComponent = new TaskEditComponent(task);
  const buttonEditTask = taskComponent.getElement().querySelector(`.card__btn--edit`);
  const formTaskEdit = taskEditComponent.getElement().querySelector(`form`);

  const replaceTaskToEdit = () => {
    tasksList.replaceChild(taskEditComponent.getElement(), taskComponent.getElement());
  };
  const replaceEditToTask = () => {
    tasksList.replaceChild(taskComponent.getElement(), taskEditComponent.getElement());
  };

  const onEscapeKeyDown = (evt) => {
    const isEscape = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscape) {
      replaceEditToTask();

      document.removeEventListener(`keydown`, onEscapeKeyDown);
    }
  };
  const onButtonSubmitClick = () => {
    replaceEditToTask(taskComponent.getElement(), taskEditComponent.getElement());

    document.removeEventListener(`keydown`, onEscapeKeyDown);
    formTaskEdit.removeEventListener(`click`, onButtonSubmitClick);
  };
  const onEditTaskToEdit = () => {
    replaceTaskToEdit();

    document.addEventListener(`keydown`, onEscapeKeyDown);
    formTaskEdit.addEventListener(`submit`, onButtonSubmitClick);
  };

  buttonEditTask.addEventListener(`click`, onEditTaskToEdit);

  render(tasksList, taskComponent.getElement());
};

const init = () => {
  renderMainBlocks();

  renderBoard(tasks, boardComponent);
};

init();
