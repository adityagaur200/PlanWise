package com.backend.backend.Controller;

import com.backend.backend.DTO.UserDTO;
import com.backend.backend.Model.Users;
import com.backend.backend.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/user")
public class UserController
{
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public Users register(@RequestBody UserDTO userDTO)
    {
        return userService.registerUser(userDTO);
    }

    @GetMapping("/getusers")
    public List<Users> getAllUsers()
    {
        return userService.getAllusers();
    }
    @PostMapping("/login")
    public String login(@RequestBody Users user) {

        return userService.verify(user);
    }
}
