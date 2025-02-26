import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const AddListPage = ({ addTask }) => {
  const [task, setTask] = useState("");
  const [group, setGroup] = useState("");
  const [date, setDate] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (task && group && date) {
      addTask(task, group, date);
      navigate("/show-list"); 
    } else {
      alert("Please fill all fields.");
    }
  };
 

  return (
    <div className="add-list-page">
      <h1>Add Your Task</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={task}
          placeholder="Enter task name"
          onChange={(e) => setTask(e.target.value)}
          
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
        <button type="submit">Add Task</button>

      </form>
    </div>
  );
};
