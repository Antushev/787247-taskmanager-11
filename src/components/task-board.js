import AbstractComponent from './abstract-component.js';

const createTaskBoardTemplate = () => {
  return (
    `<div class="board__tasks"></div>`
  );
};

export default class TaskBoard extends AbstractComponent {
  getTemplate() {
    return createTaskBoardTemplate();
  }
}
