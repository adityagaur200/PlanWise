import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import { Box, Button, Typography, Stack, IconButton } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";

const VideoCall = () => {
  const location = useLocation();
  const receiver = location.state?.receiver;
  const sender = localStorage.getItem("username");

  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [micEnabled, setMicEnabled] = useState(true);
  const [camEnabled, setCamEnabled] = useState(true);

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
      setRemoteStream(event.streams[0]);
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
    sendSignalingData({ type: "offer", sdp: offer.sdp });
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
      if (!peerConnectionRef.current) {
        setupPeerConnection();
      }

      if (data.type === "offer" && data.sdp) {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription({ type: "offer", sdp: data.sdp }));
        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);
        sendSignalingData({ type: "answer", sdp: answer.sdp });
      } else if (data.type === "answer" && data.sdp) {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription({ type: "answer", sdp: data.sdp }));
      } else if (data.type === "candidate" && data.candidate) {
        const iceCandidate = new RTCIceCandidate(data.candidate);
        await peerConnectionRef.current.addIceCandidate(iceCandidate);
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

  const toggleMic = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setMicEnabled(!micEnabled);
    }
  };

  const toggleCamera = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setCamEnabled(!camEnabled);
    }
  };
  const shareScreen = async () => {
  try {
    const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    const screenTrack = screenStream.getVideoTracks()[0];

    // Replace the current video track being sent
    const sender = peerConnectionRef.current
      .getSenders()
      .find((s) => s.track.kind === "video");

    if (sender) {
      sender.replaceTrack(screenTrack);
    }

    // Update the local video preview
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = screenStream;
    }

    // When screen sharing stops, revert back to camera
    screenTrack.onended = async () => {
      const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(cameraStream);

      const newCameraTrack = cameraStream.getVideoTracks()[0];
      if (sender) {
        sender.replaceTrack(newCameraTrack);
      }
      localVideoRef.current.srcObject = cameraStream;
    };
  } catch (error) {
    console.error("❌ Error sharing screen:", error);
  }
};


  return (
    <Box sx={{ position: "relative", width: "82vw", height: "100vh", overflow: "hidden", backgroundColor: "#000" }}>
      {/* Remote Video Full Screen */}
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          backgroundColor: "#333",
        }}
      />

      {/* Local Video - small floating window */}
      <Box
        sx={{
          position: "absolute",
          bottom: 16,
          right: 16,
          width: 200,
          height: 150,
          border: "2px solid #1976d2",
          borderRadius: "8px",
          overflow: "hidden",
          zIndex: 10,
          backgroundColor: "#000",
        }}
      >
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Box>

      {/* Controls */}
      <Box
        sx={{
          position: "absolute",
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 2,
          zIndex: 20,
        }}
      >
        <Button variant="contained" color="success" onClick={startCall} disabled={!localStream}>
          Start Call
        </Button>
        <Button variant="contained" color="error" onClick={endCall} disabled={!remoteStream}>
          End Call
        </Button>
        <IconButton onClick={toggleMic} color="primary">
          {micEnabled ? <MicIcon /> : <MicOffIcon />}
        </IconButton>
        <IconButton onClick={toggleCamera} color="primary">
          {camEnabled ? <VideocamIcon /> : <VideocamOffIcon />}
        </IconButton>
        <Button variant="contained" color="primary" onClick={shareScreen}>
          Share Screen
        </Button>

      </Box>

      {/* Title */}
      <Typography
        variant="h6"
        sx={{
          position: "absolute",
          top: 16,
          left: 16,
          zIndex: 20,
          color: "white",
          backgroundColor: "rgba(0,0,0,0.5)",
          padding: "6px 12px",
          borderRadius: "8px",
        }}
      >
        Talking to: {receiver || "Unknown"}
      </Typography>
    </Box>
  );
};

export default VideoCall;
