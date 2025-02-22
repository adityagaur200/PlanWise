import React, { useState } from "react";
import TaskBar from "./TaskBar";

const TaskPage = () => {
  const [tasks, setTasks] = useState([
    { id: 1, name: "Task 1" },
    { id: 2, name: "Task 2" },
    { id: 3, name: "Task 3" },
    { id: 4, name: "Task 4" },
  ]);

  const handleTaskDone = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: "0.5vh" }}>
        {tasks.map((task) => (
          <TaskBar key={task.id} taskId={task.id} onTaskDone={handleTaskDone} />
        ))}
      </div>
    </div>
  );
};

export default TaskPage;
