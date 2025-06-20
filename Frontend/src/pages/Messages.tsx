
import { useState } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import MessagesList from "@/components/messages/MessagesList";
import { authApi } from "@/services/authApi";
import LoginForm from "@/components/auth/LoginForm";

const Messages = () => {
  const [selectedChannel, setSelectedChannel] = useState("general");
  const [isAuthenticated, setIsAuthenticated] = useState(authApi.isAuthenticated());

  const handleChannelSelect = (channel: string) => {
    setSelectedChannel(channel);
  };

  if (!isAuthenticated) {
    return (
      <MainLayout>
        <div className="max-w-md mx-auto mt-10">
          <LoginForm onLoginSuccess={() => setIsAuthenticated(true)} />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <MessagesList
        selectedChannel={selectedChannel}
        onChannelSelect={handleChannelSelect}
      />
    </MainLayout>
  );
};

export default Messages;
