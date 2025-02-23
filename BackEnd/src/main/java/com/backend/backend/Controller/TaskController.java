package com.backend.backend.Controller;

import com.backend.backend.DTO.TaskRequest;
import com.backend.backend.DTO.TaskResponse;
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
    public List<TaskResponse> getFilterTask(@PathVariable String user)
    {
        return taskService.getFilterTask(user);
    }

}
