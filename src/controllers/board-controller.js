import {remove, render, replace} from "../utils/render";
import NoTasksComponent from "../components/no-tasks";
import SortComponent from "../components/sort";
import TaskBoardBlockComponent from "../components/task-board";
import ButtonLoadMoreComponent from "../components/load-more";
import TaskComponent from "../components/task";
import TaskEditComponent from "../components/task-edit";

const TASKS_LOAD_COUNT = 8;
let tasksStartCount = 0;

const renderTasks = (allTasks, boardTasks) => {
  const tasksRender = allTasks.slice(tasksStartCount, tasksStartCount + TASKS_LOAD_COUNT);

  tasksRender.forEach((task) => {
    renderTask(task, boardTasks);
  });

  tasksStartCount = tasksStartCount + TASKS_LOAD_COUNT;
};

const renderBoard = (allTasks, boardMainComponent) => {
  const mainTasksBlock = boardMainComponent.getElement();
  const areAllTasksArchived = allTasks.every((task) => {
    return task.isArchive;
  });
  if (areAllTasksArchived) {
    render(mainTasksBlock, new NoTasksComponent().getElement());
    return;
  }

  render(mainTasksBlock, new SortComponent());

  const boardTasks = new TaskBoardBlockComponent();
  render(mainTasksBlock, boardTasks);

  const loadMoreButtonComponent = new ButtonLoadMoreComponent();
  render(mainTasksBlock, loadMoreButtonComponent);

  renderTasks(allTasks, boardTasks.getElement());

  const onButtonLoadMoreClick = () => {
    renderTasks(allTasks, boardTasks);
    if (tasksStartCount >= allTasks.length) {
      remove(loadMoreButtonComponent);
      loadMoreButtonComponent.removeClickHandler(onButtonLoadMoreClick);
    }
  };
  loadMoreButtonComponent.setClickHandler(onButtonLoadMoreClick);
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

export default class BoardController {
  constructor(container) {
    this._container = container;
  }

  render(tasks) {
    renderBoard(tasks, this._container);
  }
}
