package com.backend.backend.Controller;

import com.backend.backend.Model.ChatMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController
{
    @MessageMapping("/sendMessage")
    @SendTo("/topic/public")
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage)
    {
        if (chatMessage.getContent() == null || chatMessage.getContent().trim().isEmpty()) {
            chatMessage.setContent("Empty message!");
        }
        return chatMessage;
    }

    @MessageMapping("/addUser")
    @SendTo("/topic/public")
    public ChatMessage addUser(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor)
    {
        System.out.println("👤 User Joined: " + chatMessage);

        headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());

        // Sending a system message that user joined
        ChatMessage joinMessage = new ChatMessage();
        joinMessage.setSender(chatMessage.getSender());
        joinMessage.setContent("joined the chat");
        joinMessage.setType("JOIN");

        return joinMessage;
    }
}
