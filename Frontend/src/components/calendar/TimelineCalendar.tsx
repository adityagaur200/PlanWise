import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Loader2 } from "lucide-react";
import TaskCard from "./TaskCard";
import { 
  format, 
  addDays, 
  startOfWeek, 
  startOfMonth,
  endOfMonth,
  addMonths,
  addWeeks,
  eachDayOfInterval,
  eachWeekOfInterval,
  isSameDay
} from "date-fns";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { 
  fetchAllTasks, 
  createTask, 
  mapResponseToTask,
  type TaskRequest
} from "@/services/taskApi";

// Dummy data for tasks
const TASKS = [
  {
    id: "1",
    title: "Website redesign kickoff",
    type: "meeting",
    date: new Date(),
    time: "10:00 AM",
    assignee: { name: "Alex", avatar: "AL" },
    color: "bg-blue-100 border-blue-200"
  },
  {
    id: "2",
    title: "Update user dashboard",
    type: "task",
    date: addDays(new Date(), 1),
    time: "All day",
    assignee: { name: "Sarah", avatar: "SJ" },
    color: "bg-purple-100 border-purple-200"
  },
  {
    id: "3",
    title: "Review PR #124",
    type: "task",
    date: addDays(new Date(), 2),
    time: "2:00 PM",
    assignee: { name: "Mike", avatar: "ML" },
    color: "bg-green-100 border-green-200"
  },
  {
    id: "4",
    title: "Client presentation",
    type: "meeting",
    date: addDays(new Date(), 3),
    time: "11:30 AM",
    assignee: { name: "Alex", avatar: "AL" },
    color: "bg-yellow-100 border-yellow-200"
  }
];

