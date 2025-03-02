package com.backend.backend.Services;

import com.backend.backend.DTO.UserDTO;
import com.backend.backend.Model.Users;
import com.backend.backend.Repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final JWTservice jwtService;
    private final AuthenticationManager authenticationManager;

    public UserService(UserRepository userRepository, JWTservice jwtService, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    private final BCryptPasswordEncoder Bcrypt = new BCryptPasswordEncoder(12);

    public Users registerUser(UserDTO userDTO) {
        Users user = new Users();
        user.setUsername(userDTO.getUsername());

        // Ensure password is hashed before saving
        user.setPassword(Bcrypt.encode(userDTO.getPassword()));

        user.setEmail(userDTO.getEmail());
        userRepository.save(user);
        return user;
    }




    public String verify(Users user) {
        System.out.println("🔍 Authenticating user: " + user.getUsername());

        Users foundUser = userRepository.findByUsername(user.getUsername()).orElse(null);
        if (foundUser == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password");
        }



        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword())
            );

            if (auth.isAuthenticated()) {
                System.out.println("✅ Authentication successful!");
                return jwtService.tokenGenerator(user.getUsername());
            }
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password");
        }
        return null;
    }




    public List<Users> getAllusers() {
        return userRepository.findAll();
    }
}
