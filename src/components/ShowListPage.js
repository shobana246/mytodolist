import React, { useEffect ,useState} from "react";
import { Link } from "react-router-dom";
import axios from "axios";



export const ShowListPage = ({ onToggleCompleted   }) => {
  const [tasks, setTasks] = useState([]); 
  const [loading, setLoading] = useState(true); 

  
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:8080/tasks"); 
        console.log("Fetched tasks:", response.data);
        setTasks(response.data); 
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setTasks([]);
       
      }
    };

    fetchTasks();  
  }, []); 
   
  
  const handleToggleCompleted = async (id) => {
    try {
      
      const response = await axios.put(`http://localhost:8080/tasks/${id}/toggle`, {});
      if (response.status === 200) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
          )
        );
      }
    } catch (error) {
      console.error("Error toggling task completion:", error);
    }
  };
  
  const handleDeleteTask = async (id) => {
    try {
      
      const response = await axios.delete(`http://localhost:8080/tasks/${id}/delete`);
      if (response.status === 204) {  
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };
  

  if (loading) {
    return <div>Loading...</div>;
  }


  return (
    <div className="Showlistpage">
      <h1>Todo List</h1>
      {tasks && tasks.length === 0 ? (
        <p>No tasks available</p>
      ) : (
        tasks?.map((task) => (
          <div key={task.id} className="todo-item">
            <input
              type="checkbox"
              checked={task.completed}  
              onChange={() => handleToggleCompleted(task.id)}
              
            />
            
            <span style={{ textDecoration: task.completed ? "line-through" : "none" }}>
              {task.task}
            </span>
            <span style={{ textDecoration: task.completed ? "line-through" : "none" }}>{task.group}</span>
            
            
            <span style={{ textDecoration: task.completed ? "line-through" : "none" }}>{task.date}</span>

            
            <Link to={`/edit-task/${task.id}`}>
              <button disabled={task.completed}>Edit</button>
            </Link>

            
            <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
         

          </div>
        ))
      )} 
            <Link to="/">
            <button>Back to Home</button>
            </Link>
             <Link to="/add-list">
                <button>Go to Add Task</button>
              </Link>
     
    </div>
  );
};

