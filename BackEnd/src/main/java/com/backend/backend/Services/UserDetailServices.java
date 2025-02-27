package com.backend.backend.Services;

import com.backend.backend.Model.UserPrincipal;
import com.backend.backend.Model.Users;
import com.backend.backend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserDetailServices implements UserDetailsService
{
    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException
    {
        Optional<Users> user = userRepository.findByUsername(username);
        if(user.isEmpty())
        {
            throw new UsernameNotFoundException("User not found");
        }

        return  new UserPrincipal(user.orElse(null));
    }


}
