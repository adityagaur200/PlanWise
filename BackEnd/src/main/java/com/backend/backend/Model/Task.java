package com.backend.backend.Model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document
@Getter
@Setter
@Data
@AllArgsConstructor
@Builder // Correct placement of @Builder
public class Task {
    @Id
    private String id;
    private String taskName;
    private String taskDescription;
    private String taskStatus;
    private String assignedTaskDate;
    private String assignedTaskTime;
    private List<String> assignees;
    private String deadline;

    private Task(TaskBuilder builder) {

        this.taskName = builder.taskName;
        this.taskDescription = builder.taskDescription;
        this.taskStatus = builder.taskStatus;
        this.assignedTaskDate = builder.assignedTaskDate;
        this.assignedTaskTime = builder.assignedTaskTime;
        this.assignees = builder.assignees;
        this.deadline = builder.deadline;
    }
    public Task()
    {

    }

    public  String getid(){
        return id;
    }
    public void setid(String id){
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


    public String setTaskStatus(String taskStatus)
    {
        this.taskStatus = taskStatus;
        return taskStatus;
    }


    public static class TaskBuilder {
        private String taskName;
        private String taskDescription;
        private String taskStatus;
        private String assignedTaskDate;
        private String assignedTaskTime;
        private List<String> assignees;
        private String deadline;
        public TaskBuilder taskName(String taskName) {
            this.taskName = taskName;
            return this;
        }
        public TaskBuilder taskDescription(String taskDescription) {
            this.taskDescription = taskDescription;
            return this;
        }
        public TaskBuilder taskStatus(String taskStatus) {
            this.taskStatus = taskStatus;
            return this;
        }
        public TaskBuilder assignedTaskDate(String assignedTaskDate) {
            this.assignedTaskDate = assignedTaskDate;
            return this;
        }
        public TaskBuilder assignedTaskTime(String assignedTaskTime) {
            this.assignedTaskTime = assignedTaskTime;
            return this;
        }
        public TaskBuilder assignees(List<String> assignees) {
            this.assignees = assignees;
            return this;
        }
        public TaskBuilder deadline(String deadline) {
            this.deadline = deadline;
            return this;
        }
        public Task build() {
            return new Task(this);
        }
    }
    public static TaskBuilder builder() {
        return new TaskBuilder();
    }
}
