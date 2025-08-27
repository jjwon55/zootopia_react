package com.aloha.zootopia.domain;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class PetProfile {
    private Long petId;
    private Long userId;
    private String name;
    private String species;
    private String breed;
    private Integer age;
    private String gender;
    private String description;
    private String photoUrl;
    private LocalDateTime createdAt;
}
