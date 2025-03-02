package com.backend.backend.DTO;

import lombok.*;

import java.util.List;

@Data
@Getter
@Setter
@AllArgsConstructor
@Builder
public class TaskResponse
{
    private String id;
    private String taskName;
    private String taskDescription;
    private String taskStatus;
    private String assignedTaskDate;
    private String assignedTaskTime;
    private List<String> assignees;
    private String deadline;

    public TaskResponse(TaskResponseBuilder taskResponseBuilder) {
        this.id = taskResponseBuilder.id;
        this.taskName = taskResponseBuilder.taskName;
        this.taskDescription = taskResponseBuilder.taskDescription;
        this.taskStatus = taskResponseBuilder.taskStatus;
        this.assignedTaskDate = taskResponseBuilder.assignedTaskDate;
        this.assignedTaskTime = taskResponseBuilder.assignedTaskTime;
        this.assignees = taskResponseBuilder.assignees;
        this.deadline = taskResponseBuilder.deadline;
    }

    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }

    public String getAssignedTaskDate() {
        return assignedTaskDate;
    }
    public void setAssignedTaskDate(String assignedTaskDate) {
        this.assignedTaskDate = assignedTaskDate;
    }
    public String getAssignedTaskTime() {
        return assignedTaskTime;
    }
    public void setAssignedTaskTime(String assignedTaskTime) {
        this.assignedTaskTime = assignedTaskTime;
    }
    public String getTaskName() {
        return taskName;
    }
    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }
    public String getTaskDescription() {
        return taskDescription;
    }
    public void setTaskDescription(String taskDescription) {
        this.taskDescription = taskDescription;
    }
    public String getTaskStatus() {
        return taskStatus;
    }
    public void setTaskStatus(String taskStatus) {
        this.taskStatus = taskStatus;
    }
    public String getDeadline() {
        return deadline;
    }
    public void setDeadline(String deadline) {
        this.deadline = deadline;
    }
    public List<String> getAssignees() {
        return assignees;
    }
    public void setAssignees(List<String> assignees) {
        this.assignees = assignees;
    }

    public  TaskResponse()
    {

    }
    public static class TaskResponseBuilder {
        private String id;
        private String taskName;
        private String taskDescription;
        private String taskStatus;
        private String assignedTaskDate;
        private String assignedTaskTime;
        private List<String> assignees;
        private String deadline;
        public TaskResponseBuilder taskName(String taskName) {
            this.taskName = taskName;
            return this;
        }
        public TaskResponseBuilder id(String id) {
            this.id = id;
            return this;
        }
        public TaskResponseBuilder taskDescription(String taskDescription) {
            this.taskDescription = taskDescription;
            return this;
        }
        public TaskResponseBuilder taskStatus(String taskStatus) {
            this.taskStatus = taskStatus;
            return this;
        }
        public TaskResponseBuilder assignedTaskDate(String assignedTaskDate) {
            this.assignedTaskDate = assignedTaskDate;
            return this;
        }
        public TaskResponseBuilder assignedTaskTime(String assignedTaskTime) {
            this.assignedTaskTime = assignedTaskTime;
            return this;
        }
        public TaskResponseBuilder assignees(List<String> assignees) {
            this.assignees = assignees;
            return this;
        }
        public TaskResponseBuilder deadline(String deadline) {
            this.deadline = deadline;
            return this;
        }
        public TaskResponse build() {
            return new TaskResponse(this);
        }
    }
    public static TaskResponseBuilder builder() {
        return new TaskResponseBuilder();
    }
}
