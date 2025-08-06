package com.aloha.zootopia.domain;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ParttimeJob {
    private Long jobId;
    private String title;
    private String location;
    private int pay;
    private LocalDate startDate;
    private LocalDate endDate;
    private Long userId;
    private String petInfo;
    private String memo;
    private LocalDateTime createdAt;
    private String nickname;
}
