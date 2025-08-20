package com.aloha.zootopia.domain;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor 
@AllArgsConstructor 
@Builder
public class AdminUserSummary {
    private Integer userId;
    private String email;
    private String nickname;
    private String status; // ACTIVE | SUSPENDED | DELETED
    private List<String> roles;
    private LocalDateTime createdAt;
    private Integer reportCount;
}
