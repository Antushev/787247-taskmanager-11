import {taskBoard} from './components/task-board.js';
import {createTaskEditTemplate} from './components/task-edit.js';
import {createTaskTemplate} from './components/task.js';
import {generateTask, generateTasks} from './mocks/task.js';
import {createButtonLoadMore} from './components/load-more.js';

import {createFiltersTemplate} from './components/filters.js';
import {generateFilters} from './mocks/filters.js';

import {menu} from './components/menu.js';
import {board} from './components/board.js';
import {sort} from './components/sort.js';

const TASKS_NUMBER = 20;
const TASKS_LOAD_COUNT = 8;
let tasksStartCount = 0;

const tasks = generateTasks(TASKS_NUMBER);
const taskEdit = generateTask();

const mainPage = document.querySelector(`.main`);
const mainMenu = mainPage.querySelector(`.main__control`);

const render = (container, markup, position = `beforeend`) => {
  container.insertAdjacentHTML(position, markup);
};

const renderMainBlocks = (mainMenuSite, mainPageSite) => {
  const filters = generateFilters(tasks);

  render(mainMenuSite, menu());
  render(mainPageSite, createFiltersTemplate(filters));
  render(mainPageSite, board());
};

const renderBoard = (mainBoard) => {
  render(mainBoard, sort());
  render(mainBoard, taskBoard());
};

const renderTaskEdit = (taskEditBoard, boardTasks) => {
  render(boardTasks, createTaskEditTemplate(taskEditBoard));
};

const renderTasks = (allTasks, boardTasks) => {
  const tasksRender = allTasks.slice(tasksStartCount, tasksStartCount + TASKS_LOAD_COUNT);
  tasksRender.forEach((item) => {
    render(boardTasks, createTaskTemplate(item));
  });

  tasksStartCount = tasksStartCount + TASKS_LOAD_COUNT;
};

const renderButtonLoadMore = (boardTasks) => {
  render(boardTasks, createButtonLoadMore());
};

const init = () => {
  renderMainBlocks(mainMenu, mainPage);

  const mainBoard = document.querySelector(`.board`);
  renderBoard(mainBoard);

  const boardTasks = mainBoard.querySelector(`.board__tasks`);
  renderTaskEdit(taskEdit, boardTasks);
  renderTasks(tasks, boardTasks, tasksStartCount);

  renderButtonLoadMore(mainBoard);
  const buttonLoadMore = mainBoard.querySelector(`.load-more`);
  const onButtonLoadMoreClick = () => {
    renderTasks(tasks, boardTasks);
    if (tasksStartCount >= TASKS_NUMBER) {
      buttonLoadMore.remove();
      buttonLoadMore.removeEventListener(`click`, onButtonLoadMoreClick);
    }
  };
  buttonLoadMore.addEventListener(`click`, onButtonLoadMoreClick);
};

init();
