import React, { useEffect, useState } from "react";
import { CiChat1 } from "react-icons/ci";
import { Avatar, Box, Stack, Typography, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

const styles = {
  container: {
    width: "100%",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    padding: "20px",
  },
  header: {
    width: "90%",
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
    marginLeft: "10%",
  },
  userListContainer: {
    width: "90%",
    flex: 1,
    overflowY: "auto",
    border: "1px solid #e0e0e0",
    borderRadius: 2,
    marginTop: 2,
    padding: "10px 0",
  },
  userBar: {
    width: "90%",
    border: "1px solid #e0e0e0",
    borderRadius: 2,
    margin: "8px 0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
  },
};

const TableHeader = () => (
  <Box sx={styles.header}>
    <Box sx={styles.headerText}>
      <Typography fontSize={20} fontWeight={600}>TEAM</Typography>
    </Box>
  </Box>
);

const TeamPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentUser = localStorage.getItem("username"); // Get logged-in username

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
          users.map((user, index) => (
            user.username !== currentUser && ( // Prevent self-chatting
              <Box key={index} sx={styles.userBar}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ width: 40, height: 40 }} />
                  <Stack direction="column" spacing={0} padding={0}>
                    <Typography fontSize={16} fontWeight={600}>{user.username}</Typography>
                    <Typography fontSize={12} color="GrayText">{user.email}</Typography>
                  </Stack>
                </Stack>

                <Box display="flex" sx={{ marginRight: "5%" }}>
                  <CiChat1
                    size={20}
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/chat", { state: { receiver: user.username } })}
                  />
                </Box>
              </Box>
            )
          ))
        )}
      </Stack>
    </Stack>
  );
};

export default TeamPage;
