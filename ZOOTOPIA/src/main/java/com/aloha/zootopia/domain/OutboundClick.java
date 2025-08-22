package com.aloha.zootopia.domain;

import java.time.LocalDateTime;
import lombok.Data;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class OutboundClick {
    private Long id;                 // BIGINT
    private Long userId;             // BIGINT NULL  ← 변경
    private Integer productId;       // INT NOT NULL
    private String label;            // VARCHAR(20)
    private String href;             // VARCHAR(700)
    private String userAgent;        // VARCHAR(255)
    private String ip;               // VARCHAR(45)
    private LocalDateTime createdAt; // DATETIME
}