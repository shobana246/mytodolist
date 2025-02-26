import React from "react";
import { Link } from "react-router-dom";

export const ShowListPage = ({ tasks, onToggleCompleted, onDeleteTask }) => {
  console.log("showlist",tasks && tasks ?.id,tasks)
  
  return (
    <div className="Showlistpage">
      <h1>Todo List</h1>
      {tasks.length === 0 ? (
        <p>No tasks available</p>
      ) : (
        tasks.map((task) => (
          <div key={task.id} className="todo-item">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggleCompleted(task.id)} 
            />
            
            <span style={{ textDecoration: task.completed ? "line-through" : "none" }}>
              {task.task}
            </span>
            <span>{task.group}</span>
            
            
            <span>{task.date}</span>

            
            <Link to={`/edit-task/${task.id}`}>
              <button>Edit</button>
            </Link>

            
            <button onClick={() => onDeleteTask(task.id)}>Delete</button>
         

          </div>
        ))
      )} 
            <Link to="/">
            <button>Back to Home</button>
            </Link>
     
    </div>
  );
};

