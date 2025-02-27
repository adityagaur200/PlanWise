package com.backend.backend.Controller;

import com.backend.backend.DTO.TaskRequest;
import com.backend.backend.DTO.TaskResponse;
import com.backend.backend.Services.TaskService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/Task")
@CrossOrigin
public class TaskController
{
    private static final Logger logger = Logger.getLogger(TaskController.class.getName());

    @Autowired
    public final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    //CREATING TASK
    @PostMapping("/create")
    public void createTask(@RequestBody TaskRequest taskRequest)
    {
        taskService.createTask(taskRequest);
    }

    //GETTING TASK
    @GetMapping("/task")
    public List<TaskResponse> getTasks()
    {
        return taskService.getTasks();
    }

    //GETTING TASK BY FILTER THE USER
    @GetMapping("/task/{user}")
    public List<TaskResponse> getFilterTask(@PathVariable String user, HttpServletRequest request) {
        // Retrieve JWT Token from Authorization header
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            logger.warning("Authorization header is missing or does not start with 'Bearer '");
            throw new RuntimeException("JWT Token is missing or invalid!");
        }

        // Extract the token
        String jwtToken = authHeader.substring(7);
        logger.info("Extracted JWT Token: " + jwtToken);

        return taskService.getFilterTask(user, jwtToken);
    }

    //UPDATING THE TASK.
    @PutMapping("/task/{id}")
    public List<TaskResponse> getUpdatedTask(@PathVariable String id, @RequestBody TaskRequest taskRequest)
    {
        List<TaskResponse> updatedTask = taskService.getUpdatedTask(id,taskRequest);
        return updatedTask;
    }

}
