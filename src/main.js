import {render, RenderPosition} from './utils.js';

import TaskBoardBlockComponent from './components/task-board.js';
// import TaskEditComponent from './components/task-edit.js';
import TaskComponent from './components/task.js';
import ButtonLoadMoreComponent from './components/load-more.js';

import BoardComponent from './components/board.js';
import MenuComponent from './components/menu.js';
import SortComponent from './components/sort.js';
import FiltersComponent from './components/filters.js';

import {generateTasks} from './mocks/task.js';
import {generateFilters} from './mocks/filters.js';

const TASKS_NUMBER = 20;
const TASKS_LOAD_COUNT = 8;
let tasksStartCount = 0;

const tasks = generateTasks(TASKS_NUMBER);
// const taskEdit = generateTask();
const filters = generateFilters(tasks);

const mainPage = document.querySelector(`.main`);
const mainMenu = mainPage.querySelector(`.main__control`);

render(mainMenu, new MenuComponent().getElement(), RenderPosition.BEFOREEND);
render(mainPage, new FiltersComponent(filters).getElement(), RenderPosition.BEFOREEND);
const boardComponent = new BoardComponent();
render(mainPage, boardComponent.getElement(), RenderPosition.BEFOREEND);

const renderTasks = (allTasks, boardTasks) => {
  const tasksRender = allTasks.slice(tasksStartCount, tasksStartCount + TASKS_LOAD_COUNT);
  tasksRender.forEach((task) => {
    renderTask(task, boardTasks);
  });

  tasksStartCount = tasksStartCount + TASKS_LOAD_COUNT;
};
const renderBoard = (allTasks, boardMainComponent) => {
  const mainTasksBlock = boardMainComponent.getElement();
  render(mainTasksBlock, new SortComponent().getElement(), RenderPosition.BEFOREEND);
  render(mainTasksBlock, new TaskBoardBlockComponent().getElement(), RenderPosition.BEFOREEND);
  render(mainTasksBlock, new ButtonLoadMoreComponent().getElement(), RenderPosition.BEFOREEND);

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
  render(tasksList, new TaskComponent(task).getElement(), RenderPosition.BEFOREEND);
};

const init = () => {
  renderBoard(tasks, boardComponent);
};

init();
