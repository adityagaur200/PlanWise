import React, { useEffect, useState } from "react";
import TaskBar from "./TaskBar";
import { Box, Stack, Typography, CircularProgress } from "@mui/material";

const TaskPage = () => {
  const styles = {
    header: {
      width: "100%",
      padding: "10px 0",
      border: "1px solid #e0e0e0",
      borderRadius: 2,
      position: "sticky",
      top: 0,
      backgroundColor: "white",
      zIndex: 1,
      alignItems: "center",
    },
    headerText: {
      display: "flex",
      justifyContent: "center",
    },
    loaderContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "80vh", // Centering vertically
    },
  };

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const username = localStorage.getItem("username");
  const jwtToken = localStorage.getItem("token");

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
            Authorization: `Bearer ${jwtToken}`,
          },
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

  if (loading)
    return (
      <Box sx={styles.loaderContainer}>
        <CircularProgress />
      </Box>
    );

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <Stack direction={"column"} gap={1}>
      <Box sx={styles.header}>
        <Box sx={styles.headerText}>
          <Typography fontSize={25} fontWeight={700}>Tasks</Typography>
        </Box>
      </Box>
      {tasks.length === 0 ? (
        <p>No tasks assigned</p>
      ) : (
        tasks.map((task) => (
          <TaskBar key={task.id} task={task} onTaskDone={() => console.log("Task Done")} />
        ))
      )}
    </Stack>
  );
};

export default TaskPage;
