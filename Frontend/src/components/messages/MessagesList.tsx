
import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Send } from "lucide-react";
import { authApi } from "@/services/authApi";
import { chatService, ChatMessage } from "@/services/chatApi";

interface MessagesListProps {
  selectedChannel: string;
  onChannelSelect: (channel: string) => void;
}

// Map channel names to roomIds
const CHANNEL_ROOM_MAP: Record<string, string> = {
  "general": "general",
  "announcements": "announcements",
  "random": "random",
  "design": "design",
  "development": "development",
  "marketing": "marketing"
};

const MessagesList = ({ selectedChannel, onChannelSelect }: MessagesListProps) => {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isPrivateChat, setIsPrivateChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUser = authApi.getCurrentUser();
  
  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      const usersList = await authApi.getAllUsers();
      setUsers(usersList);
      
      // Set default selected member
      if (usersList.length > 0) {
        setSelectedMember(usersList[0]);
      }
    };
    
    fetchUsers();
  }, []);
  
  // Load initial messages when component mounts or channel/member changes
  useEffect(() => {
    if (isPrivateChat && selectedMember && currentUser) {
      const privateMessages = chatService.getPrivateMessages(currentUser, selectedMember.username);
      setMessages(privateMessages);
    } else if (selectedChannel) {
      const channelMessages = chatService.getMessagesForChannel(selectedChannel);
      setMessages(channelMessages);
    }
  }, [selectedChannel, selectedMember, isPrivateChat, currentUser]);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: ChatMessage = {
        sender: currentUser || "Anonymous",
        content: message,
        type: "CHAT"
      };
      
      if (isPrivateChat && selectedMember) {
        // Private message
        newMessage.receiver = selectedMember.username;
        chatService.sendPrivateMessage(newMessage);
      } else {
        // Group message
        newMessage.roomId = CHANNEL_ROOM_MAP[selectedChannel];
        chatService.sendPublicMessage(newMessage);
      }
      
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleMemberSelect = (member: any) => {
    setSelectedMember(member);
    setIsPrivateChat(true);
    
    if (currentUser) {
      const privateMessages = chatService.getPrivateMessages(currentUser, member.username);
      setMessages(privateMessages);
    }
  };

  const handleChannelSelect = (channelName: string) => {
    onChannelSelect(channelName);
    setIsPrivateChat(false);
    const channelMessages = chatService.getMessagesForChannel(channelName);
    setMessages(channelMessages);
  };

  // Return loading state if not authenticated
  if (!currentUser) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Please log in to view messages</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex">
      {/* Member list sidebar */}
      <div className="w-64 border-r h-full overflow-y-auto">
        <div className="p-4 border-b">
          <h3 className="font-medium">Channels</h3>
        </div>
        {Object.keys(CHANNEL_ROOM_MAP).map((channel) => (
          <div
            key={channel}
            className={`flex items-center p-3 cursor-pointer hover:bg-gray-100 ${
              selectedChannel === channel && !isPrivateChat ? "bg-gray-100" : ""
            }`}
            onClick={() => handleChannelSelect(channel)}
          >
            <div className="font-medium text-sm"># {channel}</div>
          </div>
        ))}
        
        <div className="p-4 border-b border-t mt-4">
          <h3 className="font-medium">Direct Messages</h3>
        </div>
        {users.filter(user => user.username !== currentUser).map((user) => (
          <div
            key={user.id || user.username}
            className={`flex items-center p-3 cursor-pointer hover:bg-gray-100 ${
              isPrivateChat && selectedMember?.username === user.username ? "bg-gray-100" : ""
            }`}
            onClick={() => handleMemberSelect(user)}
          >
            <div className="relative">
              <Avatar className="h-8 w-8 mr-3">
                <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-2 w-2 h-2 rounded-full bg-green-500" />
            </div>
            <div className="font-medium text-sm">{user.username}</div>
          </div>
        ))}
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col h-full">
        {/* Chat header */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center">
            {isPrivateChat ? (
              <>
                <Avatar className="h-8 w-8 mr-3">
                  <AvatarFallback>
                    {selectedMember?.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="font-medium">{selectedMember?.username}</div>
              </>
            ) : (
              <div className="font-medium"># {selectedChannel}</div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => {
            const isCurrentUser = msg.sender === currentUser;

            return (
              <div 
                key={index} 
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                  {!isCurrentUser && (
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarFallback>{msg.sender.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`max-w-xs ${isCurrentUser ? 'mr-2' : 'ml-2'}`}>
                    <Card className={`p-3 ${isCurrentUser ? 'bg-primary text-primary-foreground' : ''}`}>
                      {msg.content}
                    </Card>
                    <div className="text-xs text-muted-foreground mt-1 flex">
                      {!isCurrentUser && <span className="mr-2">{msg.sender}</span>}
                      <span>{new Date(msg.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Message input */}
        <div className="p-4 border-t flex gap-2">
          <Input 
            className="flex-1" 
            placeholder={`Message ${isPrivateChat ? selectedMember?.username : '#' + selectedChannel}...`} 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <Button onClick={handleSendMessage}>
            <Send size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessagesList;
