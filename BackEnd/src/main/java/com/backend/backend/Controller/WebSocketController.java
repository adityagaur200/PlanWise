package com.backend.backend.Controller;
import java.util.*;
import com.backend.backend.Model.ChatMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {

    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    // Broadcast to everyone in /topic/public
    @MessageMapping("/sendMessage")
    @SendTo("/topic/public")
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage) {
        if (chatMessage.getContent() == null || chatMessage.getContent().trim().isEmpty()) {
            chatMessage.setContent("Empty message!");
        }
        return chatMessage;
    }

    // Handle new user joining
    @MessageMapping("/addUser")
    @SendTo("/topic/public")
    public ChatMessage addUser(@Payload ChatMessage chatMessage) {
        System.out.println("👤 User Joined: " + chatMessage);
        chatMessage.setContent(chatMessage.getSender() + " joined the chat.");
        chatMessage.setType("JOIN");
        return chatMessage;
    }

    // ✅ NEW: Send private messages
    @MessageMapping("/private-message")
    public void sendPrivateMessage(@Payload ChatMessage chatMessage) {
        String receiver = chatMessage.getReceiver();
        System.out.println("📩 Sending private message to: " + receiver);
        messagingTemplate.convertAndSendToUser(receiver, "/private", chatMessage);
    }




        // Store queued ICE candidates until remote description is set
        private final Map<String, List<ChatMessage>> queuedCandidates = new HashMap<>();

        @MessageMapping("/webrtc")
        public void handleWebRTCSignal(@Payload ChatMessage chatMessage) {
            String receiver = chatMessage.getReceiver();
            String sender = chatMessage.getSender();

            System.out.println("📩 WebRTC Signal Sent from: " + sender + " to " + receiver);

            if (chatMessage.getType() == null) {
                System.out.println("❌ WebRTC message missing type!");
                return;
            }

            // Handling ICE Candidates
            if ("candidate".equals(chatMessage.getType()) && chatMessage.getCandidate() != null) {
                System.out.println("📡 Received ICE Candidate: " + chatMessage.getCandidate().getCandidate());

                // If receiver hasn't received offer/answer yet, queue the ICE candidate
                if (!queuedCandidates.containsKey(receiver)) {
                    queuedCandidates.putIfAbsent(receiver, new ArrayList<>());
                }
                queuedCandidates.get(receiver).add(chatMessage);
                System.out.println("🕒 Queuing ICE Candidate for " + receiver);
                return;
            }

            // Handling Offer and Answer
            if ("offer".equals(chatMessage.getType()) || "answer".equals(chatMessage.getType())) {
                System.out.println("📝 Forwarding " + chatMessage.getType() + " from " + sender + " to " + receiver);

                messagingTemplate.convertAndSendToUser(receiver, "/webrtc", chatMessage);

                // If an answer is received, process queued ICE candidates for that user
                if ("answer".equals(chatMessage.getType()) && queuedCandidates.containsKey(receiver)) {
                    System.out.println("🚀 Processing queued ICE candidates for " + receiver);
                    for (ChatMessage candidateMessage : queuedCandidates.remove(receiver)) {
                        messagingTemplate.convertAndSendToUser(receiver, "/webrtc", candidateMessage);
                    }
                }
                return;
            }

            // Default forwarding for any other type
            messagingTemplate.convertAndSendToUser(receiver, "/webrtc", chatMessage);
        }
    }


