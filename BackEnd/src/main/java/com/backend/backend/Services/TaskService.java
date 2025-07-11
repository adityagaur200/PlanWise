package com.backend.backend.Services;

import com.backend.backend.Model.Task;
import com.backend.backend.Repository.TaskRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;
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
    public Task createTask(Task task) {
    return taskRepo.save(task);
}


    // CREATE GET TASK SERVICE TO GET ALL THE TASKS.
    public List<Task> getTasks()
    {
        List<Task> tasks = taskRepo.findAll();
        //return tasks.stream().map(this:: mapToTaskResponse).toList();
        return tasks;
    }

// MAPPING TO MY TASKRESPONSE DTO.


//// CREATING SERVICE FOR FILTER THE TASK ON THE BASICS OF USER
    public List<Task> getFilterTask(String user, String jwtToken) {
            //USING WEBCLIENT AND SEND AND RETRIVEING THE DATA.
            Task[] TaskResponseArray = webClientBuilder.build().get()
                    .uri("http://localhost:3030/api/Task/task")
                    .headers(httpHeaders -> httpHeaders.setBearerAuth(jwtToken))
               .retrieve().bodyToMono(Task[].class).block();
       if(TaskResponseArray == null)
       {
           return List.of();
       }
       // RETURNING THE LIST
       return List.of(TaskResponseArray).stream().filter(taskResponse -> taskResponse.getAssignees().contains(user)).collect(Collectors.toList());
    }

// UPDATING THE RESPONSE
    public List<Task> getUpdatedTask(String id)
    {
        Optional<Task> taskOptional = taskRepo.findById(id);

        if (taskOptional.isPresent()) {
            Task task = taskOptional.get();
            task.setTaskStatus(task.getTaskStatus()); // ✅ Update status
            return (List<Task>) taskRepo.save(task); // ✅ Save changes

        }
        else {
        throw new RuntimeException("Task not found with id: " + id);
        }
    }


//    public Task deleteTask(String id) {
//        taskRepo.delete(id);
//        return taskRepo.findById(id).orElse(null);
//    }
}