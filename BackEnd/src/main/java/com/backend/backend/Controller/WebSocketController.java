package com.backend.backend.Controller;

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
}
