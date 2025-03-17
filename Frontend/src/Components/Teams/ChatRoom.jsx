import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { CiVideoOn } from "react-icons/ci";

const ChatRoom = () => {
  const location = useLocation();
  const receiver = location.state?.receiver; // Selected recipient
  const sender = localStorage.getItem("username"); // Logged-in user
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const stompClientRef = useRef(null);
  const messagesEndRef = useRef(null);

  const navigate = useNavigate();
  const handleVideoCall =()=>
  {
    navigate("/videocall", { state: { receiver } })
  }

  useEffect(() => {
    const client = new Client({
      brokerURL: "ws://localhost:3030/ws/websocket", // ✅ Correct WebSocket URL
      reconnectDelay: 5000,
      debug: (str) => console.log(str),
      onConnect: () => {
        console.log("✅ Connected to WebSocket");

        // ✅ Subscribe to private messages
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
      destination: "/app/private-message", // ✅ Correct endpoint for private messaging
      body: JSON.stringify(chatMessage),
    });

    setMessages((prev) => [...prev, chatMessage]);
    setMessage("");
  };

  return (
    <Stack spacing={2} sx={{ width: "100%", height: "100vh", padding: "20px" }}>
      <Stack direction={"row"} justifyContent={"space-between"}>
      <Typography variant="h5" fontWeight={600}>
        Chat with {receiver || "Unknown"}
      </Typography>
      <CiVideoOn size={30} cursor={"pointer"} onClick={handleVideoCall}/>
      </Stack>

      <Box sx={{ flex: 1, overflowY: "auto", border: "1px solid #ddd", padding: 2, borderRadius: 2 }}>
        {messages.length === 0 ? (
          <Typography color="gray">No messages yet.</Typography>
        ) : (
          messages.map((msg, index) => (
            <Box
              key={index}
              sx={{
                textAlign: msg.sender === sender ? "right" : "left",
                marginBottom: 1,
              }}
            >
              <Typography
                sx={{
                  display: "inline-block",
                  padding: "8px 12px",
                  borderRadius: "12px",
                  backgroundColor: msg.sender === sender ? "#1976d2" : "#e0e0e0",
                  color: msg.sender === sender ? "white" : "black",
                }}
              >
                {msg.content}
              </Typography>
            </Box>
          ))
        )}
        <div ref={messagesEndRef} />
      </Box>

      <Stack direction="row" spacing={2}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button variant="contained" onClick={sendMessage} disabled={!receiver}>
          Send
        </Button>
      </Stack>
    </Stack>
  );
};

export default ChatRoom;
