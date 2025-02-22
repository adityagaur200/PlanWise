package com.backend.backend.DTO;
import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class TaskRequest {
    private String taskName;
    private String taskDescription;
    private String taskStatus;
    private String assignedTaskDate;
    private String assignedTaskTime;
    private List<String> assignees;
    private String deadline;

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

}
