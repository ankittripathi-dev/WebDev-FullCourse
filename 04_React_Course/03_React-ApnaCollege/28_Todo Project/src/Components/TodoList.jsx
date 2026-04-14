import React, { useState } from "react";
import "./TodoList.css";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  const updateTodoValueFromInput = (evt) => {
    setNewTodo(evt.target.value);
  }

  const addNewTaskByBtn = () => {
    const trimmedTodo = newTodo.trim(); // Remove leading/trailing spaces

    if (!trimmedTodo) {
      alert("Task cannot be empty!"); // Prevent adding empty tasks
      return;
    }

    setTodos([...todos, trimmedTodo]); // Add task without extra spaces
    setNewTodo(""); // Clear input field
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Input task"
        value={newTodo}
        onChange={updateTodoValueFromInput}
      />
      <br />
      <button onClick={addNewTaskByBtn}>Add Task</button>
      <hr />
      <h3>Task Lists</h3>
      <ul>
        {todos.map((item, idx) => {
          return <li key={idx}>{item}</li>;
        })}
      </ul>
    </div>
  );
};

export default TodoList;
