import React from "react";
import { Link } from "react-router-dom";

export const HomePage = () => {
  return (
    <div className="home-page">
      <h1>Welcome to the Todo App</h1>
      <div className="home-buttons">
        <Link to="/add-list">
          <button>Go to Add Task</button>
        </Link>
        <div className="space"></div>
        <Link to="/show-list">
          <button>Go to Show Tasks</button>
        </Link>
      </div>
    </div>
  );
};
