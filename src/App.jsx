import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const LOCAL_STORAGE_PREFIX = "ADVANCE_TODO_LIST";
const TODO_STORAGE_KEY = `${LOCAL_STORAGE_PREFIX}-todos`;

function App() {
  const [todoList, setTodoList] = useState(() => {
    const storedTodos = JSON.parse(localStorage.getItem(TODO_STORAGE_KEY));
    return storedTodos || [];
  });
  const [selectedEditTodo, setSelectedEditTodo] = useState(null);
  const [activeFilterRole, setActiveFilterRole] = useState("all");
  const todoInputRef = useRef();

  useEffect(() => {
    localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todoList));
  }, [todoList]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const todoInput = todoInputRef.current.value;

    if (!todoInput) return;

    if (selectedEditTodo) {
      editTodoFunk(todoInput);
      return;
    }

    const newTodo = {
      id: new Date().valueOf(),
      name: todoInput,
      isCompleted: false,
      isPinned: false,
      dateAdded: new Date().toLocaleString(),
    };

    setTodoList((prevList) => [...prevList, newTodo]);
    todoInputRef.current.value = "";
  };

  const editTodoFunk = (newValue) => {
    setTodoList((prevList) =>
      prevList.map((todo) => {
        if (todo.id === selectedEditTodo.id) {
          return { ...todo, name: newValue };
        } else {
          return todo;
        }
      })
    );
    setSelectedEditTodo(null);
    todoInputRef.current.value = "";
  };

  const toggleCompleted = (todoId) => {
    setTodoList((prevList) =>
      prevList.map((todo) =>
        todo.id === todoId ? { ...todo, isCompleted: !todo.isCompleted } : todo
      )
    );
  };

  const deleteTodo = (todoId) => {
    setTodoList((prevList) => prevList.filter((todo) => todo.id !== todoId));
  };

  const editTodo = (todo) => {
    setSelectedEditTodo(todo);
    todoInputRef.current.value = todo.name;
  };

  const handleListItemClick = (todoId) => {
    setTodoList((prevList) =>
      prevList.map((todo) =>
        todo.id === todoId ? { ...todo, isPinned: !todo.isPinned } : todo
      )
    );
  };

  const showFilteredTodos = () => {
    let filtered = [...todoList];
    if (activeFilterRole === "active") {
      filtered = filtered.filter((todo) => !todo.isCompleted);
    } else if (activeFilterRole === "completed") {
      filtered = filtered.filter((todo) => todo.isCompleted);
    }

    filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(a.dateAdded) - new Date(b.dateAdded);
    });

    return filtered;
  };

  const filteredTodos = showFilteredTodos();

  return (
    <div>
      <header className="header">
        <h1>Todo</h1>
        <p>Add your work to do on time</p>
      </header>

      <div className="main-content">
        <ul className="list">
          {filteredTodos.map((todo, index) => (
            <li
              key={todo.id}
              className="list-item"
              data-todo-id={todo.id}
              onDoubleClick={() => handleListItemClick(todo.id)} // Double-click to pin
            >
              <div className="todo-text">
                <label
                  className="list-item-label"
                  onClick={(e) => e.stopPropagation()} // Prevent click on label from propagating
                >
                  {index + 1}.
                  <input
                    type="checkbox"
                    checked={todo.isCompleted}
                    onChange={() => toggleCompleted(todo.id)}
                    data-list-item-checkbox
                  />
                  <span data-list-item-text>{todo.name}</span>
                  {todo.isPinned && <span className="pinned-label"> (Pinned)</span>}
                </label>
                <div className="todo-date">Added on: {todo.dateAdded}</div>
              </div>
              <div className="todo-actions">
                <button onClick={() => editTodo(todo)} className="edit-todo">
                  Edit
                </button>
                <button onClick={() => deleteTodo(todo.id)} className="delete-todo">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="filter-section">
        <button
          className={activeFilterRole === "all" ? "active-filter" : ""}
          onClick={() => setActiveFilterRole("all")}
        >
          All
        </button>
        <button
          className={activeFilterRole === "active" ? "active-filter" : ""}
          onClick={() => setActiveFilterRole("active")}
        >
          Active
        </button>
        <button
          className={activeFilterRole === "completed" ? "active-filter" : ""}
          onClick={() => setActiveFilterRole("completed")}
        >
          Completed
        </button>
      </div>

      <form className="todo-form" onSubmit={handleSubmit}>
        <input type="text" id="todo-input" placeholder="add new todo" ref={todoInputRef} />
        <button type="submit">{selectedEditTodo ? "Update" : "Add"}</button>
      </form>
    </div>
  );
}

export default App;
