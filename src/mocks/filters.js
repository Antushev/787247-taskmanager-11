const filters = [
  {title: `all`, count: 0},
  {title: `overdue`, count: 0},
  {title: `today`, count: 0},
  {title: `favorites`, count: 0},
  {title: `repeating`, count: 0},
  {title: `archive`, count: 0}
];

const additionTaskInFilter = (filter) => {
  for (const value of filters) {
    if (value.title === filter) {
      value.count++;
      break;
    }
  }
};

const additionTaskInFilters = (tasks) => {
  const dateNow = new Date();
  tasks.forEach((task) => {
    if (dateNow > task.dueDate) {
      additionTaskInFilter(`overdue`);
    }
    if (dateNow.getDay() === task.dueDate.getDay()) {
      additionTaskInFilter(`today`);
    }
    if (task.isFavorite) {
      additionTaskInFilter(`favorites`);
    }
    if (Object.values(task.repeatingDays).some(Boolean)) {
      additionTaskInFilter(`repeating`);
    }
    if (task.isArchive) {
      additionTaskInFilter(`archive`);
    }
  });
};

const generateFilters = (tasks) => {
  filters[0].count = tasks.length;
  additionTaskInFilters(tasks);
  return filters;
};

export {generateFilters};
