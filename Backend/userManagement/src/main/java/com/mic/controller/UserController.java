package com.mic.controller;

import com.mic.dto.UserUpdateDto;
import com.mic.entity.User;
import com.mic.service.UserService;
import com.mic.service.interfaces.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final IUserService userService;
    
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserProfile(@PathVariable Long id) {
        Optional<User> user = userService.getUserProfile(id);
        if (user.isPresent()) {
            user.get().setPassword(null); // Ocultar contraseña
            return ResponseEntity.ok(user.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    // Endpoint para actualizar el perfil del usuario (incluye actualización de contraseña)
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUserProfile(@PathVariable Long id,
                                                  @RequestBody UserUpdateDto updateDto) {
        Optional<User> updatedUser = ((UserService) userService).updateUserProfile(id, updateDto);
        if (updatedUser.isPresent()) {
            updatedUser.get().setPassword(null); // Ocultar contraseña en la respuesta
            return ResponseEntity.ok(updatedUser.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    // Endpoint para obtener usuario por email (requiere token Bearer)
    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email,
                                               @RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Optional<User> user = userService.findByEmail(email);
        if (user.isPresent()) {
            user.get().setPassword(null);
            return ResponseEntity.ok(user.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}
