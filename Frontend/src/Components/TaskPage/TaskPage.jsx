import React, { useEffect, useState } from "react";
import TaskBar from "./TaskBar";

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Get user info from localStorage
  const username = localStorage.getItem("username");
  const jwtToken = localStorage.getItem("token"); // Ensure it's stored as "token"

  useEffect(() => {
    if (!username || !jwtToken) {
      setError("User not logged in");
      setLoading(false);
      return;
    }

    const fetchTasks = async () => {
      try {
        const response = await fetch(`http://localhost:3030/api/Task/task/${username}`, {
          method: "GET",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}` // ✅ Attach JWT token
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }

        const data = await response.json();
        setTasks(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [username, jwtToken]);

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h1>Task List</h1>
      {tasks.length === 0 ? <p>No tasks assigned</p> : tasks.map((task) => (
        <TaskBar key={task.id} task={task} onTaskDone={() => console.log("Task Done")} />
      ))}
    </div>
  );
};

export default TaskPage;
