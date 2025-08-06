package com.aloha.zootopia.domain;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ParttimeJobComment {
    private Long commentId;
    private Long userId;
    private String writer;
    private Long jobId;
    private String content;
    private LocalDateTime createdAt;

}
