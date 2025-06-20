
import { toast } from "sonner";

// Define the Task interface based on your backend model
export interface Task {
  id: string;
  title: string;
  type: string;
  date: Date | string;
  time: string;
  assignee: {
    name: string;
    avatar: string;
  };
  color: string;
}

export interface TaskRequest {
  title: string;
  type: string;
  date: string;
  time: string;
  assignee: string;
  color?: string;
}

export interface TaskResponse {
  id: string;
  title: string;
  type: string;
  date: string;
  time: string;
  assignee: string;
  color: string;
}

// Base URL for the API
const API_BASE_URL = "http://localhost:3030/api/Task";

// Function to handle API errors
const handleApiError = (error: unknown) => {
  console.error("API Error:", error);
  toast.error("Error connecting to task service");
  return null;
};

// Get all tasks
export const fetchAllTasks = async (): Promise<TaskResponse[] | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/task`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};

// Get tasks filtered by user
export const fetchTasksByUser = async (
  user: string,
  token: string
): Promise<TaskResponse[] | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/task/${user}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};

// Create a new task
export const createTask = async (
  taskData: TaskRequest
): Promise<{ message: string } | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const result = await response.json();
    toast.success("Task created successfully");
    return result;
  } catch (error) {
    return handleApiError(error);
  }
};

// Update an existing task
export const updateTask = async (
  id: string,
  taskData: TaskRequest
): Promise<TaskResponse[] | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/task/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const result = await response.json();
    toast.success("Task updated successfully");
    return result;
  } catch (error) {
    return handleApiError(error);
  }
};

// Helper to convert API responses to our local Task format
export const mapResponseToTask = (response: TaskResponse): Task => {
  return {
    id: response.id,
    title: response.title,
    type: response.type,
    date: new Date(response.date),
    time: response.time,
    assignee: {
      name: response.assignee,
      avatar: getAvatarInitials(response.assignee),
    },
    color: response.color || "bg-blue-100 border-blue-200",
  };
};

// Helper to get avatar initials from name
const getAvatarInitials = (name: string): string => {
  if (!name) return "XX";
  
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  
  return name.substring(0, 2).toUpperCase();
};
