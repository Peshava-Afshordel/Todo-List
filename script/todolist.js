// let todos = [];
let filterValue = "all";
let sortValue = "all";

//  Selecting :
const todoInput = document.querySelector(".todo-input");
const todoForm = document.querySelector(".todo-form");
const todoList = document.querySelector(".todolist");
const filterdTodos = document.querySelector(".filter-todos");
const sortedTodos = document.querySelector(".sort-todos");
const backDrop = document.querySelector(".backdrop");
const modal = document.querySelector(".modal");
const closeInput = document.querySelector(".close_modal");
const editSubmit = document.querySelector(".todo_edit");
const textReplaced = document.querySelector(".modal_input");
const errorMessage = document.querySelector(".error_message");

// event
todoForm.addEventListener("submit", addNewTodo);
filterdTodos.addEventListener("change", (e) => {
  filterValue = e.target.value;
  filtertodos();
});
document.addEventListener("DOMContentLoaded", (e) => {
  const todos = getAllTodos();
  createTodos(todos);
});
sortedTodos.addEventListener("change", (e) => {
  sortValue = e.target.value;
  sortTodos();
});
backDrop.addEventListener("click", closeModal);
closeInput.addEventListener("click", closeModal);

// function
function addNewTodo(e) {
  //  stop refreshing form on submit
  e.preventDefault();

  // validation form
  if (!todoInput.value) return null;

  //  create new obj
  const newTodo = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    title: todoInput.value,
    isCompleted: true,
  };

  // push new todo on todos
  savedTodos(newTodo);
  filtertodos();
}
// created new todos
function createTodos(todos) {
  //  create todos on dom
  let result = "";
  todos.forEach((todo) => {
    result += `
     <li class="todo">
     <p class="todo__title ${!todo.isCompleted && "completed"}">${
      todo.title
    }</p>
     <span class="todo__createdAt">${new Date(
       todo.createdAt
     ).toLocaleDateString("fa-IR")}</span>
     <button class = "todo__check" data-todo-id =${
       todo.id
     }><i class="far fa-check-square ${
      todo.isCompleted && "fa-square"
    }"></i></button>
     <button class="todo__remove" data-todo-id =${
       todo.id
     }><i class="far fa-trash-alt"></i></button>
     <button class = "todo__edit" data-todo-id =${
       todo.id
     }><i class="fa-solid fa-pen-to-square"></i></button>
   </li> 
     `;
  });

  // add todo on dom
  todoList.innerHTML = result;
  todoInput.value = "";
  // selecting remove btn and set event
  const removeBtn = [...document.querySelectorAll(".todo__remove")];
  removeBtn.forEach((btn) => {
    btn.addEventListener("click", removeTodo);
  });
  // selecting CHECK btn and set event
  const checkeBtn = [...document.querySelectorAll(".todo__check")];
  checkeBtn.forEach((btn) => {
    btn.addEventListener("click", checkTodo);
  });

  const editBtn = [...document.querySelectorAll(".todo__edit")];
  editBtn.forEach((btn) => {
    btn.addEventListener("click", editTodo);
  });
}

// filteres todos
function filtertodos() {
  const todos = getAllTodos();
  switch (filterValue) {
    case "all": {
      createTodos(todos);
      break;
    }
    case "completed": {
      const filteredTodos = todos.filter((t) => !t.isCompleted);
      createTodos(filteredTodos);
      break;
    }
    case "uncompleted": {
      const filteredTodos = todos.filter((t) => t.isCompleted);
      createTodos(filteredTodos);
      break;
    }
    default:
      createTodos(todos);
  }
}

//  remove todos
function removeTodo(e) {
  let todos = getAllTodos();
  const todoId = +e.target.dataset.todoId;
  todos = todos.filter((t) => t.id !== todoId);
  savedAllTodos(todos);
  filtertodos();
}

// check todos
function checkTodo(e) {
  let todos = getAllTodos();
  const todoId = +e.target.dataset.todoId;
  const todo = todos.find((t) => t.id === todoId);
  todo.isCompleted = !todo.isCompleted;
  savedAllTodos(todos);
  filtertodos();
}
// save to local host
function getAllTodos() {
  const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
  return savedTodos;
}

function savedTodos(todo) {
  const savedTodos = getAllTodos();
  savedTodos.push(todo);
  localStorage.setItem("todos", JSON.stringify(savedTodos));
  return savedTodos;
}

function savedAllTodos(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// sort todo
function sortTodos() {
  const todos = getAllTodos();
  switch (sortValue) {
    case "all": {
      createTodos(todos);
      break;
    }
    case "newest": {
      const sortTodos = todos.sort((a, b) => {
        const aMin = new Date(a.createdAt).getTime();
        const bMin = new Date(b.createdAt).getTime();
        return bMin - aMin;
      });
      createTodos(sortTodos);
      break;
    }
    case "oldest": {
      const sortTodos = todos.sort((a, b) => {
        const aMin = new Date(a.createdAt).getTime();
        const bMin = new Date(b.createdAt).getTime();
        return aMin - bMin;
      });
      createTodos(sortTodos);
      break;
    }
  }
}
// edit todo
function editTodo(e) {
  // open modal
  openModal();
  e.preventDefault();
  const todo = getAllTodos();
  const todoId = +e.target.dataset.todoId;
  todo.find((t) => {
    editSubmit.addEventListener("click", (e) => {
      if (textReplaced.value === "") {
        e.preventDefault();
        error();
        setTimeout(() => {
          errorMessage.classList.toggle("error_hidden");
        }, 2500);
      } else if (t.id === todoId) {
        e.preventDefault();
        t.title = textReplaced.value;
        savedAllTodos(todo);
        createTodos(todo);
        closeModal();
      }
    });
    textReplaced.value = "";
  });
}
// close modal
function closeModal() {
  backDrop.classList.add("hidden");
  modal.classList.add("hidden");
}
// open modal
function openModal() {
  backDrop.classList.remove("hidden");
  modal.classList.remove("hidden");
}

// error message
function error() {
  const error = errorMessage.classList.toggle("error_hidden");
  return error;
}
