import React, { useEffect, useState } from "react";
import { CiChat1 } from "react-icons/ci";
import {
  Avatar,
  Box,
  Stack,
  Typography,
  CircularProgress,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const styles = {
  container: {
    width: "100%",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    backgroundColor: "#f9f9f9",
  },
  header: {
    width: "90%",
    padding: "15px",
    borderRadius: 3,
    position: "sticky",
    top: 0,
    backgroundColor: "white",
    zIndex: 1,
    alignItems: "center",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
  },
  headerText: {
    display: "flex",
    justifyContent: "center",
  },
  userListContainer: {
    width: "90%",
    flex: 1,
    overflowY: "auto",
    marginTop: 2,
  },
  userBar: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 3,
    marginBottom: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 20px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
    },
  },
};

const TableHeader = () => (
  <Box sx={styles.header}>
    <Box sx={styles.headerText}>
      <Typography fontSize={28} fontWeight={700}>
        TEAM MEMBERS
      </Typography>
    </Box>
  </Box>
);

const TeamPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentUser = localStorage.getItem("username");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authentication token is missing. Please log in.");
      setLoading(false);
      return;
    }

    fetch("http://localhost:3030/user/getusers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.status === 401) {
          throw new Error("Unauthorized. Please log in again.");
        }
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  return (
    <Stack direction="column" alignItems="center" sx={styles.container}>
      <TableHeader />

      <Stack direction="column" spacing={1} alignItems="center" sx={styles.userListContainer}>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          users.map(
            (user, index) =>
              user.username !== currentUser && (
                <Paper key={index} sx={styles.userBar}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ width: 48, height: 48, bgcolor: "#4A90E2" }}>
                      {user.username.charAt(0).toUpperCase()}
                    </Avatar>
                    <Stack direction="column" spacing={0}>
                      <Typography fontSize={17} fontWeight={600}>
                        {user.username}
                      </Typography>
                      <Typography fontSize={13} color="gray">
                        {user.email}
                      </Typography>
                    </Stack>
                  </Stack>

                  <Box
                    display="flex"
                    sx={{
                      cursor: "pointer",
                      color: "#4A90E2",
                      "&:hover": { color: "#007BFF" },
                    }}
                  >
                    <CiChat1
                      size={24}
                      onClick={() =>
                        navigate("/chat", { state: { receiver: user.username } })
                      }
                    />
                  </Box>
                </Paper>
              )
          )
        )}
      </Stack>
    </Stack>
  );
};

export default TeamPage;
