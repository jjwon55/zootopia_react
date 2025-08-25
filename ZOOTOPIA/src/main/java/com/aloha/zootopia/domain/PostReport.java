package com.aloha.zootopia.domain;

import java.time.LocalDateTime;

import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class PostReport {
    private Long reportId;
    private Integer postId;         // 신고 대상 게시글
    private Integer reporterUserId; // 신고자
    private ReportReason reasonCode;
    private String reasonText;

    private ReportStatus status;
    private String adminNote;
    private LocalDateTime createdAt;
    private LocalDateTime reviewedAt;

    private String reporterEmail;   // JOIN 용
}
