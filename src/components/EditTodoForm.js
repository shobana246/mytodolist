import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const EditTodoForm = ({ tasks, updateTask }) => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [taskName, setTaskName] = useState("");
  const [group, setGroup] = useState("");
  const [date, setDate] = useState("");

  
  useEffect(() => {
    const taskToEdit = tasks.find((task) => task.id === parseInt(id)); 
    if (taskToEdit) {
      setTaskName(taskToEdit.task);
      setGroup(taskToEdit.group);
      setDate(taskToEdit.date);
    }
  }, [id, tasks]);

  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskName && group && date) {
      console.log("handleSubmit",taskName, group,date)
      updateTask(taskName, group, date, parseInt(id)); 
      navigate("/show-list"); 
    } else {
      alert("Please fill in all fields.");
    }
  };
   
   
  return (
    <div className="edit-todo-form">
      <h1>Edit Task</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={taskName}
          placeholder="Edit task name"
          onChange={(e) => setTaskName(e.target.value)}
        />
        <select value={group} onChange={(e) => setGroup(e.target.value)}>
          <option value="">Select group</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="General">General</option>
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button type="submit">Save</button>
        <button type="button" onClick={() => navigate("/show-list")}>Cancel</button>
      </form>
    </div>
  );
};
