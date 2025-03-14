let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Add a new task
const addTask = () => {
    const taskInput = document.getElementById('taskInput');
    const dateInput = document.getElementById('dateInput');
    const text = taskInput.value.trim();
    const date = dateInput.value;

    if (!text || !date) {
        alert("Please enter both a task and a due date!");
        return;
    }

    if (new Date(date) < new Date()) {
        alert("The due date cannot be in the past!");
        return;
    }

    tasks.push({ text, date, completed: false });
    taskInput.value = "";
    dateInput.value = "";
    saveTasks();
    updateTaskList();
    updateStats();
};

const editTask = (index) => {
    const task = tasks[index];
    const confirmation = confirm(`Do you want to edit the task: "${task.text}" with due date: ${new Date(task.date).toLocaleString()}?`);

    if (confirmation) {
        const taskInput = document.getElementById('taskInput');
        const dateInput = document.getElementById('dateInput');

        // Populate the input fields with the task's current values
        taskInput.value = task.text;
        dateInput.value = task.date;

        // Remove the task from the list temporarily
        tasks.splice(index, 1);

        // Update the list and stats dynamically
        saveTasks();
        updateTaskList();
        updateStats();

        // Focus on the task input for easier user editing
        taskInput.focus();
    }
};



// Delete a task
const deleteTask = (index) => {
    if (confirm("Are you sure you want to delete this task?")) {
        tasks.splice(index, 1);
        saveTasks();
        updateTaskList();
        updateStats();
    }
};

// Toggle task completion
const toggleTaskComplete = (index) => {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    updateTaskList();
    updateStats();
};

// Update the task list in the UI
const updateTaskList = () => {
    const taskList = document.querySelector('.task-list');
    taskList.innerHTML = "";

    if (tasks.length === 0) {
        taskList.innerHTML = '<p>No tasks yet! Add a task to get started.</p>';
        return;
    }

    tasks.forEach((task, index) => {
        const listItem = document.createElement('li');
        listItem.className = "taskItem";
        listItem.innerHTML = `
            <div class="task ${task.completed ? 'completed' : ''}">
                <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''}>
                <p>${task.text} (Due: ${new Date(task.date).toLocaleString()})</p>
            </div>
            <div class="icons">
                <img src="edit.png" alt="Edit" title="Edit task" onclick="editTask(${index})">
                <img src="delete.png" alt="Delete" title="Delete task" onclick="deleteTask(${index})">
            </div>
        `;
        listItem.querySelector('.checkbox').addEventListener('change', () => toggleTaskComplete(index));
        taskList.appendChild(listItem);
    });
};

// Update the progress bar and stats
const updateStats = () => {
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const progress = totalTasks ? (completedTasks / totalTasks) * 100 : 0;

    document.getElementById('progress').style.width = `${progress}%`;
    document.getElementById('numbers').textContent = `${completedTasks}/${totalTasks}`;
};

// Save tasks to localStorage
const saveTasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

// Initialize the app
document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    addTask();
});

window.onload = () => {
    updateTaskList();
    updateStats();
};
