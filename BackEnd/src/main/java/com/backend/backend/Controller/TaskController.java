package com.backend.backend.Controller;

import com.backend.backend.DTO.TaskRequest;
import com.backend.backend.DTO.TaskResponse;
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
import java.util.Optional;
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
    public ResponseEntity<Map<String, String>> createTask(@RequestBody TaskRequest taskRequest) {
        taskService.createTask(taskRequest);

        // Sending a JSON response back
        Map<String, String> response = new HashMap<>();
        response.put("message", "Task created successfully");

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
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
    public ResponseEntity<?> updateTask(@PathVariable String id, @RequestBody TaskRequest taskRequest) {
        try {
            List<TaskResponse> updatedTask = taskService.getUpdatedTask(id, taskRequest);
            return ResponseEntity.ok(updatedTask); // ✅ Return proper HTTP response
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage()); // ✅ Handle task not found
        }
    }





}
