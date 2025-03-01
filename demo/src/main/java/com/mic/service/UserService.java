package com.mic.service;

import com.mic.dto.UserLoginDto;
import com.mic.dto.UserRegistrationDto;
import com.mic.entity.User;
import com.mic.repository.UserRepository;
import com.mic.service.interfaces.IUserService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
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
public class UserService implements IUserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    private final String jwtSecret = "yourSecretKey"; // Use a secure key
    private final long jwtExpirationMs = 86400000; // 1 day

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }

    @Override
    public User registerUser(UserRegistrationDto userDto) {
        User user = new User();
        user.setFirstName(userDto.firstName());
        user.setLastName(userDto.lastName());
        user.setAddress(userDto.address());
        user.setEmail(userDto.email());
        user.setBirthDate(userDto.birthDate());
        user.setPassword(passwordEncoder.encode(userDto.password()));
        return userRepository.save(user);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public Optional<User> getUserProfile(Long userId) {
        return userRepository.findById(userId);
    }

    public String loginUser(UserLoginDto loginDto) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginDto.email(), loginDto.password())
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            return generateJwtToken(authentication);
        } catch (Exception e) {
            throw new RuntimeException("Invalid login credentials", e);
        }
    }

    private String generateJwtToken(Authentication authentication) {
        return Jwts.builder()
                .setSubject((authentication.getName()))
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
    }
}