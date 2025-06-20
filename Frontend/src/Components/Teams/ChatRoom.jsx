import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import {
  Avatar,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { CiVideoOn } from "react-icons/ci";

const ChatRoom = () => {
  const location = useLocation();
  const receiver = location.state?.receiver;
  const sender = localStorage.getItem("username");
  const [message, setMessage] = useState("");
  const[isOnline,setisOnline]=useState(false);
  const [messages, setMessages] = useState([]);
  const stompClientRef = useRef(null);
  const messagesEndRef = useRef(null);

  const navigate = useNavigate();

  const handleVideoCall = () => {
    navigate("/videocall", { state: { receiver } });
  };

  useEffect(() => {
    const client = new Client({
      brokerURL: "ws://localhost:3030/ws/websocket",
      reconnectDelay: 5000,
      debug: (str) => console.log(str),
      onConnect: () => {
        console.log("✅ Connected to WebSocket");
        setisOnline(true);
        client.subscribe(`/user/${sender}/private`, (message) => {
          try {
            const receivedMessage = JSON.parse(message.body);
            console.log("📩 Received Message:", receivedMessage);

            if (receivedMessage.content) {
              setMessages((prevMessages) => [...prevMessages, receivedMessage]);
            }
          } catch (error) {
            console.error("❌ Error Parsing Message:", error);
          }
        });
      },
      onStompError: (frame) => {
        console.error("❌ STOMP Error:", frame);
      },
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
        setisOnline(false);
      }
    };
  }, [sender]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim() || !receiver || !stompClientRef.current) return;

    const chatMessage = {
      sender,
      receiver,
      content: message.trim(),
      type: "CHAT",
      timestamp: new Date().toISOString(),
    };

    console.log("🚀 Sending message:", chatMessage);

    stompClientRef.current.publish({
      destination: "/app/private-message",
      body: JSON.stringify(chatMessage),
    });

    setMessages((prev) => [...prev, chatMessage]);
    setMessage("");
  };

  return (
    <Stack
      spacing={2}
      sx={{
        width: "100%",
        height: "100vh",
        p: { xs: 2, sm: 4 },
        backgroundColor: "#f5f7fb",
      }}
    >
      {/* Header */}
      <Paper
        elevation={2}
        sx={{
          borderRadius: 3,
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "white",
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Box sx={{ position: "relative" }}>
  <Avatar sx={{ bgcolor: "#1976d2" }}>
    {receiver?.charAt(0).toUpperCase() || "?"}
  </Avatar>
  <Box
    sx={{
      position: "absolute",
      bottom: 0,
      right: 0,
      width: 12,
      height: 12,
      borderRadius: "50%",
      backgroundColor: isOnline ? "#4caf50" : "#9e9e9e",
      border: "2px solid white",
    }}
  />
</Box>

          <Typography variant="h6" fontWeight={600}>
            Chat with {receiver || "Unknown"}
          </Typography>
        </Stack>
        <Box
          onClick={handleVideoCall}
          sx={{
            cursor: "pointer",
            p: 1,
            borderRadius: "50%",
            transition: "0.2s",
            "&:hover": { backgroundColor: "#e3f2fd" },
          }}
        >
          <CiVideoOn size={28} color="#1976d2" />
        </Box>
      </Paper>

      {/* Message area */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          backgroundColor: "white",
          p: 3,
          borderRadius: 3,
          boxShadow: 1,
          border: "1px solid #e0e0e0",
        }}
      >
        {messages.length === 0 ? (
          <Typography color="gray" textAlign="center" mt={4}>
            No messages yet.
          </Typography>
        ) : (
          messages.map((msg, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent: msg.sender === sender ? "flex-end" : "flex-start",
                mb: 1.5,
              }}
            >
              <Box
                sx={{
                  maxWidth: "75%",
                  p: 1.5,
                  px: 2,
                  borderRadius: 3,
                  backgroundColor: msg.sender === sender ? "#1976d2" : "#e0e0e0",
                  color: msg.sender === sender ? "white" : "black",
                  fontSize: "0.95rem",
                  lineHeight: 1.4,
                }}
              >
                {msg.content}
              </Box>
            </Box>
          ))
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input bar */}
      <Paper
        elevation={2}
        sx={{
          borderRadius: 4,
          p: 1.5,
          display: "flex",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <TextField
  fullWidth
  variant="outlined"
  placeholder="Type a message..."
  value={message}
  onChange={(e) => setMessage(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }}
  multiline
/>

        <Button
          variant="contained"
          onClick={sendMessage}
          disabled={!receiver}
          sx={{ px: 3 }}
        >
          Send
        </Button>
      </Paper>
    </Stack>
  );
};

export default ChatRoom;
