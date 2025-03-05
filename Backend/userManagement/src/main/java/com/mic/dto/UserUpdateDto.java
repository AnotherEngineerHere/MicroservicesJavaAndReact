package com.mic.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class UserUpdateDto {
    private String firstName;
    private String lastName;
    private String address;
    private LocalDate birthDate;
    private String newPassword;
}
