
const addButton = document.querySelector('.add');
const formElement = document.querySelector('form');
const formInp = document.querySelectorAll('.form-control');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

const tampledTask = (id, nameTask, description, status) => `
<div class='task' data-id='${id}'> 
<div class='task-name'> ${nameTask} </div>
<div class='task-description'>${description}</div> 
<div class='task-status'> ${status} </div> 

<div class='button-tasks'>
<button type="button" class="btn js-task-done btn-outline-success">
<i class="fa fa-check" aria-hidden="true"></i></button>

<button type="button" class="btn js-task-corect btn-outline-dark">
<i class="fas fa-edit"></i></button>

<button type="button" class="btn js-task-delete btn-outline-dark">
<i class="fa fa-trash" aria-hidden="true"></i></button> 
</div></div>`;

const doneTask = (id, nameTask, description, status) => `
<div class='task' data-id='${id}'> 
<div class='task-name'> ${nameTask} </div>
<div class='task-description'>${description}</div> 
<div class='task-status'> ${status} </div> 

<div class='button-tasks'>

<button type="button" class="btn js-task-delete btn-outline-dark">
<i class="fa fa-trash" aria-hidden="true"></i></button> 
</div></div>`;

const deleteTask = (id, nameTask, description, status) => `
<div class='task' data-id='${id}'> 
<div class='task-name'> ${nameTask} </div>
<div class='task-description'>${description}</div> 
<div class='task-status'> ${status} </div> 

<div class='button-tasks'>
<button type="button" class="btn js-task-reestablish btn-outline-dark">
reestablish </button>
</div></div>`;

const tasksElement = document.querySelector('.tasks');
const doneElement = document.querySelector('.tasks-done');
const deleteElement = document.querySelector('.tasks-delete');

function rendorTask() {
  const currentTasks = tasks.filter((task) => task.done === false && task.delete === false);
  const doneTasks = tasks.filter((task) => task.done === true);
  const deleteTasks = tasks.filter((task) => task.delete === true);

  if (currentTasks.length) {
    const bar = currentTasks.map((task) => {
      return tampledTask(task.id, task.nameTask, task.description, task.status);
    }).join(' ')
    tasksElement.innerHTML = bar;
  } else {
    tasksElement.innerHTML = "Don't task";
  }

  if (doneTasks.length) {
    const bar = doneTasks.map((task) => {
      return doneTask(task.id, task.nameTask, task.description, task.status);
    }).join(' ')
    doneElement.innerHTML = bar;
  } else {
    doneElement.innerHTML = "Don't  done task";
  }

  if (deleteTasks.length) {
    const bar = deleteTasks.map((task) => {
      return deleteTask(task.id, task.nameTask, task.description, task.status);
    }).join(' ')
    deleteElement.innerHTML = bar;
    } else {
    deleteElement.innerHTML = "Don't  delete task";
  }
}

rendorTask();

tasksElement.addEventListener('click', function (e) {
  if (e.target.classList.contains('js-task-done')) {
    const taskElement = e.target.closest('.task');
    const taskId = taskElement.dataset.id;

    tasks = tasks.map((task) => {
      let newTask = task;
      if (task.id === Number(taskId)) {
        newTask = { ...task, done: true }
      }
      return newTask;
    });

    taskElement.remove();
    localStorage.setItem('tasks', JSON.stringify(tasks));
    rendorTask();
  }

  if (e.target.classList.contains('js-task-corect')) {
    const taskElement = e.target.closest('.task');
    const taskId = taskElement.dataset.id;
    const taskName = taskElement.querySelector('.task-name');
    const taskDescription = taskElement.querySelector('.task-description');

    if (tasksElement.classList.contains('save')) {
      tasks = tasks.map((task) => {
        let newTask = task;
        if (task.id === Number(taskId)) {
          newTask = { ...task, nameTask: taskName.textContent, description: taskDescription.textContent }
        }
        return newTask;
      });
      localStorage.setItem('tasks', JSON.stringify(tasks));
      rendorTask();
    } else {
      taskName.setAttribute('contenteditable', 'true');
      taskDescription.setAttribute('contenteditable', 'true');
      tasksElement.classList.add('save');
      e.target.innerHTML = '<i class="fas fa-save"></i>';
    }
  }

  if (e.target.classList.contains('js-task-delete')) {
  const taskElement = e.target.closest('.task');
    const taskId = taskElement.dataset.id;

    tasks = tasks.map((task) => {
      let newTask = task;
      if (task.id === Number(taskId)) {
        newTask = { ...task, delete: true }
      }
      return newTask;
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
    rendorTask();
  } 
})

doneElement.addEventListener('click', function (e) {
  if (e.target.classList.contains('js-task-delete')) {
  const taskElement = e.target.closest('.task');
    const taskId = taskElement.dataset.id;

    tasks = tasks.map((task) => {
      let newTask = task;
      if (task.id === Number(taskId)) {
        newTask = { ...task, delete: true }
      }
      return newTask;
    });
  taskElement.remove();
  }
})

deleteElement.addEventListener('click', function(e){
  if (e.target.classList.contains('js-task-reestablish')) {
    const taskElement = e.target.closest('.task');
    const taskId = taskElement.dataset.id;

    tasks = tasks.map((task) => {
      let newTask = task;
      if (task.id === Number(taskId)) {
        newTask = { ...task, delete: false }
      }
      return newTask;
    });
    rendorTask();
  }
})

//work with form
const openButton = document.querySelector('.open-form');

openButton.addEventListener('click', function(e) {
 if (e.target.classList.contains('open-form')) {
  formElement.style.display = "block";
  openButton.classList.add('close'); 
  openButton.innerHTML = '<i class="fas fa-times"></i>'; 
 } else { 
   openButton.classList.toggle('close'); 
  formElement.style.display = "none"; 
  openButton.innerHTML = 'Open form';
  openButton.style.display = 'block';
 } 
})

addButton.addEventListener('click', function () {
  validForm();
})

function gettingValue() {
  const nameTask = document.querySelector('input').value;
  const description = document.querySelector('textarea').value;
  const status = document.querySelector('select').value;
  const id = Date.now();
  const newTask = { id, 
    nameTask, 
    description, 
    status, 
    done: false, 
    delete: false }

  tasks.push(newTask);
  tasksElement.insertAdjacentHTML('beforeend', tampledTask(id, nameTask, description, status));
  localStorage.setItem('tasks', JSON.stringify(tasks));
  clearForm();
}

function validForm() {
  const inp = document.querySelector('input');
  if (!inp.value) { inp.classList.add('error'); } else {
    inp.classList.remove('error');
    gettingValue();
  }
}

function clearForm() {
  for (let inpu of formInp) {
    inpu.value = "";
  }
}

