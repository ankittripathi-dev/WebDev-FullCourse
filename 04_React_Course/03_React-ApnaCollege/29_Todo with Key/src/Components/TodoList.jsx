import React from "react";
import "./TodoList.css";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const TodoList = () => {
  const [todos, setTodos] = useState([{ task: "Sample-task", id: uuidv4() }]);
  const [newTodo, setNewTodo] = useState("");

  //(a)
  const updateAddValue = (evt) => {
    setNewTodo(evt.target.value);
  };

  //(b)
  const addNewTask = () => {
    const trimmedTodo = newTodo.trim();
    if (!trimmedTodo) {
      return alert("Task cannot be empty!"); // Optional: Show an alert message
    }

    setTodos([...todos, { task: trimmedTodo, id: uuidv4() }]);
    setNewTodo("");
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Add Task here"
        value={newTodo}
        onChange={updateAddValue}
      />
      <br />
      <button onClick={addNewTask}>Add Task</button>
      <hr />
      <h2>Task Lists</h2>
      <ul>
        {todos.map((item) => (
          <li key={item.id}>{item.task}</li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
