// create initial board
let board = {
  title: 'Board Title',
  lists: [
    { title: 'List 1', tasks: [] },
    { title: 'List 2', tasks: [] },
    { title: 'List 3', tasks: [] }
  ]
};

// DOM elements
const boardTitleEl = document.querySelector('#board-title');
const createBoardButtonEl = document.querySelector('#create-board');
const newListButtonEl = document.querySelector('#new-list');
const listsContainerEl = document.querySelector('#lists-container');

// function to create a new list
function createList() {
  const newListTitle = prompt('Enter a title for the new list:');
  if (newListTitle) {
    const newList = { title: newListTitle, tasks: [] };
    board.lists.push(newList);
    renderLists();
  }
}

// function to delete a list
function deleteList(listIndex) {
  board.lists.splice(listIndex, 1);
  renderLists();
}

// function to move a list to the left
function moveListLeft(listIndex) {
  if (listIndex > 0) {
    const currentList = board.lists[listIndex];
    board.lists.splice(listIndex, 1);
    board.lists.splice(listIndex - 1, 0, currentList);
    renderLists();
  }
}

// function to move a list to the right
function moveListRight(listIndex) {
  if (listIndex < board.lists.length - 1) {
    const currentList = board.lists[listIndex];
    board.lists.splice(listIndex, 1);
    board.lists.splice(listIndex + 1, 0, currentList);
    renderLists();
  }
}

// function to render the board title
function renderBoardTitle() {
  boardTitleEl.textContent = board.title;
}

// function to render the lists
function renderLists() {
  // clear the container
  listsContainerEl.innerHTML = '';

  // render each list
  board.lists.forEach((list, index) => {
    // create the list element
    const listEl = document.createElement('div');
    listEl.classList.add('list');

    // create the list title element
    const listTitleEl = document.createElement('h2');
    listTitleEl.classList.add('list-title');
    listTitleEl.textContent = list.title;

    // make the list title editable on double click
    listTitleEl.addEventListener('dblclick', () => {
      const newTitle = prompt('Enter a new title for the list:', list.title);
      if (newTitle) {
        list.title = newTitle;
        renderLists();
      }
    });

    // create the delete list button
    const deleteListButtonEl = document.createElement('button');
    deleteListButtonEl.classList.add('delete-list');
    deleteListButtonEl.textContent = 'X';
    deleteListButtonEl.addEventListener('click', () => {
      deleteList(index);
    });

    // create the move list left button
    const moveListLeftButtonEl = document.createElement('button');
    moveListLeftButtonEl.classList.add('move-list-left');
    moveListLeftButtonEl.textContent = '<';
    moveListLeftButtonEl.addEventListener('click', () => {
      moveListLeft(index);
    });

    // create the move list right button
    const moveListRightButtonEl = document.createElement('button');
    moveListRightButtonEl.classList.add('move-list-right');
    moveListRightButtonEl.textContent = '>';
    moveListRightButtonEl.addEventListener('click', () => {
      moveListRight(index);
    });

    // append the list title and buttons to the list element
    listEl.appendChild(listTitleEl);
    listEl.appendChild(deleteListButtonEl);
    listEl.appendChild(moveListLeftButtonEl);
    listEl.appendChild(moveListRightButtonEl);

    // create the tasks container
const tasksContainerEl = document.createElement('div');
tasksContainerEl.classList.add('tasks-container');

// render each task
list.tasks.forEach((task, taskIndex) => {
  // create the task element
  const taskEl = document.createElement('div');
  taskEl.classList.add('task');

  // create the task title element
  const taskTitleEl = document.createElement('h3');
  taskTitleEl.classList.add('task-title');
  taskTitleEl.textContent = task.title;

  // make the task title editable on double click
  taskTitleEl.addEventListener('dblclick', () => {
    const newTitle = prompt('Enter a new title for the task:', task.title);
    if (newTitle) {
      task.title = newTitle;
      renderLists();
    }
  });

  // create the delete task button
  const deleteTaskButtonEl = document.createElement('button');
  deleteTaskButtonEl.classList.add('delete-task');
  deleteTaskButtonEl.textContent = 'X';
  deleteTaskButtonEl.addEventListener('click', () => {
    deleteTask(index, taskIndex);
  });

  // append the task title and delete button to the task element
  taskEl.appendChild(taskTitleEl);
  taskEl.appendChild(deleteTaskButtonEl);

  // append the task element to the tasks container
  tasksContainerEl.appendChild(taskEl);
});

// create the add task button
const addTaskButtonEl = document.createElement('button');
addTaskButtonEl.classList.add('add-task');
addTaskButtonEl.textContent = 'Add Task';
addTaskButtonEl.addEventListener('click', () => {
  const newTaskTitle = prompt('Enter a title for the new task:');
  if (newTaskTitle) {
    const newTask = { title: newTaskTitle };
    list.tasks.push(newTask);
    renderLists();
  }
});

// append the add task button and the tasks container to the list element
listEl.appendChild(addTaskButtonEl);
listEl.appendChild(tasksContainerEl);

// append the list element to the lists container
listsContainerEl.appendChild(listEl);

});

// update the board title
renderBoardTitle();
}

// render the initial lists
renderLists();

// add event listeners
createBoardButtonEl.addEventListener('click', () => {
const newBoardTitle = prompt('Enter a title for the new board:');
if (newBoardTitle) {
board.title = newBoardTitle;
board.lists = [
{ title: 'List 1', tasks: [] },
{ title: 'List 2', tasks: [] },
{ title: 'List 3', tasks: [] }
];
renderLists();
}
});

newListButtonEl.addEventListener('click', () => {
createList();
});