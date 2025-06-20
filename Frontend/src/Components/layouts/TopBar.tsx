
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Bell,
  Calendar,
  Check,
  Search,
  MessageSquare,
  LogIn,
  User
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authApi } from "@/services/authApi";

export default function TopBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const isAuthenticated = authApi.isAuthenticated();
  const currentUser = authApi.getCurrentUser();
  
  const getTabValue = () => {
    if (currentPath === "/") return "calendar";
    if (currentPath === "/messages") return "messages";
    if (currentPath === "/tasks") return "tasks";
    return "calendar"; // Default
  };
  
  const handleLoginClick = () => {
    navigate('/messages');
  };
  
  return (
    <div className="h-16 border-b flex items-center justify-between px-6">
      <div className="flex items-center">
        <Tabs defaultValue={getTabValue()} value={getTabValue()} className="mr-6">
          <TabsList>
            <Link to="/">
              <TabsTrigger value="calendar" className="flex items-center gap-1">
                <Calendar size={14} />
                <span>Calendar</span>
              </TabsTrigger>
            </Link>
            <Link to="/messages">
              <TabsTrigger value="messages" className="flex items-center gap-1">
                <MessageSquare size={14} />
                <span>Messages</span>
              </TabsTrigger>
            </Link>
            <Link to="/tasks">
              <TabsTrigger value="tasks" className="flex items-center gap-1">
                <Check size={14} />
                <span>Tasks</span>
              </TabsTrigger>
            </Link>
          </TabsList>
        </Tabs>
        
        <div className="relative w-64">
          <Search size={16} className="absolute left-2.5 top-2.5 text-gray-400" />
          <Input 
            placeholder="Search..." 
            className="pl-8 h-9"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {isAuthenticated ? (
          <>
            <Button size="icon" variant="ghost" className="relative">
              <Bell size={18} />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
            
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-workspace-purple flex items-center justify-center text-white font-medium">
                {currentUser?.substring(0, 2).toUpperCase() || 'AL'}
              </div>
              <span className="ml-2 font-medium hidden md:inline">{currentUser}</span>
            </div>
          </>
        ) : (
          <Button onClick={handleLoginClick} size="sm" className="flex items-center gap-1">
            <LogIn size={14} />
            <span>Login</span>
          </Button>
        )}
      </div>
    </div>
  );
}
