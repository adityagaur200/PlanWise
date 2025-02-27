package com.backend.backend.Services;

import com.backend.backend.DTO.TaskRequest;
import com.backend.backend.DTO.TaskResponse;
import com.backend.backend.Model.Task;
import com.backend.backend.Repository.TaskRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TaskService {
    @Autowired
    private TaskRepo taskRepo;
    private final WebClient.Builder webClientBuilder;
    @Autowired
    private JWTservice jwtService;

    public TaskService(WebClient.Builder webClientBuilder) {
        this.webClientBuilder = webClientBuilder;
    }
// CREATING TASK SERVICE
    public void createTask(TaskRequest taskRequest) {
// MAPPING MY TASKREQUEST AND TASK MODEL
        Task task = Task.builder()
                .assignedTaskDate(taskRequest.getAssignedTaskDate())
                .assignedTaskTime(taskRequest.getAssignedTaskTime())
                .taskStatus(taskRequest.getTaskStatus())
                .taskName(taskRequest.getTaskName())
                .deadline(taskRequest.getDeadline())
                .assignees(taskRequest.getAssignees())
                .build();
// SAVEING MY MODEL..
        taskRepo.save(task);
    }

// CREATE GET TASK SERVICE TO GET ALL THE TASKS.
    public List<TaskResponse> getTasks()
    {
        List<Task> tasks = taskRepo.findAll();
        return tasks.stream().map(this:: mapToTaskResponse).toList();

    }

// MAPPING TO MY TASKRESPONSE DTO.
    private TaskResponse mapToTaskResponse(Task task) {
        TaskResponse taskResponse = TaskResponse.builder().id(task.getid())
                               .taskDescription(task.getTaskDescription()).assignedTaskDate(task.getAssignedTaskDate()).taskName(task.getTaskName())
                               .assignees(task.getAssignees()).deadline(task.getDeadline()).taskStatus(task.getTaskStatus()).build();
                           return taskResponse;
                       }

// CREATING SERVICE FOR FILTER THE TASK ON THE BASICS OF USER
        public List<TaskResponse> getFilterTask(String user, String jwtToken) {
            //USING WEBCLIENT AND SEND AND RETRIVEING THE DATA.
            TaskResponse[] TaskResponseArray = webClientBuilder.build().get()
                    .uri("http://localhost:3030/api/Task/task")
                    .headers(httpHeaders -> httpHeaders.setBearerAuth(jwtToken))
               .retrieve().bodyToMono(TaskResponse[].class).block();
       if(TaskResponseArray == null)
       {
           return List.of();
       }
       // RETURNING THE LIST
       return List.of(TaskResponseArray).stream().filter(taskResponse -> taskResponse.getAssignees().contains(user)).collect(Collectors.toList());
    }

// UPDATING THE RESPONSE
    public List<TaskResponse> getUpdatedTask(String id, TaskRequest taskRequest) {
        Optional<Task> tasks = taskRepo.findById(id);

        if(tasks.isPresent())
        {
            Task task = tasks.get();
            task.setTaskStatus(taskRequest.getTaskStatus());
            taskRepo.save(task);
            return List.of(mapToTaskupdatedResponse(task));
        }
        else {
            throw new RuntimeException ("Task not found with id: " + id);
        }
    }
    private TaskResponse mapToTaskupdatedResponse(Task task)
    {
        return TaskResponse.builder().taskStatus(task.getTaskStatus()).build();
    }


}


