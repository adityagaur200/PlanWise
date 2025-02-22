package com.backend.backend.Controller;

import com.backend.backend.DTO.TaskRequest;
import com.backend.backend.Model.Task;
import com.backend.backend.Services.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/Task")
@CrossOrigin
public class TaskController
{
    @Autowired
    public final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping("/create")
    public void createTask(@RequestBody TaskRequest taskRequest)
    {
        taskService.createTask(taskRequest);
    }

    @GetMapping("/task")
    public List<Task> getTasks()
    {
        return taskService.getTasks();
    }
}
