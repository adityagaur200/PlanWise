package com.backend.backend.Services;

import com.backend.backend.DTO.TaskRequest;
import com.backend.backend.Model.Task;
import com.backend.backend.Repository.TaskRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {
    @Autowired
    private TaskRepo taskRepo;
    public void createTask(TaskRequest taskRequest) {
        Task task = Task.builder()
                .assignedTaskDate(taskRequest.getAssignedTaskDate())
                .assignedTaskTime(taskRequest.getAssignedTaskTime())
                .taskStatus(taskRequest.getTaskStatus())
                .taskName(taskRequest.getTaskName())
                .deadline(taskRequest.getDeadline())
                .assignees(taskRequest.getAssignees())
                .build();
        taskRepo.save(task);
    }

    public List<Task> getTasks() {
        return taskRepo.findAll();
    }
}
