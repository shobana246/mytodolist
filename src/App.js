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
  

 
  // const onDeleteTask = (id) => {
  //   setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  // };


 

  
  const addTask = async (task, group, date) => {
    try {
      const response = await fetch("http://localhost:8080/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", 
        },
        body: JSON.stringify({
          task: task, 
          group: group, 
          date: date,
        }),
      });
  
      if (response.ok) {
        const newTask = await response.json();
        console.log("Task added:", newTask);
        
      } else {
        throw new Error("Failed to add task");
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };
  

  
  const updateTask = (updatedTask, group, date, id) => {
    console.log("updated",updatedTask, group, date, id)
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, task: updatedTask, group: group, date:date } : task
      )
    );
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" 
          element={<HomePage />} />

          <Route
            path="/add-list"
            element={<AddListPage addTask={addTask} />}
          />
          <Route
            path="/show-list"
            element={
              <ShowListPage
                tasks={tasks}
                onToggleCompleted={onToggleCompleted}
                // onDeleteTask={handleDeleteTask}
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
