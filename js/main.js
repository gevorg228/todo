const form = document.querySelector('#form')
const taskInput = document.querySelector('#taskInput')
const tasksList = document.querySelector('#tasksList')
const emptyList = document.querySelector('#emptyList')

form.addEventListener('submit', addTask);
    
tasksList.addEventListener('click', deleteTask);

tasksList.addEventListener('click', doneTask);


let tasks = [];

if(localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach((task) => renderTask(task));
}


     
checkEmptyList();


// функции
// функция добавления задачи
function addTask(event) {
    // омена отправки формы
    event.preventDefault();

    // достаем текст из инпута(поля ввода)
    const taskText = taskInput.value;

    // описываем задачу в виде объекта
    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false
    };

    // добавляем задачу в массив с задачами
    tasks.push(newTask);

    // сохранение списка задач в хранилище браузра
    saveToLocalStorage();

    //рендер задач на страницу
    renderTask(newTask);    

    // очищаем поле ввода и возвращаем фокус на него
    taskInput.value=''
    taskInput.focus();

    checkEmptyList()
}

// функция удаления задачи
function deleteTask(event) {

    // проверяем то что клик не по кнопке "удалить"
    if (event.target.dataset.action !== 'delete') return;

    // нахождение обьекта в родителе
    const parentNode = event.target.closest('.list-group-item');

    // определяем id задачи
    const id = Number(parentNode.id);

    // находим индекс задачи в массиве
    const index = tasks.findIndex( (task) => task.id === id);  

    // удаляет задачу из массива
    tasks.splice(index, 1);
    
    // сохранение списка задач в хранилище браузра
    saveToLocalStorage();

    // удаляет задачу из разметки
    parentNode.remove();

    checkEmptyList()
}

// функция выполения задачи
function doneTask(event) {

    // проверяем то что клик не по кнопке "задача выполнена"
    if (event.target.dataset.action !== 'done') return;

    const parentNode = event.target.closest('.list-group-item');

    const id = Number(parentNode.id);

    const task = tasks.find( (task) => task.id === id); 

    task.done = !task.done

    // сохранение списка задач в хранилище браузра
    saveToLocalStorage();

    // находжение в родителе нужного обьекта
    const taskTitle = parentNode.querySelector('.task-title');
    taskTitle.classList.toggle('task-title--done');
    
    
}

// функция добавления/удаления окна "список дел пуст"
function checkEmptyList() {
    if(tasks.length === 0) {
        const emptyListHTML = `
        <li id="emptyList" class="list-group-item empty-list">
            <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
            <div class="empty-list__title">Список дел пуст</div>    
        </li>`
        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
    }
    if (tasks.length > 0) {
        const emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove() : null;
    }
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask(task) {
    const cssClass = task.done ? "task-title task-title--done" : "task-title"; 


    // формируем разметку новой задачи
    const taskHTML = `
    <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
        <span class="${cssClass}">${task.text}</span>
        <div class="task-item__buttons">
            <button type="button" data-action="done" class="btn-action">
                <img src="./img/tick.svg" alt="Done" width="18" height="18">
            </button>
            <button type="button" data-action="delete" class="btn-action">
                <img src="./img/cross.svg" alt="Done" width="18" height="18">
            </button>
        </div>
    </li>`

    // добавляем задачу на страницу
    tasksList.insertAdjacentHTML('beforeend', taskHTML);
}