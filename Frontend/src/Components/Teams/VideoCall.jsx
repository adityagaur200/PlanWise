import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import { Box, Button, Typography, Stack, Paper } from "@mui/material";

const VideoCall = () => {
  const location = useLocation();
  const receiver = location.state?.receiver;
  const sender = localStorage.getItem("username");

  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const stompClientRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localVideoRef = useRef(null);

  useEffect(() => {
    const client = new Client({
      brokerURL: "ws://localhost:3030/ws/websocket",
      reconnectDelay: 5000,
      debug: (str) => console.log(str),
      onConnect: () => {
        console.log("✅ Connected to WebSocket");
        client.subscribe(`/user/${sender}/webrtc`, (message) => {
          const data = JSON.parse(message.body);
          handleSignalingData(data);
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
    const initializeMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
      } catch (error) {
        console.error("❌ Error accessing media devices:", error);
      }
    };

    initializeMedia();
  }, []);

  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  const setupPeerConnection = () => {
    peerConnectionRef.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peerConnectionRef.current.ontrack = (event) => {
      console.log("📡 Received Remote Track:", event.streams[0]);
      setRemoteStream(event.streams[0]); // ✅ Properly setting remote stream
    };

    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        sendSignalingData({ type: "candidate", candidate: event.candidate });
      }
    };

    if (localStream) {
      localStream.getTracks().forEach((track) => {
        peerConnectionRef.current.addTrack(track, localStream);
      });
    }
  };

  const startCall = async () => {
    if (!localStream) {
      console.error("❌ No local stream available");
      return;
    }

    if (!peerConnectionRef.current) {
      setupPeerConnection();
    }

    const offer = await peerConnectionRef.current.createOffer();
    await peerConnectionRef.current.setLocalDescription(offer);
    console.log("📡 Sending Offer:", offer);

    sendSignalingData({ type: "offer", sdp: offer.sdp }); // ✅ Only send `sdp`
  };

  const endCall = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    setRemoteStream(null);
  };

  const handleSignalingData = async (data) => {
    try {
      console.log("📩 Handling WebRTC Signaling Data:", data);

      if (!peerConnectionRef.current) {
        console.warn("⚠️ Peer connection not initialized yet, setting up...");
        setupPeerConnection();
      }

      if (data.type === "offer" && data.sdp) {
        console.log("🔹 Received Offer with SDP:", data.sdp);

        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription({ type: "offer", sdp: data.sdp }));

        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);
        console.log("📡 Sending Answer:", answer);

        sendSignalingData({ type: "answer", sdp: answer.sdp });
      } else if (data.type === "answer" && data.sdp) {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription({ type: "answer", sdp: data.sdp }));
        console.log("✅ Remote description set successfully (Answer)");
      } else if (data.type === "candidate" && data.candidate) {
        const iceCandidate = new RTCIceCandidate(data.candidate);
        await peerConnectionRef.current.addIceCandidate(iceCandidate);
        console.log("✅ ICE Candidate added:", iceCandidate);
      }
    } catch (error) {
      console.error("❌ Error handling signaling data:", error);
    }
  };

  const sendSignalingData = (data) => {
    if (stompClientRef.current && stompClientRef.current.connected) {
      stompClientRef.current.publish({
        destination: "/app/webrtc",
        body: JSON.stringify({ ...data, sender, receiver }),
      });
    }
  };

  return (
    <Box 
      sx={{ 
        width: "80vw", height: "100vh", 
        display: "flex", flexDirection: "column", alignItems: "center", 
        justifyContent: "center", gap: 3, backgroundColor: "#f5f5f5" 
      }}
    >
      <Typography variant="h4" fontWeight={600}>
        Video Call with {receiver || "Unknown"}
      </Typography>

      <Stack
        direction="row"
        spacing={2}
        sx={{
          width: "80%",
          height: "60vh",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Paper sx={{ flex: 1, border: "2px solid #1976d2", borderRadius: "12px", overflow: "hidden" }}>
          <video ref={localVideoRef} autoPlay playsInline muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <Typography
            variant="caption"
            sx={{
              position: "absolute", bottom: 8, left: 8,
              background: "rgba(0,0,0,0.6)", color: "white", padding: "4px 8px", borderRadius: "8px",
            }}
          >
            You
          </Typography>
        </Paper>

        <Paper sx={{ flex: 1, border: "2px solid #e53935", borderRadius: "12px", overflow: "hidden" }}>
          <video ref={remoteVideoRef} autoPlay playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </Paper>
      </Stack>

      <Stack direction="row" spacing={2}>
        <Button variant="contained" color="success" onClick={startCall} disabled={!localStream}>
          Start Call
        </Button>
        <Button variant="contained" color="error" onClick={endCall} disabled={!remoteStream}>
          End Call
        </Button>
      </Stack>
    </Box>
  );
};

export default VideoCall;
