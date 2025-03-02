import { Chip, Typography, IconButton, Popover, List, ListItem } from "@mui/material";
import React, { useState } from "react";
import { MdDone } from "react-icons/md";
import { IoMdArrowDropdown } from "react-icons/io";

const TaskBar = ({ task, onTaskDone }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const jwtToken = localStorage.getItem("token");

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const markTaskAsDone = async () => {
    try {
      const response = await fetch(`http://localhost:3030/api/Task/task/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`
        },
        body: JSON.stringify({ taskStatus: "Completed" }) // ✅ Send taskStatus in body
      });
  
      if (!response.ok) {
        throw new Error("Failed to update task");
      }
  
      onTaskDone(task.id); // ✅ Call function to update UI
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };
  

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        border: "1px solid #e0e0e0",
        borderRadius: "2vh",
        padding: "1vh",
      }}
    >
      <Typography variant="h6">{task.taskName}</Typography>
      <Chip label={task.taskStatus} color={task.taskStatus === "Urgent" ? "error" : "primary"} />

      {/* Assigned To Section */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <Typography fontSize="10" fontWeight="100">Assigned to</Typography>

        <IconButton onClick={handleOpen}>
          <IoMdArrowDropdown />
        </IconButton>

        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          transformOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <List sx={{ padding: 1, minWidth: 150 }}>
            {task.assignees.length > 0 ? (
              task.assignees.map((member, index) => (
                <ListItem key={index} sx={{ fontSize: "14px" }}>
                  {member}
                </ListItem>
              ))
            ) : (
              <ListItem sx={{ fontSize: "14px" }}>No members assigned</ListItem>
            )}
          </List>
        </Popover>
      </div>

      <Typography fontSize="10" fontWeight="100">{task.deadline}</Typography>

      {/* Done Button */}
      <IconButton onClick={markTaskAsDone} color="success">
        <MdDone />
      </IconButton>
    </div>
  );
};

export default TaskBar;
