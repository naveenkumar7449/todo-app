const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const taskCounter = document.getElementById('taskCounter');
const filterBtns = document.querySelectorAll('.filters button');
const priority = document.getElementById('priority');
const dueDate = document.getElementById('dueDate');
const searchInput = document.getElementById('searchInput');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let filter = 'all';

addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => e.key === 'Enter' && addTask());
searchInput.addEventListener('input', renderTasks);

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filter = btn.dataset.filter;
        renderTasks();
    });
});

function addTask() {
    const text = taskInput.value.trim();
    if (!text) return;
    tasks.push({ 
        id: Date.now(), 
        text, 
        completed: false,
        priority: priority.value,
        dueDate: dueDate.value
    });
    taskInput.value = '';
    dueDate.value = '';
    saveTasks();
    renderTasks();
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) task.completed = !task.completed;
    saveTasks();
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
}

function renderTasks() {
    const search = searchInput.value.toLowerCase();
    const filtered = tasks.filter(t => {
        const matchFilter = filter === 'all' || 
            (filter === 'completed' && t.completed) || 
            (filter === 'pending' && !t.completed);
        const matchSearch = t.text.toLowerCase().includes(search);
        return matchFilter && matchSearch;
    });

    if (filtered.length === 0) {
        taskList.innerHTML = '<div class="empty-state">No tasks found</div>';
    } else {
        taskList.innerHTML = filtered.map(t => {
            const dueText = t.dueDate ? `📅 ${new Date(t.dueDate).toLocaleDateString()}` : '';
            const priorityText = `⚡ ${t.priority.charAt(0).toUpperCase() + t.priority.slice(1)}`;
            return `
                <li class="${t.completed ? 'completed' : ''} ${t.priority}">
                    <div class="task-content" onclick="toggleTask(${t.id})">
                        <div class="task-text">${t.text}</div>
                        <div class="task-meta">
                            <span>${priorityText}</span>
                            ${dueText ? `<span>${dueText}</span>` : ''}
                        </div>
                    </div>
                    <div class="task-actions">
                        <button class="btn-complete" onclick="toggleTask(${t.id})">✓</button>
                        <button class="btn-delete" onclick="deleteTask(${t.id})">✕</button>
                    </div>
                </li>
            `;
        }).join('');
    }

    const completed = tasks.filter(t => t.completed).length;
    const pending = tasks.length - completed;
    taskCounter.textContent = `${completed} completed • ${pending} pending • ${tasks.length} total`;
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

renderTasks();
