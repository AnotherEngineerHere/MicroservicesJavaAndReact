package com.mic.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mic.entity.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}