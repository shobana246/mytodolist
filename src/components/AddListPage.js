import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const AddListPage = ({ addTask}) => {
  const [task, setTask] = useState("");
  const [group, setGroup] = useState("");
  const [date, setDate] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (task && group && date) {
      try {
        await axios.post("http://localhost:8080/tasks", {
          task,
          group,
          date,
        });
        navigate("/show-list");
      } catch (error) {
        console.error("Error adding task:", error);
        alert("Failed to add task. Please try again.");
      }
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
