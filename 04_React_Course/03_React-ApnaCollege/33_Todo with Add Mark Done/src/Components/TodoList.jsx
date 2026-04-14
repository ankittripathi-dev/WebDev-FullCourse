import React from "react";
import "./TodoList.css";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const TodoList = () => {
  const [todos, setTodos] = useState([
    { task: "Sample-task", id: uuidv4(), isDone: false },
  ]);
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

    setTodos((prevTodos) => {
      return [...prevTodos, { task: trimmedTodo, id: uuidv4(), isDone: false }];
    });
    setNewTodo("");
  };

  // (c) delete todo
  const deleteTodo = (id) => {
    // let copy = todos.filter((item) => item.id != id);
    // setTodos(copy);
    setTodos((prevTodos) => prevTodos.filter((item) => item.id != id));
  };

  // (d) Mark All As done
  const markAllAsDone = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((item) => {
        return {
          ...item,
          isDone: true,
        };
      })
    );
  };

  // (e) mark as done
  const markAsDone = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((item) => {
        if (item.id == id) {
          return {
            ...item,
            isDone: true,
          };
        } else {
          return item;
        }
      })
    );
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
          <li key={item.id}>
            <span
              style={
                item.isDone
                  ? {
                      textDecorationLine: "line-through",
                      textDecorationColor: "red",
                    }
                  : {}
              }
            >
              {item.task}
            </span>
            <button className="delBtn" onClick={() => deleteTodo(item.id)}>
              delete
            </button>
            <button className="delBtn" onClick={() => markAsDone(item.id)}>
              Mark as Done
            </button>
          </li>
        ))}
      </ul>
      <button onClick={markAllAsDone}>Mark All as Done</button>
    </div>
  );
};

export default TodoList;
