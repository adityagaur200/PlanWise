package com.backend.backend.Controller;

import com.backend.backend.DTO.UserDTO;
import com.backend.backend.Model.Users;
import com.backend.backend.Services.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public Users register(@RequestBody UserDTO userDTO) {
        return userService.registerUser(userDTO);
    }

    @GetMapping("/getusers")
    public List<Users> getAllUsers() {
        return userService.getAllusers();
    }

    @PostMapping("/login")
    public String login(@RequestBody Users user) {
        return userService.verify(user);
    }
}
