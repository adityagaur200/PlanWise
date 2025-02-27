package com.backend.backend.Services;

import com.backend.backend.DTO.UserDTO;
import com.backend.backend.Model.Users;
import com.backend.backend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService
{
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JWTservice jwtService;

  @Autowired
  private AuthenticationManager authenticationManager;

    public BCryptPasswordEncoder Bcrypt = new BCryptPasswordEncoder(12 );
    public Users registerUser(UserDTO userDTO)
    {
        Users user = new Users();
        user.setUsername(userDTO.getUsername());
        user.setPassword(Bcrypt.encode(userDTO.getPassword()));
        user.setEmail(userDTO.getEmail());
        userRepository.save(user);
        return user;
    }
    public String verify(Users user) {
        Authentication auth = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(),user.getPassword()));
        if(auth.isAuthenticated())
        {
            return jwtService.tokenGenerator(user.getUsername());
        }
        else
        {
            return "fail";
        }

    }

    public List<Users> getAllusers() {
        return userRepository.findAll();
    }
}
