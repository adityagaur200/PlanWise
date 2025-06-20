
import { toast } from "sonner";

export interface ChatMessage {
  sender: string;
  receiver?: string;
  content: string;
  type: string;
  roomId?: string;
  timestamp?: string;
}

// Mock message data for channels
const mockChannelMessages: Record<string, ChatMessage[]> = {
  "general": [
    { sender: "System", content: "Welcome to the General channel", type: "CHAT", timestamp: new Date().toISOString() },
    { sender: "Alex", content: "Hello everyone!", type: "CHAT", timestamp: new Date().toISOString() }
  ],
  "announcements": [
    { sender: "System", content: "Welcome to the Announcements channel", type: "CHAT", timestamp: new Date().toISOString() },
    { sender: "Manager", content: "Team meeting tomorrow at 10 AM", type: "CHAT", timestamp: new Date().toISOString() }
  ],
  "random": [
    { sender: "System", content: "Welcome to the Random channel", type: "CHAT", timestamp: new Date().toISOString() },
    { sender: "Sarah", content: "Check out this cool article", type: "CHAT", timestamp: new Date().toISOString() }
  ],
  "design": [
    { sender: "System", content: "Welcome to the Design channel", type: "CHAT", timestamp: new Date().toISOString() },
    { sender: "Designer", content: "New mockups have been uploaded", type: "CHAT", timestamp: new Date().toISOString() }
  ],
  "development": [
    { sender: "System", content: "Welcome to the Development channel", type: "CHAT", timestamp: new Date().toISOString() },
    { sender: "Developer", content: "The deployment was successful", type: "CHAT", timestamp: new Date().toISOString() }
  ],
  "marketing": [
    { sender: "System", content: "Welcome to the Marketing channel", type: "CHAT", timestamp: new Date().toISOString() },
    { sender: "Marketer", content: "Campaign results are in!", type: "CHAT", timestamp: new Date().toISOString() }
  ]
};

// Mock private messages
const mockPrivateMessages: Record<string, ChatMessage[]> = {};

class ChatService {
  private messageCallbacks: ((message: ChatMessage) => void)[] = [];
  
  constructor() {
    console.log("Chat service initialized (mock version)");
  }

  getMessagesForChannel(channelName: string): ChatMessage[] {
    return mockChannelMessages[channelName] || [];
  }

  getPrivateMessages(sender: string, receiver: string): ChatMessage[] {
    const key = this.getPrivateKey(sender, receiver);
    return mockPrivateMessages[key] || [];
  }

  private getPrivateKey(user1: string, user2: string): string {
    // Create a consistent key for private messages regardless of order
    return [user1, user2].sort().join(":");
  }

  sendPublicMessage(message: ChatMessage): void {
    const channelName = message.roomId || "general";
    message.timestamp = new Date().toISOString();
    
    if (!mockChannelMessages[channelName]) {
      mockChannelMessages[channelName] = [];
    }
    
    mockChannelMessages[channelName].push(message);
    this.notifySubscribers(message);
    toast.success("Message sent");
  }
  
  sendPrivateMessage(message: ChatMessage): void {
    if (!message.sender || !message.receiver) {
      toast.error("Invalid message");
      return;
    }

    message.timestamp = new Date().toISOString();
    const key = this.getPrivateKey(message.sender, message.receiver);
    
    if (!mockPrivateMessages[key]) {
      mockPrivateMessages[key] = [];
    }
    
    mockPrivateMessages[key].push(message);
    this.notifySubscribers(message);
    toast.success("Message sent");
  }
  
  onMessage(callback: (message: ChatMessage) => void) {
    this.messageCallbacks.push(callback);
    return () => {
      this.messageCallbacks = this.messageCallbacks.filter(cb => cb !== callback);
    };
  }
  
  private notifySubscribers(message: ChatMessage) {
    this.messageCallbacks.forEach(callback => callback(message));
  }
}

export const chatService = new ChatService();
