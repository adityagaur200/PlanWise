import React, { useEffect, useState } from "react";
import TaskBar from "./TaskBar";
import {
  Box,
  Stack,
  Typography,
  CircularProgress,
  Tabs,
  Tab,
  Paper,
} from "@mui/material";
import { MdMarkEmailRead } from "react-icons/md";

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState(0);

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

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const getFilteredTasks = () => {
    if (tab === 1) {
      return tasks.filter((task) => task.assignees?.includes(username));
    }
    return tasks;
  };

  const filteredTasks = getFilteredTasks();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="70vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box px={{ xs: 2, sm: 4 }} py={3}>
      <Paper elevation={2} sx={{ borderRadius: 2, p: 2 }}>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="All" />
          <Tab label="Mentions" />
        </Tabs>

        <Box mt={3}>
          {filteredTasks.length === 0 ? (
            <Box textAlign="center" mt={8}>
              <MdMarkEmailRead size={64} color="#90caf9" />
              <Typography variant="h6" color="textSecondary" mt={2}>
                You're all caught up!
              </Typography>
              <Typography variant="body2" color="textSecondary">
                No tasks found here right now. Come back later.
              </Typography>
            </Box>
          ) : (
            <Stack spacing={2}>
              {filteredTasks.map((task) => (
                <Box
                  key={task.id}
                  component={Paper}
                  elevation={1}
                  sx={{
                    borderRadius: 2,
                    transition: "all 0.3s",
                    "&:hover": {
                      boxShadow: 4,
                      transform: "scale(1.01)",
                    },
                  }}
                >
                  <TaskBar task={task} onTaskDone={() => console.log("Task Done")} />
                </Box>
              ))}
            </Stack>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default TaskPage;
