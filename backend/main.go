package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
)

type Task struct {
	ID        int    `json:"id"`
	Task      string `json:"task"`
	Group     string `json:"group"`
	Date      string `json:"date"`
	Completed bool   `json:"completed"`
}

func connectToDB()(*sql.DB, error){
	dsn := "root:new-password@tcp(127.0.0.1:3306)/go_todo_app" 
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		return nil, err
	}
	err = db.Ping()
	if err != nil {
		return nil, err
	}
	return db, nil
}

func enableCors(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*") 
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization") 
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Credentials", "true") 
}


func handleOptions(w http.ResponseWriter, r *http.Request) {
	enableCors(w, r)
	w.WriteHeader(http.StatusOK)
}

func getTasks(w http.ResponseWriter, r *http.Request) {
	enableCors(w, r)
	db, err := connectToDB()
	if err != nil {
		http.Error(w, "Failed to connect to database", http.StatusInternalServerError)
		return
	}
	defer db.Close()
	rows, err := db.Query("SELECT id, task, group_name, date, completed FROM tasks")
	if err != nil {
		http.Error(w, "Error fetching tasks", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var tasks []Task

	for rows.Next() {
		var task Task
		err := rows.Scan(&task.ID, &task.Task, &task.Group, &task.Date, &task.Completed)
		if err != nil {
			http.Error(w, "Error scanning task", http.StatusInternalServerError)
			return
		}
		tasks = append(tasks, task) 
	}

	if err := rows.Err(); err != nil {
		http.Error(w, "Error iterating over rows", http.StatusInternalServerError)
		return
	}

	if len(tasks) == 0 {
        w.Header().Set("Content-Type", "application/json")
        w.WriteHeader(http.StatusOK)
        json.NewEncoder(w).Encode([]Task{})
        return
    }


	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(tasks); err != nil {
		http.Error(w, "Error encoding tasks", http.StatusInternalServerError)
		return
	}
	
}

func getTaskByID(w http.ResponseWriter, r *http.Request) {
	enableCors(w, r)
	taskID := mux.Vars(r)["id"]
	db, err := connectToDB()
	if err != nil {
		http.Error(w, "Failed to connect to database", http.StatusInternalServerError)
		return
	}
	defer db.Close()
	var task Task
	err = db.QueryRow("SELECT id, task, group_name, date, completed FROM tasks WHERE id = ?", taskID).Scan(&task.ID, &task.Task, &task.Group, &task.Date, &task.Completed)
	if err != nil {
		http.Error(w, "Task not found", http.StatusNotFound)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(task); err != nil {
		http.Error(w, "Error encoding task", http.StatusInternalServerError)
		return
	}
}

func createTask(w http.ResponseWriter, r *http.Request) {
    enableCors(w, r)

    var newTask Task

    if err := json.NewDecoder(r.Body).Decode(&newTask); err != nil {
        http.Error(w, "Error decoding JSON: "+err.Error(), http.StatusBadRequest)
        return
    }

    db, err := connectToDB()
    if err != nil {
        http.Error(w, "Failed to connect to database: "+err.Error(), http.StatusInternalServerError)
        return
    }
    defer db.Close()

    fmt.Printf("Inserting task: %v\n", newTask)

    query := "INSERT INTO tasks (task, group_name, date, completed) VALUES (?, ?, ?, ?)"
    
    result, err := db.Exec(query, newTask.Task, newTask.Group, newTask.Date, newTask.Completed)
    if err != nil {
        fmt.Printf("Error executing query: %v\n", err)
        http.Error(w, "Error inserting task: "+err.Error(), http.StatusInternalServerError)
        return
    }
    taskID, err := result.LastInsertId()
    if err != nil {
        fmt.Printf("Error getting LastInsertId: %v\n", err)
        http.Error(w, "Error getting task ID: "+err.Error(), http.StatusInternalServerError)
        return
    }

    newTask.ID = int(taskID)  
    w.WriteHeader(http.StatusCreated)
    w.Header().Set("Content-Type", "application/json")
    if err := json.NewEncoder(w).Encode(newTask); err != nil {
        fmt.Printf("Error encoding task: %v\n", err)
        http.Error(w, "Error encoding task to JSON: "+err.Error(), http.StatusInternalServerError)
        return
    }
}



func updateTask(w http.ResponseWriter, r *http.Request) {
	enableCors(w, r)
	params := mux.Vars(r)
	id, err := strconv.Atoi(params["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	var updatedTask Task
	if err := json.NewDecoder(r.Body).Decode(&updatedTask); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	db, err := connectToDB()
	if err != nil {
		http.Error(w, "Failed to connect to database", http.StatusInternalServerError)
		return
	}
	defer db.Close()

	_, err = db.Exec("UPDATE tasks SET task = ?, group_name = ?, date = ?, completed = ? WHERE id = ?", updatedTask.Task, updatedTask.Group, updatedTask.Date, updatedTask.Completed, id)
	if err != nil {
		http.Error(w, "Error updating task", http.StatusInternalServerError)
		return
	}


	updatedTask.ID = id
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(updatedTask); err != nil {
		http.Error(w, "Error encoding task", http.StatusInternalServerError)
		return
	}
}


func toggleTaskCompletion(w http.ResponseWriter, r *http.Request) {
	enableCors(w, r)
	params := mux.Vars(r)
	id, err := strconv.Atoi(params["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	db, err := connectToDB()
	if err != nil {
		http.Error(w, "Failed to connect to database", http.StatusInternalServerError)
		return
	}
	defer db.Close()

	_, err = db.Exec("UPDATE tasks SET completed = NOT completed WHERE id = ?", id)
	if err != nil {
		http.Error(w, "Error toggling task completion", http.StatusInternalServerError)
		return
	}

	var updatedTask Task
	err = db.QueryRow("SELECT id, task, group_name, date, completed FROM tasks WHERE id = ?", id).Scan(&updatedTask.ID, &updatedTask.Task, &updatedTask.Group, &updatedTask.Date, &updatedTask.Completed)
	if err != nil {
		http.Error(w, "Task not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(updatedTask); err != nil {
		http.Error(w, "Error encoding task", http.StatusInternalServerError)
		return
	}

}


func deleteTask(w http.ResponseWriter, r *http.Request) {
	enableCors(w, r)
	params := mux.Vars(r)
	id, err := strconv.Atoi(params["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	db, err := connectToDB()
	if err != nil {
		http.Error(w, "Failed to connect to database", http.StatusInternalServerError)
		return
	}
	defer db.Close()

	_, err = db.Exec("DELETE FROM tasks WHERE id = ?", id)
	if err != nil {
		http.Error(w, "Error deleting task", http.StatusInternalServerError)
		return
	}

	
	w.WriteHeader(http.StatusNoContent)
}

func main() {
	router := mux.NewRouter()

	
	router.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			enableCors(w, r) 
			next.ServeHTTP(w, r)
		})
	})

	
	router.HandleFunc("/tasks", handleOptions).Methods("OPTIONS")
	router.HandleFunc("/tasks/{id}", handleOptions).Methods("OPTIONS")
	router.HandleFunc("/tasks/{id}/toggle", handleOptions).Methods("OPTIONS")
	router.HandleFunc("/tasks/{id}/delete", handleOptions).Methods("OPTIONS")

	
	router.HandleFunc("/tasks", getTasks).Methods("GET")
	router.HandleFunc("/tasks/{id}", getTaskByID).Methods("GET")
	router.HandleFunc("/tasks", createTask).Methods("POST")
	router.HandleFunc("/tasks/{id}", updateTask).Methods("PUT")
	router.HandleFunc("/tasks/{id}/delete", deleteTask).Methods("DELETE")
	router.HandleFunc("/tasks/{id}/toggle", toggleTaskCompletion).Methods("PUT")

	fmt.Println("Server is running on http://localhost:8080")
	http.ListenAndServe(":8080", router)
}
