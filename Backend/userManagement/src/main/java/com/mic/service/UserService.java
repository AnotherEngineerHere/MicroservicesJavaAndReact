package com.mic.service;

import com.mic.dto.UserUpdateDto;
import com.mic.entity.User;
import com.mic.repository.UserRepository;
import com.mic.service.interfaces.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {
    
    private final UserRepository userRepository;
    // Inyectamos el PasswordEncoder para actualizar la contraseña si se envía
    private final PasswordEncoder passwordEncoder;

    @Override
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public Optional<User> getUserProfile(Long userId) {
        return userRepository.findById(userId);
    }

    public Optional<User> updateUserProfile(Long userId, UserUpdateDto updateDto) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (updateDto.getFirstName() != null)
                user.setFirstName(updateDto.getFirstName());
            if (updateDto.getLastName() != null)
                user.setLastName(updateDto.getLastName());
            if (updateDto.getAddress() != null)
                user.setAddress(updateDto.getAddress());
            if (updateDto.getBirthDate() != null)
                user.setBirthDate(updateDto.getBirthDate());
            if (updateDto.getNewPassword() != null && !updateDto.getNewPassword().isBlank())
                user.setPassword(passwordEncoder.encode(updateDto.getNewPassword()));
            return Optional.of(userRepository.save(user));
        }
        return Optional.empty();
    }
}