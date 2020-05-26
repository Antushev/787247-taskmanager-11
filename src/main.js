import {render} from './utils/render.js';

import BoardComponent from './components/board.js';
import MenuComponent from './components/menu.js';
import FiltersComponent from './components/filters.js';

import Board from './controllers/board.js';

import {generateTasks} from './mocks/task.js';
import {generateFilters} from './mocks/filters.js';

const TASKS_NUMBER = 40;

const tasks = generateTasks(TASKS_NUMBER);
const filters = generateFilters(tasks);

const mainPage = document.querySelector(`.main`);
const mainMenu = mainPage.querySelector(`.main__control`);
const boardComponent = new BoardComponent();

const boardController = new Board(boardComponent.getElement());

const renderMainBlocks = () => {
  render(mainMenu, new MenuComponent());
  render(mainPage, new FiltersComponent(filters));
  render(mainPage, boardComponent);
};

const init = () => {
  renderMainBlocks();

  boardController.render(tasks);
};

init();
