package com.backend.backend.Services;

import com.backend.backend.DTO.TaskRequest;
import com.backend.backend.DTO.TaskResponse;
import com.backend.backend.Model.Task;
import com.backend.backend.Repository.TaskRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {
    @Autowired
    private TaskRepo taskRepo;
    private final WebClient.Builder webClientBuilder;

    public TaskService(WebClient.Builder webClientBuilder) {
        this.webClientBuilder = webClientBuilder;
    }

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

    public List<TaskResponse> getTasks()
    {
        List<Task> tasks = taskRepo.findAll();
        return tasks.stream().map(this:: mapToTaskResponse).toList();

    }

    private TaskResponse mapToTaskResponse(Task task) {
        TaskResponse taskResponse = TaskResponse.builder().id(task.getid())
                .taskDescription(task.getTaskDescription()).assignedTaskDate(task.getAssignedTaskDate()).taskName(task.getTaskName())
                .assignees(task.getAssignees()).deadline(task.getDeadline()).taskStatus(task.getTaskStatus()).build();
        return taskResponse;
    }

    public List<TaskResponse> getFilterTask(String user) {
       TaskResponse[] TaskResponseArray = webClientBuilder.build().get()
               .uri("http://localhost:3030/api/Task/task").retrieve().bodyToMono(TaskResponse[].class).block();
       if(TaskResponseArray == null)
       {
           return List.of();
       }
       return List.of(TaskResponseArray).stream().filter(taskResponse -> taskResponse.getAssignees().contains(user)).collect(Collectors.toList());
    }
}
