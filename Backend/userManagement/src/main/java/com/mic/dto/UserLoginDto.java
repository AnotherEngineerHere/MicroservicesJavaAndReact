package com.mic.dto;

public record UserLoginDto(
    String email,
    String password
) {}