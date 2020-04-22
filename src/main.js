import {siteMenuTemplate} from './components/siteMenuTemplate.js';
import {siteFilterTemplate} from './components/siteFilterTemplate.js';
import {siteBoardTemplate} from './components/siteBoardTemplate.js';
import {siteBoardFilterTemplate} from './components/siteBoardFilterTemplate.js';
import {siteBoardFormTemplate} from './components/siteBoardFormTemplate.js';
import {siteBoardTasks} from './components/siteBoardTasks.js';
import {siteCardTask} from './components/siteCardTask.js';

const TASKS_NUMBER = 3;

const mainPage = document.querySelector(`.main`);
const mainMenu = mainPage.querySelector(`.main__control`);

const render = (container, markup, position = `beforeend`) => {
  container.insertAdjacentHTML(position, markup);
};

const renderMainBlocks = () => {
  render(mainMenu, siteMenuTemplate());
  render(mainPage, siteFilterTemplate());
  render(mainPage, siteBoardTemplate());
};

const renderBoard = () => {
  render(mainBoard, siteBoardFilterTemplate());
  render(mainBoard, siteBoardTasks());
};

const renderTasks = () => {
  render(boardTasks, siteBoardFormTemplate());
  for (let i = 0; i < TASKS_NUMBER; i++) {
    render(boardTasks, siteCardTask());
  }
};

renderMainBlocks();

const mainBoard = document.querySelector(`.board`);
renderBoard();

const boardTasks = mainBoard.querySelector(`.board__tasks`);
renderTasks();
