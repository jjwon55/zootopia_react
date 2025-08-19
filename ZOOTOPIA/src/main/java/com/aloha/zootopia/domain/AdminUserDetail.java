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
public class AdminUserDetail {
    private Integer userId;
    private String email;
    private String nickname;
    private String status;
    private List<String> roles;
    private String memo;          // 운영 메모
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private Long postCount;       // 선택: 집계
    private Long commentCount;    // 선택: 집계
}