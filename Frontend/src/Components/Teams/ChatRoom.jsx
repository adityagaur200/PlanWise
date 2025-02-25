import React, { useEffect, useState, useRef } from "react";
import { Avatar, Box, Typography, TextField } from "@mui/material";
import { IoCallOutline, IoVideocamOutline } from "react-icons/io5";
import { VscSend } from "react-icons/vsc";
import { Client } from "@stomp/stompjs";

const ChatRoom = () => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const stompClientRef = useRef(null);
    const messagesEndRef = useRef(null); // For auto-scrolling
    const username = "John Doe"; // Change dynamically if needed

    useEffect(() => {
        // Initialize WebSocket connection
        const client = new Client({
            brokerURL: "ws://localhost:3030/ws",
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            debug: (str) => console.log(str),
            onConnect: () => {
                console.log("✅ Connected to WebSocket");

                client.subscribe("/topic/public", (message) => {
                    console.log("📩 Raw Received Message:", message.body);
                    
                    try {
                        const receivedMessage = JSON.parse(message.body);
                        console.log("✅ Successfully Parsed:", receivedMessage);

                        if (receivedMessage.content) {
                            setMessages((prevMessages) => [
                                ...prevMessages,
                                {
                                    sender: receivedMessage.sender,
                                    content: receivedMessage.content,
                                    type: receivedMessage.type || "CHAT",
                                    timestamp: receivedMessage.timestamp || new Date().toISOString(),
                                },
                            ]);
                        } else {
                            console.warn("⚠️ Missing 'content' field in received message:", receivedMessage);
                        }
                    } catch (error) {
                        console.error("❌ Error Parsing Message:", error, "Received body:", message.body);
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
            if (client) {
                client.deactivate();
            }
        };
    }, []);

    // Auto-scroll to latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleChange = (e) => {
        setMessage(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim() && stompClientRef.current) {
            const chatMessage = {
                sender: username,
                content: message.trim(),
                type: "CHAT",
                timestamp: new Date().toISOString(),
            };

            console.log("🚀 Sending message:", chatMessage);

            stompClientRef.current.publish({
                destination: "/app/sendMessage",
                body: JSON.stringify(chatMessage),
            });

            setMessage("");
        }
    };

    return (
        <>
            <div style={{ display: "flex", flexDirection: "column", border: "1px solid #e0e0e0", borderRadius: "1vh" }}>
                {/* Chat Header */}
                <div
                    style={{
                        width: "100%",
                        height: "8vh",
                        borderBottom: "1px solid #e0e0e0",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "0.5vh",
                    }}
                >
                    <Box display={"flex"} gap={2} alignItems={"center"} marginLeft={"1vh"}>
                        <Avatar sx={{ width: 40, height: 40 }} />
                        <Typography fontSize={20} fontWeight={600}>{username}</Typography>
                    </Box>
                    <Box display={"flex"} gap={2} marginRight={"1vh"}>
                        <IoCallOutline size={30} />
                        <IoVideocamOutline size={30} />
                    </Box>
                </div>

                {/* Chat Messages */}
                <div
                    style={{
                        width: "100%",
                        height: "75vh",
                        display: "flex",
                        flexDirection: "column",
                        padding: "1vh",
                        overflowY: "auto",
                    }}
                >
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            style={{
                                border: "1px solid #e0e0e0",
                                padding: "1vh",
                                borderRadius: "1vh",
                                maxWidth: "60%",
                                alignSelf: msg.sender === username ? "flex-end" : "flex-start",
                                backgroundColor: msg.sender === username ? "#DCF8C6" : "#E0E0E0",
                                marginBottom: "1vh",
                            }}
                        >
                            <Typography sx={{ fontWeight: 500, marginBottom: '0.5vh' }}>
                                {msg.sender}
                            </Typography>
                            <Typography sx={{ wordBreak: 'break-word' }}>
                                {msg.content}
                            </Typography>
                            <Typography sx={{ fontSize: '0.8rem', color: '#666', textAlign: 'right', marginTop: '0.5vh' }}>
                                {new Date(msg.timestamp).toLocaleTimeString()}
                            </Typography>
                        </div>
                    ))}
                    <div ref={messagesEndRef}></div>
                </div>
            </div>

            {/* Message Input */}
            <div
                style={{
                    width: "100%",
                    height: "10vh",
                    display: "flex",
                    flexDirection: "row",
                    marginTop: "1vh",
                    gap: "1vh",
                }}
            >
                <TextField
                    sx={{ height: "10vh", width: "100%" }}
                    value={message}
                    onChange={handleChange}
                    placeholder="Type a message..."
                />
                <VscSend
                    size={40}
                    onClick={handleSubmit}
                    style={{
                        alignSelf: "center",
                        cursor: message.trim() ? "pointer" : "not-allowed",
                        opacity: message.trim() ? 1 : 0.5,
                    }}
                />
            </div>
        </>
    );
};

export default ChatRoom;
