import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const EditTodoForm = ({ tasks, updateTask }) => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [taskName, setTaskName] = useState("");
  const [group, setGroup] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading]= useState(true);
 


  
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await fetch(`http://localhost:8080/tasks/${id}`);
        const task = await response.json();
        if (task) {
          setTaskName(task.task); 
          setGroup(task.group); 
          setDate(task.date); 
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching task:", error);
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);
 
  
  const handleSubmit = async (e) => {
  e.preventDefault();
  if (taskName && group && date) {
    try {
      const updatedTask = { task: taskName, group, date };

      const response = await fetch(`http://localhost:8080/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
      });

      if (response.ok) {
        const updatedData = await response.json();
        updateTask(updatedData.task, updatedData.group, updatedData.date, updatedData.id);
        navigate('/show-list');
      } else {
        alert('Failed to update task');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Error updating task');
    }
  } else {
    alert("Please fill in all fields.");
  }
};


  if (loading) {
    return <div>Loading task data...</div>; 
  }
   
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
