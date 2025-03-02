package com.backend.backend.Model;

import lombok.*;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessage {
    private String sender;
    private String receiver;
    private String content;  // ✅ Added this to store the actual message content
    private String type; // Should be a String to match the incoming JSON

    public String getSender() {
                return sender;
    }
    public String getContent() {
        return content;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setReceiver(String receiver) {
        this.receiver = receiver;
    }

    public String getReceiver() {
        return receiver;
    }

    public ChatMessage setContent(String content) {
            this.content = content;
            return this;
    }

    @Override
    public String toString() {
        return "ChatMessage{" +
                "sender='" + sender + '\'' +
                ", receiver='" + receiver + '\'' + // ✅ Include receiver
                ", content='" + content + '\'' +
                ", type='" + type + '\'' +
                '}';
    }
}
