let todos = [];

function InitTodo() {
  if (!localStorage.getItem("todos")) {
    return;
  }
  todos = JSON.parse(localStorage.getItem("todos"));
  const todo_container = document.getElementById("todo_container");

  todo_container.innerHTML = "";

  todos.forEach((todo) => {
    const child = document.createElement("div");
    child.className =
      "alert alert-primary d-flex align-items-center justify-content-between todo-item";
    child.role = "alert";
    child.dataset.uuid = todo.uuid; // Store UUID for easier reference

    const todoContent = document.createElement("div");
    todoContent.className = "todo-content";

    const todoText = document.createElement("p");
    todoText.className = "todo_text m-0";
    todoText.textContent = todo.text;

    // Apply text decoration if the todo is marked as done
    if (todo.isDone) {
      todoText.classList.add("complete");
    }

    const creationDate = document.createElement("p");
    creationDate.className = "todo-date m-0";
    creationDate.textContent = `Created on: ${todo.createDate}`;

    todoContent.appendChild(todoText);
    todoContent.appendChild(creationDate);

    const btnContainer = document.createElement("div");
    btnContainer.className = "btn_container";
    const editButton = document.createElement("button");
    editButton.className = "btn btn-info";

    // Change button icon based on completion status
    updateEditButtonIcon(editButton, todo.isDone);

    editButton.addEventListener("click", () => {
      // Toggle the isDone status of the todo item
      todos = todos.map((x) =>
        x.uuid === todo.uuid ? { ...x, isDone: !x.isDone } : x
      );
      localStorage.setItem("todos", JSON.stringify(todos));

      // Update UI
      const updatedTodo = todos.find((x) => x.uuid === todo.uuid);
      todoText.classList.toggle("complete", updatedTodo.isDone);
      updateEditButtonIcon(editButton, updatedTodo.isDone);
    });

    const deleteButton = document.createElement("button");
    deleteButton.className = "btn btn-danger mx-1";
    deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
    deleteButton.addEventListener("click", () => {
      if (confirm("Are you sure you want to delete this todo?")) {
        // Apply delete animation
        child.classList.add("delete");

        setTimeout(() => {
          todos = todos.filter((x) => x.uuid !== todo.uuid);
          localStorage.setItem("todos", JSON.stringify(todos));
          InitTodo();
        }, 300); // Match the animation duration
      }
    });

    btnContainer.appendChild(editButton);
    btnContainer.appendChild(deleteButton);

    child.appendChild(todoContent);
    child.appendChild(btnContainer);

    todo_container.appendChild(child);
  });
}

function updateEditButtonIcon(button, isDone) {
  if (isDone) {
    button.innerHTML = '<i class="fa-solid fa-ban"></i>';
  } else {
    button.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
  }
}

function AddTodo() {
  const txt = document.getElementById("todo_input").value.trim();
  if (txt === "") {
    alert("Please enter a todo item.");
    return;
  }

  const now = new Date();
  const formattedDate = now.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const todo_obj = {
    uuid: crypto.randomUUID(),
    text: txt,
    isDone: false,
    createDate: formattedDate,
  };

  todos.push(todo_obj);
  localStorage.setItem("todos", JSON.stringify(todos));

  // Initialize the todos after adding a new one
  InitTodo();

  // Clear the input field
  document.getElementById("todo_input").value = "";
}

InitTodo();
