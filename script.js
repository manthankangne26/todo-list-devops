
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const taskCount = document.getElementById("task-count");
const emptyMessage = document.getElementById("empty-message");
const clearCompletedButton = document.getElementById("clear-completed");

let tasks = [];

try {
    const savedTasks = JSON.parse(
        localStorage.getItem("todo-tasks") || "[]"
    );

    if (Array.isArray(savedTasks)) {
        tasks = savedTasks.filter(task =>
            task &&
            typeof task.id === "string" &&
            typeof task.text === "string" &&
            typeof task.completed === "boolean"
        );
    }
} catch {
    tasks = [];
}

function saveTasks() {
    localStorage.setItem("todo-tasks", JSON.stringify(tasks));
}

function renderTasks() {
    taskList.replaceChildren();

    tasks.forEach(task => {
        const item = document.createElement("li");
        item.className = "task-item";

        if (task.completed) {
            item.classList.add("completed");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute("aria-label", "Mark task complete");

        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        const text = document.createElement("span");
        text.textContent = task.text;

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-button";

        deleteButton.addEventListener("click", () => {
            tasks = tasks.filter(t => t.id !== task.id);
            saveTasks();
            renderTasks();
        });

        item.append(checkbox, text, deleteButton);
        taskList.appendChild(item);
    });

    const remaining = tasks.filter(task => !task.completed).length;
    taskCount.textContent =
        `${remaining} task${remaining !== 1 ? "s" : ""} remaining`;

    emptyMessage.hidden = tasks.length > 0;
}

taskForm.addEventListener("submit", event => {
    event.preventDefault();

    const text = taskInput.value.trim();

    if (!text) return;

    tasks.push({
        id: crypto.randomUUID(),
        text: text,
        completed: false
    });

    saveTasks();
    renderTasks();
    taskInput.value = "";
    taskInput.focus();
});

clearCompletedButton.addEventListener("click", () => {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
});

renderTasks();
