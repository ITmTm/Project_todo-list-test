document.addEventListener('DOMContentLoaded', () => {
	const taskForm = document.querySelector('#form'),
		taskTitleInput = document.querySelector('#task-title'),
		taskDescriptionInput = document.querySelector('#task-description'),
		taskList = document.querySelector('#task-list'),
		filterAllBtn = document.querySelector('#filter-all'),
		filterActiveBtn = document.querySelector('#filter-active'),
		filterCompletedBtn = document.querySelector('#filter-completed');

	let tasks = [];


	// Рендеринг всех задач
	function renderTasks() {
		renderFilteredTasks(tasks)
	}


	// Рендеринг отфильтрованных задач
	function renderFilteredTasks(filteredTasks) {
		taskList.innerHTML = '';
		filteredTasks.forEach(task => {
			const taskItem = createTaskElement(task);
			taskList.appendChild(taskItem);
		});
	}


	// Создание элемента задачи
	function createTaskElement(task) {
		const taskItem = document.createElement('li');
		taskItem.innerHTML = `
            <input type="radio" ${task.completed ? 'checked' : ''} id="task-${task.id}">
            <label for="task-${task.id}">
                <strong>${task.title}</strong>
                ${task.description ? `- ${task.description}` : ''}
            </label>
            <button class="delete-btn" data-id="${task.id}"></button>
        `;

		taskItem.querySelector('input[type="radio"]').addEventListener('change', () => {
			task.completed = !task.completed;
			updateTask(task);
		});

		taskItem.querySelector('.delete-btn').addEventListener('click', () => {
			removeTask(task.id);
		});

		return taskItem;
	}


	// Удаление задачи
	function removeTask(taskId) {
		const removedTask = tasks.find(task => task.id === taskId);
		if (!removedTask) return;

		tasks = tasks.filter(task => task.id !== taskId);
		const activeFilterActive = filterActiveBtn.classList.contains('active');
		const completedFilterActive = filterCompletedBtn.classList.contains('active');

		if (removedTask.completed && completedFilterActive) {
			renderFilteredTasks(tasks.filter(task => task.completed));
		} else if (!removedTask.completed && activeFilterActive) {
			renderFilteredTasks(tasks.filter(task => !task.completed));
		} else {
			renderTasks();
		}

		// Проверяем, пуст ли список задач
		if (tasks.length === 0) {
			filterActiveBtn.setAttribute('disabled', 'disabled');
			filterCompletedBtn.setAttribute('disabled', 'disabled');
		}
	}

	// Обновление задачи
	function updateTask(task) {
		renderTasks();
	}


	// Добавление новой задачи
	taskForm.addEventListener('submit', (e) => {
		e.preventDefault();

		const title = taskTitleInput.value.trim();
		const description = taskDescriptionInput.value.trim();
		if (title !== '') {
			const task = {
				id: Date.now(),
				title: title,
				description: description,
				completed: false
			};

			tasks.push(task);
			renderTasks();
			taskTitleInput.value = '';
			taskDescriptionInput.value = '';

			// Убираем атрибут disabled с кнопок фильтрации
			filterActiveBtn.removeAttribute('disabled');
			filterCompletedBtn.removeAttribute('disabled');

			// Проверяем, пуст ли список задач
			if (tasks.length === 0) {
				filterActiveBtn.setAttribute('disabled', 'disabled');
				filterCompletedBtn.setAttribute('disabled', 'disabled');
			}
		}
	});


	// Обработчики фильтации
	filterAllBtn.addEventListener('click', () => {
		filterAllBtn.classList.add('active');
		filterActiveBtn.classList.remove('active');
		filterCompletedBtn.classList.remove('active');
		renderTasks();
	});

	filterActiveBtn.addEventListener('click', () => {
		filterAllBtn.classList.remove('active');
		filterActiveBtn.classList.add('active');
		filterCompletedBtn.classList.remove('active');
		renderFilteredTasks(tasks.filter(task => !task.completed));
	});

	filterCompletedBtn.addEventListener('click', () => {
		filterAllBtn.classList.remove('active');
		filterActiveBtn.classList.remove('active');
		filterCompletedBtn.classList.add('active');
		renderFilteredTasks(tasks.filter(task => task.completed));
	});

});