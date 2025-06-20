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
    private String title;
    private String type;
    private String date;
    private String time;
    private List<String> assignees;

    private Task(TaskBuilder builder) {
        this.assignees = builder.assignees;
        this.date = builder.date;
        this.type = builder.type;
        this.time = builder.time;
        this.title= builder.title;
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
        return date;
    }
    public void setAssignedTaskDate(String date) {
        this.date = date;
    }
    public String getAssignedTaskTime() {
        return time;
    }
    public void setAssignedTaskTime(String time) {
        this.time = time;
    }
    public String getTaskName() {
        return title;
    }
    public void setTaskName(String title) {
        this.title = title;
    }
    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }
    public List<String> getAssignees() {
        return assignees;
    }
    public void setAssignees(List<String> assignees) {
        this.assignees = assignees;
    }

    public String getTaskStatus() {
        return type;
    }

    public void setTaskStatus(String taskStatus) {
        this.type = taskStatus;

    }


    public static class TaskBuilder {
        private String title;
        private String type;
        private String date;
        private String time;
        private List<String> assignees;

        public TaskBuilder taskName(String title) {
            this.title=title;
            return this;
        }
        public TaskBuilder type(String type) {
            this.type=type;
            return this;
        }
        public TaskBuilder assignedTaskDate(String date) {
            this.date = date;
            return this;
        }
        public TaskBuilder assignedTaskTime(String time) {
            this.time = time;
            return this;
        }
        public TaskBuilder assignees(List<String> assignees) {
            this.assignees = assignees;
            return this;
        }
        public Task build() {
            return new Task(this);
        }

        public TaskBuilder tasktype(String taskStatus)
        {
            this.type = taskStatus;
            return this;
        }
    }
    public static TaskBuilder builder() {
        return new TaskBuilder();
    }
}