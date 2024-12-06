document.getElementById('addTaskButton').addEventListener('click', addTask);
document.addEventListener('DOMContentLoaded', loadTasks);

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const daysInput = document.getElementById('daysInput');
    const hoursInput = document.getElementById('hoursInput');
    const minutesInput = document.getElementById('minutesInput');
    const secondsInput = document.getElementById('secondsInput');

    const taskText = taskInput.value;
    const daysValue = parseInt(daysInput.value) || 0;
    const hoursValue = parseInt(hoursInput.value) || 0;
    const minutesValue = parseInt(minutesInput.value) || 0;
    const secondsValue = parseInt(secondsInput.value) || 0;

    if (taskText === '') {
        alert('Please enter a valid task!');
        return;
    }

    const totalTime = (daysValue * 86400 + hoursValue * 3600 + minutesValue * 60 + secondsValue) * 1000; // Convert to milliseconds

    const taskList = document.getElementById('taskList');
    const li = document.createElement('li');
    li.textContent = taskText;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = function() {
        taskList.removeChild(li);
        saveTasks();
    };

    li.appendChild(deleteButton);
    taskList.appendChild(li);

    // Set a timer for the task
    const timerId = setTimeout(() => {
        showNotification(taskText);
    }, totalTime); // Set the timer

    // Store task in localStorage
    const task = {
        text: taskText,
        timerId: timerId,
        time: totalTime
    };
    saveTaskToLocalStorage(task);

    // Clear input fields
    taskInput.value = '';
    daysInput.value = '';
    hoursInput.value = '';
    minutesInput.value = '';
    secondsInput.value = '';
}

function showNotification(task) {
    if (Notification.permission === 'granted') {
        new Notification('Task Reminder', {
            body: `Time's up for: ${task}`,
        });
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification('Task Reminder', {
                    body: `Time's up for: ${task}`,
                });
            }
        });
    }
}

function saveTaskToLocalStorage(task) {
    const tasks = getTasksFromLocalStorage();
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getTasksFromLocalStorage() {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
}

function loadTasks() {
    const tasks = getTasksFromLocalStorage();
    const taskList = document.getElementById('taskList');

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = task.text;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = function() {
            taskList.removeChild(li);
            removeTaskFromLocalStorage(task.text);
        };

        li.appendChild(deleteButton);
        taskList.appendChild(li);

        // Set a timer for the task
        const timerId = setTimeout(() => {
            showNotification(task.text);
        }, task.time); // Set the timer
        li.timerId = timerId; // Store the timer ID in the list item
    });
}

function removeTaskFromLocalStorage(taskText) {
    const tasks = getTasksFromLocalStorage();
    const updatedTasks = tasks.filter(task => task.text !== taskText);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
}