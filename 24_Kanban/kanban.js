const board = document.getElementById('board');
const addBucketBtn = document.getElementById('add-bucket-btn');
const exportJsonBtn = document.getElementById('export-json-btn');
const importJsonBtn = document.getElementById('import-json-btn');

let bucketCount = 1;

function saveBoardState() {
    localStorage.setItem('kanbanBoard', board.innerHTML);
}

function loadBoardState() {
    const savedBoard = localStorage.getItem('kanbanBoard');
    if (savedBoard) {
        board.innerHTML = savedBoard;
    }
}

function createTask(bucket) {
    const task = document.createElement('div');
    task.className = 'task';
    task.textContent = 'Task ' + (bucket.getElementsByClassName('task').length + 1);
    task.draggable = true;
    task.addEventListener('dblclick', editTask);
    task.addEventListener('dragstart', onDragStart);
    return task;
}

function editTask(event) {
    const task = event.target;
    const taskText = prompt('Edit task:', task.textContent);
    if (taskText) {
        task.textContent = taskText;
    }
}

function addTask(event) {
  const bucket = event.target.parentNode;
  const taskList = bucket.getElementsByClassName('task-list')[0];
  const task = createTask(bucket);
  taskList.appendChild(task);
  saveBoardState();
}

function createBucket(bucketId, title) {
  const bucket = document.createElement('div');
  bucket.className = 'bucket';
  bucket.id = bucketId;

  const bucketTitle = document.createElement('h2');
  bucketTitle.className = 'bucket-title';
  bucketTitle.textContent = title;
  bucketTitle.addEventListener('dblclick', editBucketTitle);
  bucket.appendChild(bucketTitle);

  const addTaskBtn = document.createElement('button');
  addTaskBtn.className = 'add-task-btn';
  addTaskBtn.textContent = 'Add Task';
  addTaskBtn.addEventListener('click', addTask);
  bucket.appendChild(addTaskBtn);

  const taskList = document.createElement('div');
  taskList.className = 'task-list';
  taskList.addEventListener('dragover', onDragOver);
  taskList.addEventListener('drop', onDrop);
  bucket.appendChild(taskList);

  return bucket;
}

function editBucketTitle(event) {
  const bucketTitle = event.target;
  const titleText = prompt('Edit bucket title:', bucketTitle.textContent);
  if (titleText) {
      bucketTitle.textContent = titleText;
      saveBoardState();
  }
}

addBucketBtn.addEventListener('click', () => {
  bucketCount++;
  const bucketId = 'bucket-' + bucketCount;
  const title = 'Bucket ' + bucketCount;
  const bucket = createBucket(bucketId, title);
  board.appendChild(bucket);
  saveBoardState();
});

function onDragStart(event) {
  event.dataTransfer.setData('text/plain', event.target.id);
}

function onDragOver(event) {
  event.preventDefault();
}

function onDrop(event) {
  const taskId = event.dataTransfer.getData('text');
  const task = document.getElementById(taskId);
  if (task && event.target.classList.contains('task-list')) {
      event.target.appendChild(task);
      saveBoardState();
  }
}

exportJsonBtn.addEventListener('click', () => {
  const json = JSON.stringify(board.innerHTML);
  const a = document.createElement('a');
  const file = new Blob([json], {type: 'application/json'});
  a.href = URL.createObjectURL(file);
  a.download = 'kanban-board.json';
  a.click();
});

importJsonBtn.addEventListener('change', (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
      const json = e.target.result;
      board.innerHTML = JSON.parse(json);
      saveBoardState();
  };
  reader.readAsText(file);
});

loadBoardState();
