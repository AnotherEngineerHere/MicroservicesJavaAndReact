package com.mic.service;

import com.mic.dto.UserLoginDto;
import com.mic.dto.UserRegistrationDto;
import com.mic.entity.User;
import com.mic.repository.UserRepository;
import com.mic.service.interfaces.IUserService;


import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {
	
	private final UserRepository userRepository;

	  @Override
	    public Optional<User> findByEmail(String email) {
	        return userRepository.findByEmail(email);
	    }

	    @Override
	    public Optional<User> getUserProfile(Long userId) {
	        return userRepository.findById(userId);
	    }
}