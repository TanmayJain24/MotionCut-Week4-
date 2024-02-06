window.addEventListener('load', () => {
    const form = document.querySelector("#new-task-form");
    const input = document.querySelector("#new-task-input");
    const list_el = document.querySelector("#tasks");

    // Retrieve task order from local storage or use an empty array
    const taskOrder = JSON.parse(localStorage.getItem('taskOrder')) || [];

    // Function to update the task order in local storage
    function updateTaskOrder() {
        localStorage.setItem('taskOrder', JSON.stringify(taskOrder));
    }

    // Function to retrieve tasks from local storage and display them in the specified order
    function displayTasksFromLocalStorage() {
        taskOrder.forEach(taskName => {
            const taskValue = localStorage.getItem(taskName);
            addTaskToList(taskName, taskValue);
        });
    }

    // Function to add a task to the list
    function addTaskToList(taskName, taskValue) {
        const task_el = document.createElement('div');
        task_el.classList.add('task');

        const task_content_el = document.createElement('div');
        task_content_el.classList.add('content');

        task_el.appendChild(task_content_el);

        const task_input_el = document.createElement('input');
        task_input_el.classList.add('text');
        task_input_el.type = 'text';
        task_input_el.value = taskValue;
        task_input_el.setAttribute('readonly', 'readonly');

        task_content_el.appendChild(task_input_el);

        const task_actions_el = document.createElement('div');
        task_actions_el.classList.add('actions');

        const task_edit_el = document.createElement('button');
        task_edit_el.classList.add('edit');
        task_edit_el.innerText = 'Edit';

        const task_delete_el = document.createElement('button');
        task_delete_el.classList.add('delete');
        task_delete_el.innerText = 'Delete';

        const task_complete_el = document.createElement('button');
        task_complete_el.classList.add('completed');
        task_complete_el.innerText = 'Incomplete';

        task_actions_el.appendChild(task_edit_el);
        task_actions_el.appendChild(task_delete_el);
        task_actions_el.appendChild(task_complete_el);

        task_el.appendChild(task_actions_el);

        list_el.appendChild(task_el);

        task_edit_el.addEventListener('click', () => {
            if (task_edit_el.innerText.toLowerCase() == "edit") {
                task_edit_el.innerText = "Save";
                task_input_el.removeAttribute("readonly");
                task_input_el.focus();
            } else {
                task_edit_el.innerText = "Edit";
                task_input_el.setAttribute("readonly", "readonly");
                // Update the localStorage when saving changes
                localStorage.setItem(taskName, task_input_el.value);
            }
        });

        task_delete_el.addEventListener('click', () => {
            list_el.removeChild(task_el);
            // Remove the task from localStorage and order array when deleted
            localStorage.removeItem(taskName);
            const index = taskOrder.indexOf(taskName);
            if (index !== -1) {
                taskOrder.splice(index, 1);
                updateTaskOrder();
            }
        });

        task_complete_el.addEventListener('click', () => {
            if (task_complete_el.innerText.toLowerCase() == 'incomplete') {
                task_complete_el.innerText = 'Completed';
            } else {
                task_complete_el.innerText = 'Incomplete';
            }
        });
    }

    // Call function to display tasks from local storage in the correct order when the page loads
    displayTasksFromLocalStorage();

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const task = input.value;
        const timestamp = new Date().getTime(); // Use timestamp as a unique identifier
        const taskName = `task_${timestamp}`;
        
        addTaskToList(taskName, task); // Add the new task to the list
        localStorage.setItem(taskName, task); // Add the new task to local storage
        taskOrder.push(taskName); // Add the task to the order array
        updateTaskOrder(); // Update the order array in local storage
        input.value = '';
    });
});
