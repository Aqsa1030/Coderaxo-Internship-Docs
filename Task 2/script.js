const STORAGE_KEY = "aqsa_todo_tasks";
const THEME_KEY = "aqsa_todo_theme";

const taskInput   = document.getElementById("taskInput");
const addBtn      = document.getElementById("addBtn");
const taskList    = document.getElementById("taskList");
const countLabel  = document.getElementById("countLabel");
const clearDoneBtn = document.getElementById("clearDone");
const themeToggle = document.getElementById("themeToggle");
const themeKnob   = document.getElementById("themeKnob");
const themeLabel  = document.getElementById("themeLabel");
const dateLabel   = document.getElementById("dateLabel");

let tasks = [];

const showDate = () => {
  const opts = { weekday: "long", month: "long", day: "numeric" };
  dateLabel.textContent = new Date().toLocaleDateString("en-US", opts);
};

const saveTasks = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

const loadTasks = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  tasks = stored ? JSON.parse(stored) : [];
};

const render = () => {
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    taskList.innerHTML = `
      <div class="empty-state">
        <div class="big">Nothing here yet</div>
        <div>Add your first task above to get started.</div>
      </div>`;
  }

  tasks.forEach((task) => {
    const stub = document.createElement("div");
    stub.className = "stub";

    stub.innerHTML = `
      <div class="punch">
        <div class="dot"></div><div class="dot"></div><div class="dot"></div>
      </div>
      <div class="checkbox ${task.completed ? "checked" : ""}" data-id="${task.id}">
        ${task.completed ? "✓" : ""}
      </div>
      <span class="task-text ${task.completed ? "completed" : ""}" data-id="${task.id}">${escapeHTML(task.text)}</span>
      <button class="del-btn" data-id="${task.id}">✕</button>
    `;
    taskList.appendChild(stub);
  });

  const remaining = tasks.filter((t) => !t.completed).length;
  countLabel.textContent = `${remaining} of ${tasks.length} task${tasks.length !== 1 ? "s" : ""} left`;
};

const escapeHTML = (str) =>
  str.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));

const addTask = () => {
  const value = taskInput.value.trim();
  if (value === "") return;

  tasks.push({
    id: Date.now().toString(),
    text: value,
    completed: false
  });

  taskInput.value = "";
  saveTasks();
  render();
};

const toggleTask = (id) => {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  render();
};

const deleteTask = (id) => {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  render();
};

const clearCompleted = () => {
  tasks = tasks.filter((task) => !task.completed);
  saveTasks();
  render();
};

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});

taskList.addEventListener("click", (e) => {
  const id = e.target.getAttribute("data-id");
  if (!id) return;

  if (e.target.classList.contains("checkbox") || e.target.classList.contains("task-text")) {
    toggleTask(id);
  } else if (e.target.classList.contains("del-btn")) {
    deleteTask(id);
  }
});

clearDoneBtn.addEventListener("click", clearCompleted);

const applyTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  themeKnob.textContent = theme === "dark" ? "🌙" : "☀️";
  themeLabel.textContent = theme === "dark" ? "Dark" : "Light";
  localStorage.setItem(THEME_KEY, theme);
};

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme") || "light";
  applyTheme(current === "dark" ? "light" : "dark");
});

const init = () => {
  showDate();
  loadTasks();
  render();
  const savedTheme = localStorage.getItem(THEME_KEY) || "light";
  applyTheme(savedTheme);
};

init();