# To-Do List Application

This project is a To-Do List application that features the ability to add, edit, delete, and toggle the completion of tasks. The project includes a **React** frontend and a **Go (Golang)** backend, with a **MySQL** database to store the tasks.

## Features

- **Add** new tasks to your to-do list.
- **Edit** existing tasks to update their details.
- **Delete** tasks that are no longer needed.
- **Toggle completion** of tasks to mark them as completed or incomplete.
- **Database integration**: MySQL database for storing tasks.

## Tech Stack

### Frontend:
- **React**: A JavaScript library for building user interfaces.
- **HTML, CSS, JavaScript**: Standard web technologies to build the user interface.

### Backend:
- **Go (Golang)**: A statically typed, compiled programming language to create the REST API.
- **MySQL**: A relational database to store the tasks.

### Other:
- **Gorilla Mux**: A Go router and URL matcher for building HTTP services.
- **CORS**: Cross-Origin Resource Sharing is enabled to allow API requests from different origins.

## Prerequisites

Make sure you have the following tools installed on your machine:

- [Node.js](https://nodejs.org/) (for React frontend)
- [Go](https://golang.org/) (for Go backend)
- [MySQL](https://www.mysql.com/) (for database)

## Installation

### 1. Clone the Repository
Clone the project repository to your local machine:
```bash
git clone https://github.com/yourusername/todolist-app.git
cd todolist-app

#TO RUN

TO RUN THE FRONT END
   ----npm start
TO RUN THE BACK END
   ---- go run main.go
