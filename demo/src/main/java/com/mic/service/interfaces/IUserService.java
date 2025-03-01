package com.mic.service.interfaces;

import java.util.Optional;

import com.mic.dto.UserLoginDto;
import com.mic.dto.UserRegistrationDto;
import com.mic.entity.User;

public interface IUserService {
    
	User registerUser(UserRegistrationDto userDto);
	
	String loginUser(UserLoginDto userDto);
    
    Optional<User> findByEmail(String email);
    
    Optional<User> getUserProfile(Long userId);
}