export default function TimelineCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [viewMode, setViewMode] = useState("week"); // "day", "week", or "month"
  const [newTask, setNewTask] = useState<TaskRequest>({
    title: "",
    type: "task",
    date: format(new Date(), "yyyy-MM-dd"),
    time: "10:00 AM",
    assignee: "Alex",
    color: "bg-blue-100 border-blue-200"
  });

  // Query to fetch tasks
  const queryClient = useQueryClient();
  const { data: tasksData, isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchAllTasks,
  });

  // Mutation for creating new tasks
  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      resetTaskForm();
    },
  });

  // Reset the task form
  const resetTaskForm = () => {
    setNewTask({
      title: "",
      type: "task",
      date: format(new Date(), "yyyy-MM-dd"),
      time: "10:00 AM",
      assignee: "Alex",
      color: "bg-blue-100 border-blue-200"
    });
    setShowCreateTask(false);
  };

  // Handle task creation
  const handleCreateTask = () => {
    createTaskMutation.mutate(newTask);
  };

  // Process tasks data for display
  const tasks = tasksData 
    ? tasksData.map(mapResponseToTask)
    : [];

  // Handle view mode changes
  const handleViewChange = (value: string) => {
    setViewMode(value);
  };
  
  // Navigation functions based on current view
  const goToPrev = () => {
    if (viewMode === "day") {
      setCurrentDate(addDays(currentDate, -1));
    } else if (viewMode === "week") {
      setCurrentDate(addWeeks(currentDate, -1));
    } else if (viewMode === "month") {
      setCurrentDate(addMonths(currentDate, -1));
    }
  };
  
  const goToNext = () => {
    if (viewMode === "day") {
      setCurrentDate(addDays(currentDate, 1));
    } else if (viewMode === "week") {
      setCurrentDate(addWeeks(currentDate, 1));
    } else if (viewMode === "month") {
      setCurrentDate(addMonths(currentDate, 1));
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  // Calculate days to display based on view mode
  const getDaysToDisplay = () => {
    if (viewMode === "day") {
      return [currentDate];
    } else if (viewMode === "week") {
      // Calculate the start of the week (Monday)
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
      // Generate array of days for the week
      return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    } else if (viewMode === "month") {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      
      // Generate all days in the month
      return eachDayOfInterval({ start: monthStart, end: monthEnd });
    }
    
    return [];
  };
  
  const daysToDisplay = getDaysToDisplay();
  
  // Generate the date range title based on view mode
  const getDateRangeTitle = () => {
    if (viewMode === "day") {
      return format(currentDate, "MMMM d, yyyy");
    } else if (viewMode === "week") {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
      return `Week of ${format(weekStart, "MMM d")}`;
    } else if (viewMode === "month") {
      return format(currentDate, "MMMM yyyy");
    }
    return "";
  };

  const renderCalendarGrid = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      );
    }

    if (viewMode === "month") {
      // For month view, we need to organize days into weeks
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      const firstWeekStart = startOfWeek(monthStart, { weekStartsOn: 1 });
      
      // Get all weeks that include days of the current month
      const weeks = eachWeekOfInterval(
        { start: firstWeekStart, end: monthEnd },
        { weekStartsOn: 1 }
      );
      
      return (
        <div className="flex-1 grid grid-cols-7 gap-1">
          {/* Day headers */}
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
            <div key={i} className="text-center p-1 font-medium text-sm">
              {day}
            </div>
          ))}
          
          {/* Calendar cells */}
          {weeks.map((weekStart, weekIndex) => {
            const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
            
            return days.map((day, dayIndex) => {
              const isCurrentMonth = day.getMonth() === currentDate.getMonth();
              const isToday = isSameDay(day, new Date());
              
              // Filter tasks for this day
              const dayTasks = tasks.filter(
                task => {
                  const taskDate = task.date instanceof Date ? task.date : new Date(task.date);
                  return isSameDay(taskDate, day);
                }
              );
              
              return (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className={`border rounded-md p-1 min-h-[100px] ${
                    !isCurrentMonth 
                      ? "bg-gray-50 text-gray-400" 
                      : isToday 
                        ? "border-primary/30" 
                        : "border-border"
                  }`}
                >
                  <div className="text-end mb-1">
                    <span className={`inline-block w-6 h-6 rounded-full text-xs ${
                      isToday ? "bg-primary text-white" : ""
                    } flex items-center justify-center`}>
                      {format(day, "d")}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {dayTasks.slice(0, 2).map(task => (
                      <div key={task.id} className={`${task.color} p-1 rounded text-xs truncate`}>
                        {task.title}
                      </div>
                    ))}
                    {dayTasks.length > 2 && (
                      <div className="text-xs text-muted-foreground">
                        +{dayTasks.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            });
          })}
        </div>
      );
    } else if (viewMode === "day") {
      // Single day view
      return (
        <div className="flex-1 grid grid-cols-1 gap-4 mt-2">
          <div className="text-center p-2 font-medium">
            <div className="text-sm mb-1">{format(currentDate, "EEE")}</div>
            <div className="text-lg">{format(currentDate, "d")}</div>
          </div>
          
          <div className="border rounded-md min-h-full">
            <div className="p-2 space-y-2">
              {tasks.filter(task => {
                const taskDate = task.date instanceof Date ? task.date : new Date(task.date);
                return isSameDay(taskDate, currentDate);
              }).map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
              
              <Button 
                variant="ghost" 
                className="w-full justify-start text-muted-foreground text-xs h-auto py-1"
                onClick={() => {
                  setNewTask({
                    ...newTask,
                    date: format(currentDate, "yyyy-MM-dd")
                  });
                  setShowCreateTask(true);
                }}
              >
                <Plus size={12} className="mr-1" /> Add task
              </Button>
            </div>
          </div>
        </div>
      );
    } else {
      // Week view (default)
      const daysToDisplay = getDaysToDisplay();
      
      return (
        <>
          <div className="grid grid-cols-7 gap-4">
            {daysToDisplay.map((day, index) => (
              <div 
                key={index} 
                className={`text-center p-2 font-medium ${
                  isSameDay(day, new Date())
                    ? "bg-primary/10 rounded-t-md"
                    : ""
                }`}
              >
                <div className="text-sm mb-1">{format(day, "EEE")}</div>
                <div className="text-lg">{format(day, "d")}</div>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-4 mt-2 flex-1">
            {daysToDisplay.map((day, dayIndex) => {
              // Filter tasks for this day
              const dayTasks = tasks.filter(task => {
                const taskDate = task.date instanceof Date ? task.date : new Date(task.date);
                return isSameDay(taskDate, day);
              });
              
              return (
                <div 
                  key={dayIndex} 
                  className={`min-h-full border rounded-md ${
                    isSameDay(day, new Date())
                      ? "border-primary/30"
                      : "border-border"
                  }`}
                >
                  <div className="p-2 space-y-2">
                    {dayTasks.map(task => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                    
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-muted-foreground text-xs h-auto py-1"
                      onClick={() => {
                        setNewTask({
                          ...newTask,
                          date: format(day, "yyyy-MM-dd")
                        });
                        setShowCreateTask(true);
                      }}
                    >
                      <Plus size={12} className="mr-1" /> Add task
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      );
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">Timeline</h2>
          <span className="text-muted-foreground text-sm">
            {getDateRangeTitle()}
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center rounded-md border">
            <Button 
              variant="ghost" 
              size="icon"
              className="rounded-r-none"
              onClick={goToPrev}
            >
              <ChevronLeft size={16} />
            </Button>
            <Button 
              variant="ghost"
              size="sm"
              className="h-9 rounded-none border-l border-r"
              onClick={goToToday}
            >
              Today
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="rounded-l-none"
              onClick={goToNext}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
          
          <Select defaultValue={viewMode} onValueChange={handleViewChange}>
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
            </SelectContent>
          </Select>
          
          <Popover open={showCreateTask} onOpenChange={setShowCreateTask}>
            <PopoverTrigger asChild>
              <Button className="gap-1">
                <Plus size={16} /> New Task
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h3 className="font-medium">Create New Task</h3>
                
                <div className="space-y-2">
                  <Input 
                    placeholder="Task name" 
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Select 
                    value={newTask.type} 
                    onValueChange={(value) => setNewTask({...newTask, type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Task type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="task">Task</SelectItem>
                      <SelectItem value="meeting">Meeting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex gap-2">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarIcon size={14} />
                      <span>Date</span>
                    </div>
                    <Input 
                      type="date" 
                      value={newTask.date}
                      onChange={(e) => setNewTask({...newTask, date: e.target.value})}
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Time</span>
                    </div>
                    <Input 
                      placeholder="e.g., 10:00 AM"
                      value={newTask.time}
                      onChange={(e) => setNewTask({...newTask, time: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Assignee</span>
                  </div>
                  <Select 
                    value={newTask.assignee}
                    onValueChange={(value) => setNewTask({...newTask, assignee: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Alex">Alex Lee</SelectItem>
                      <SelectItem value="Sarah">Sarah Johnson</SelectItem>
                      <SelectItem value="Mike">Mike Lewis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowCreateTask(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreateTask}
                    disabled={createTaskMutation.isPending}
                  >
                    {createTaskMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : "Create"}
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      {renderCalendarGrid()}
      
      
    </div>
  );
}
