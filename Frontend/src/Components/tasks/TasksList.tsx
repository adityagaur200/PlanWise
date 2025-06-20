
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CheckSquare, Calendar, Plus, Loader2 } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { 
  fetchAllTasks, 
  createTask, 
  updateTask, 
  mapResponseToTask,
  type Task,
  type TaskRequest 
} from "@/services/taskApi";

const ASSIGNEES = [
  { name: "Alex", avatar: "AL" },
  { name: "Sarah", avatar: "SJ" },
  { name: "Mike", avatar: "ML" },
];

const TASK_COLORS = [
  { value: "bg-blue-100 border-blue-200", label: "Blue" },
  { value: "bg-purple-100 border-purple-200", label: "Purple" },
  { value: "bg-green-100 border-green-200", label: "Green" },
  { value: "bg-yellow-100 border-yellow-200", label: "Yellow" },
  { value: "bg-red-100 border-red-200", label: "Red" },
];

const TasksList = () => {
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState<TaskRequest>({
    title: "",
    type: "task",
    date: new Date().toISOString().split('T')[0],
    time: "10:00 AM",
    assignee: "Alex",
  });
  
  const queryClient = useQueryClient();
  
  // Query to fetch tasks
  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchAllTasks,
  });

  // Mutation for creating new tasks
  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      resetForm();
    },
  });

  // Mutation for updating tasks
  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: TaskRequest }) => 
      updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      resetForm();
    },
  });

  // Reset form and close dialog
  const resetForm = () => {
    setNewTask({
      title: "",
      type: "task",
      date: new Date().toISOString().split('T')[0],
      time: "10:00 AM",
      assignee: "Alex",
    });
    setEditingTask(null);
    setShowCreateTask(false);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTask) {
      updateTaskMutation.mutate({
        id: editingTask.id,
        data: newTask
      });
    } else {
      createTaskMutation.mutate(newTask);
    }
  };

  // Set up form for editing a task
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      type: task.type,
      date: typeof task.date === 'string' 
        ? task.date 
        : task.date.toISOString().split('T')[0],
      time: task.time,
      assignee: task.assignee.name,
      color: task.color,
    });
    setShowCreateTask(true);
  };

  // Process tasks data for display
  const displayTasks = tasks 
    ? tasks.map(mapResponseToTask)
    : [];

  if (error) {
    toast.error("Failed to load tasks");
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">Tasks</h2>
          <span className="text-muted-foreground text-sm">
            {displayTasks.length} tasks
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <Button 
            className="gap-1" 
            onClick={() => setShowCreateTask(true)}
          >
            <Plus size={16} /> New Task
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayTasks.map((task) => (
            <Card 
              key={task.id} 
              className={`p-4 ${task.color} border cursor-pointer hover:shadow-md transition-shadow`}
              onClick={() => handleEditTask(task)}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium">{task.title}</span>
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-[12px]">
                    {task.assignee.avatar}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex items-center text-xs text-muted-foreground mt-2">
                {task.type === "meeting" ? (
                  <Calendar size={14} className="mr-1" />
                ) : (
                  <CheckSquare size={14} className="mr-1" />
                )}
                <span>{task.time}</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Task Creation/Edit Dialog */}
      <Dialog open={showCreateTask} onOpenChange={setShowCreateTask}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingTask ? "Edit Task" : "Create New Task"}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="title" className="text-right font-medium">
                  Title
                </label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="type" className="text-right font-medium">
                  Type
                </label>
                <Select
                  value={newTask.type}
                  onValueChange={(value) => setNewTask({...newTask, type: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select task type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="task">Task</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="date" className="text-right font-medium">
                  Date
                </label>
                <Input
                  id="date"
                  type="date"
                  value={newTask.date}
                  onChange={(e) => setNewTask({...newTask, date: e.target.value})}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="time" className="text-right font-medium">
                  Time
                </label>
                <Input
                  id="time"
                  value={newTask.time}
                  onChange={(e) => setNewTask({...newTask, time: e.target.value})}
                  className="col-span-3"
                  placeholder="e.g., 10:00 AM"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="assignee" className="text-right font-medium">
                  Assignee
                </label>
                <Select
                  value={newTask.assignee}
                  onValueChange={(value) => setNewTask({...newTask, assignee: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    {ASSIGNEES.map((person) => (
                      <SelectItem key={person.name} value={person.name}>
                        {person.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="color" className="text-right font-medium">
                  Color
                </label>
                <Select
                  value={newTask.color || "bg-blue-100 border-blue-200"}
                  onValueChange={(value) => setNewTask({...newTask, color: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    {TASK_COLORS.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className="flex items-center">
                          <div className={`w-4 h-4 rounded mr-2 ${color.value}`}></div>
                          {color.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={resetForm}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={createTaskMutation.isPending || updateTaskMutation.isPending}
              >
                {(createTaskMutation.isPending || updateTaskMutation.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editingTask ? "Update Task" : "Create Task"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TasksList;
