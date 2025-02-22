import { Chip, Typography, IconButton, Popover, List, ListItem } from "@mui/material";
import React, { useState } from "react";
import { MdDone } from "react-icons/md";
import { IoMdArrowDropdown } from "react-icons/io";

const TaskBar = ({ taskId, onTaskDone }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const assignedMembers = ["John Doe", "Jane Smith", "Mike Johnson"];

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
      <Typography variant="h6">Task Name</Typography>
      <Chip label="Urgent" color="error" />

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
            {assignedMembers.length > 0 ? (
              assignedMembers.map((member, index) => (
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

      <Typography fontSize="10" fontWeight="100">12/12/2024</Typography>

      {/* Done Button */}
      <IconButton onClick={() => onTaskDone(taskId)} color="success">
        <MdDone />
      </IconButton>
    </div>
  );
};

export default TaskBar;
