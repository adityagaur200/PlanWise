
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Plus,
  Calendar,
  CheckSquare,
  Users,
  Settings,
  LogOut,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authApi } from "@/services/authApi";
import { toast } from "sonner";

type ChannelItemProps = {
  name: string;
  to: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

const ChannelItem = ({ name, to, icon, onClick }: ChannelItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link to={to} className="block" onClick={onClick}>
      <div className={`channel-item flex items-center p-2 rounded-md text-sidebar-foreground hover:bg-sidebar-hover cursor-pointer mb-1 ${isActive ? 'bg-sidebar-active text-sidebar-active-foreground' : ''}`}>
        {icon && <span className="mr-2">{icon}</span>}
        <span>{name}</span>
      </div>
    </Link>
  );
};

export default function Sidebar() {
  const navigate = useNavigate();
  const isAuthenticated = authApi.isAuthenticated();

  const handleLogout = () => {
    authApi.logout();
    toast.success("You have been logged out successfully.");
    navigate('/messages');
  };

  return (
    <div className="h-screen w-64 bg-sidebar fixed left-0 top-0 flex flex-col">
      <div className="p-4 border-b border-sidebar-border">
        <h2 className="text-xl font-bold text-sidebar-foreground flex items-center">
          <span className="bg-workspace-purple w-5 h-5 mr-2 rounded-md"></span>
          SynQ
        </h2>
      </div>
      
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sidebar-foreground/70 text-sm font-medium">Channels</h3>
            <Button size="icon" variant="ghost" className="h-5 w-5 text-sidebar-foreground/70 hover:text-sidebar-foreground">
              <Plus size={14} />
            </Button>
          </div>
          
          <ChannelItem name="general" to="/messages" icon={<MessageSquare size={16} />} />
          <ChannelItem 
            name="announcements" 
            to="/messages" 
            icon={<MessageSquare size={16} />}
            onClick={() => {
              // This will be handled in the Messages component
              localStorage.setItem('selectedChannel', 'announcements');
            }} 
          />
          <ChannelItem 
            name="random" 
            to="/messages" 
            icon={<MessageSquare size={16} />}
            onClick={() => {
              localStorage.setItem('selectedChannel', 'random');
            }} 
          />
        </div>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sidebar-foreground/70 text-sm font-medium">Planning</h3>
            <Button size="icon" variant="ghost" className="h-5 w-5 text-sidebar-foreground/70 hover:text-sidebar-foreground">
              <Plus size={14} />
            </Button>
          </div>
          
          <ChannelItem name="calendar" to="/" icon={<Calendar size={16} />} />
          <ChannelItem name="tasks" to="/tasks" icon={<CheckSquare size={16} />} />
        </div>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sidebar-foreground/70 text-sm font-medium">Team</h3>
            <Button size="icon" variant="ghost" className="h-5 w-5 text-sidebar-foreground/70 hover:text-sidebar-foreground">
              <Plus size={14} />
            </Button>
          </div>
          
          <ChannelItem 
            name="design" 
            to="/messages" 
            icon={<Users size={16} />}
            onClick={() => {
              localStorage.setItem('selectedChannel', 'design');
            }} 
          />
          <ChannelItem 
            name="development" 
            to="/messages" 
            icon={<Users size={16} />}
            onClick={() => {
              localStorage.setItem('selectedChannel', 'development');
            }} 
          />
          <ChannelItem 
            name="marketing" 
            to="/messages" 
            icon={<Users size={16} />}
            onClick={() => {
              localStorage.setItem('selectedChannel', 'marketing');
            }} 
          />
        </div>
      </div>
      
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-workspace-purple flex items-center justify-center text-white font-medium">
              {authApi.getCurrentUser()?.substring(0, 2).toUpperCase() || 'TS'}
            </div>
            <span className="ml-2 text-sidebar-foreground font-medium">
              {authApi.getCurrentUser() || 'SynQ'}
            </span>
          </div>
          {isAuthenticated ? (
            <Button 
              size="icon" 
              variant="ghost" 
              className="text-sidebar-foreground/70 hover:text-sidebar-foreground"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut size={16} />
            </Button>
          ) : (
            <Button size="icon" variant="ghost" className="text-sidebar-foreground/70 hover:text-sidebar-foreground">
              <Settings size={16} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
