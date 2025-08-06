package com.aloha.zootopia.domain;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ParttimeJobApplicant {
    private int applicantId;
    private Long jobId;            // 지원한 알바 ID
    private Long userId;           // 지원자
    private float rating;         // 평점
    private String email;
    private String phone;
    private int reviewCount;
    private String introduction;  // 자기소개
    private LocalDateTime createdAt;
}
