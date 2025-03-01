package com.mic.dto;

import java.time.LocalDate;

public record UserRegistrationDto(
    String firstName,
    String lastName,
    String address,
    String email,
    LocalDate birthDate,
    String password
) {}
