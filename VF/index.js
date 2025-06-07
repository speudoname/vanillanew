const API_URL = ''; // Will be set by environment variable in production

async function fetchTasks() {
  try {
    const response = await fetch(`${API_URL}/tasks`);
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }
    const tasks = await response.json();
    
    const list = document.getElementById('taskList');
    list.innerHTML = '';

    if (tasks.length === 0) {
      const li = document.createElement('li');
      li.textContent = 'No tasks yet. Add one above!';
      list.appendChild(li);
      return;
    }

    tasks.forEach(task => {
      const li = document.createElement('li');
      li.textContent = task.task;
      list.appendChild(li);
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    alert('Failed to load tasks. Please try again.');
  }
}

async function addTask() {
  const input = document.getElementById('taskInput');
  const task = input.value.trim();

  if (!task) {
    alert('Please enter a task');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add task');
    }

    input.value = '';
    await fetchTasks();
  } catch (error) {
    console.error('Error adding task:', error);
    alert(error.message || 'Failed to add task');
  }
}

// Add event listener for Enter key
const taskInput = document.getElementById('taskInput');
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addTask();
  }
});

// Initialize the app
window.onload = fetchTasks;
