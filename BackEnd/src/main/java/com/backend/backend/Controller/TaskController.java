package com.backend.backend.Controller;

import com.backend.backend.Model.Task;
import com.backend.backend.Repository.TaskRepo;
import com.backend.backend.Services.TaskService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/Task")
@CrossOrigin
public class TaskController
{
    private static final Logger logger = Logger.getLogger(TaskController.class.getName());

    @Autowired
    public final TaskService taskService;
    public final TaskRepo taskRepo;
    public TaskController(TaskService taskService, TaskRepo taskRepo) {
        this.taskService = taskService;
        this.taskRepo = taskRepo;
    }

    //CREATING TASK
    @PostMapping("/create")
    public ResponseEntity<Map<String, String>> createTask(@RequestBody Task task) {
        taskService.createTask(task);

        // Sending a JSON response back
        Map<String, String> response = new HashMap<>();
        response.put("message", "Task created successfully");

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    //GETTING TASK
    @GetMapping("/task")
    public List<Task> getTasks()
    {
        return taskService.getTasks();
    }

    //GETTING TASK BY FILTER THE USER
    @GetMapping("/task/{user}")
    public List<Task> getFilterTask(@PathVariable String user, HttpServletRequest request) {
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

    @GetMapping("/task/getupdate/{id}")
    public List<Task> getUpdateTask(@PathVariable  String id) {
        return taskService.getUpdatedTask(id);
    }

//    @DeleteMapping("/task/delete/{id}")
//    public Task deleteTask(@PathVariable String id)
//    {
//        return taskService.deleteTask(id);
//    }





}
