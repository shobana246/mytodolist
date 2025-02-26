import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ShowListPage } from "./components/ShowListPage";
import { AddListPage } from "./components/AddListPage";
import { HomePage } from "./components/HomePage";
import { EditTodoForm } from "./components/EditTodoForm"; 
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]); 


  const onToggleCompleted = (id) => {
    setTasks((prevTasks) =>
        prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };
  

 
  const onDeleteTask = (id) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };


  
  const addTask = (task, group, date) => {
    console.log("tasks",task);
    const newTask = {
      id: tasks.length === 0 ? 1 : tasks[tasks.length - 1].id + 1,
      task,
      group,
      date,
      completed: false,
    };
    setTasks([...tasks, newTask]);
    console.log("add Task",newTask.id);
  };
  

  
  const updateTask = (updatedTask, group, date, id) => {
    console.log("UpdateTask",updatedTask, group, date, id)
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, task: updatedTask, group: group, date:date } : task
      )
    );
  };
  // console.log("updated task");

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route
            path="/add-list"element={<AddListPage addTask={addTask} />}
          />
          <Route
            path="/show-list"element={
              <ShowListPage
                tasks={tasks}
                onToggleCompleted={onToggleCompleted}
                onDeleteTask={onDeleteTask}
              />
            }
          />
          <Route
            path="/edit-task/:id" 
            element={<EditTodoForm tasks={tasks} updateTask={updateTask} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
