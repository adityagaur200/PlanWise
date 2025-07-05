
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { CalendarIcon, CheckSquare } from "lucide-react";

type TaskProps = {
  task: {
    id: string;
    title: string;
    type: string;
    time: string;
    assignee: {
      name: string;
      avatar: string;
    };
    color: string;
  };
};

export default function TaskCard({ task }: TaskProps) {
  return (
    <div className={cn("task-card p-2 rounded-md", task.color)}>
      <div className="flex justify-between items-start mb-1">
        <span className="font-medium text-sm">{task.title}</span>
        <Avatar className="h-5 w-5">
          <AvatarFallback className="text-[10px]">{task.assignee.avatar}</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex items-center text-xs text-muted-foreground">
        {task.type === "meeting" ? (
          <CalendarIcon size={12} className="mr-1" />
        ) : (
          <CheckSquare size={12} className="mr-1" />
        )}
        <span>{task.time}</span>
      </div>
    </div>
  );
}
