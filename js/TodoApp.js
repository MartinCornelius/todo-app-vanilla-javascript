export default class TodoApp {
  constructor(root) {
    root.innerHTML = TodoApp.getHTML();

    // Get elements
    this.elements = {
      todoList : root.querySelector(".todo-list"),
      todoInput : root.querySelector(".input-field"),
      btnAdd : root.querySelector(".btn-add")
    };

    // Set event listeners
    this.elements.btnAdd.addEventListener("click", () => {
      const input = this.elements.todoInput.value;
      this.elements.todoInput.value = "";
      this.addTodo(input);
    });

    // Get all the todos first time
    const todos = read();
    for (const todo of todos) {
      const newTodoElement = this.createNewTodo(todo.id, todo.content);
      this.elements.todoList.appendChild(newTodoElement);
    }
  }

  addTodo(content) {
    if (!content) {
      const doCreate = confirm("You are trying to create an empty todo...");
      if (!doCreate) {
        return;
      }
    }

    const todos = read();
    const newTodo = {
      id: Math.floor(Math.random() * 1000000),
      content: content
    }

    todos.push(newTodo);
    save(todos);
    
    this.elements.todoList.appendChild(this.createNewTodo(newTodo.id, newTodo.content));
  }

  createNewTodo(id, content) {
    const listItem = document.createElement("li");
    listItem.classList.add("todo-item");

    const element = document.createElement("textarea");
    element.classList.add("todo-textarea");
    element.textContent = content;
    element.placeholder = "Enter a todo...";
    element.addEventListener("dblclick", () => {
      const doDelete = confirm("Are you sure, you want to delete this todo?");
      if (doDelete) {
        this.deleteTodo(id, listItem);
      }
    });
    element.addEventListener("change", () => {
      this.updateTodo(id, element.value);
    });

    listItem.appendChild(element);
    return listItem;
  }

  updateTodo(id, newContent) {
    const todos = read();
    const todoToUpdate = todos.filter(todo => todo.id == id)[0];

    todoToUpdate.content = newContent;
    save(todos);
  }

  deleteTodo(id, todo) {
    const todos = read().filter(todo => todo.id != id);
    save(todos);
    this.elements.todoList.removeChild(todo);
  }

  static getHTML() {
      return `
      <div class="input">
        <input type="text" class="input-field" placeholder="Enter a new todo...">
        <button type="button" class="btn btn-add">+</button>
      </div>
      <div class="todos">
        <ul class="todo-list">
        </ul>
      </div>
      `;
  }
}

function read() {
  const todos = localStorage.getItem("todos");

  if (!todos) {
    return [];
  }

  return JSON.parse(todos);
}

function save(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}