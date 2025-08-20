package com.aloha.zootopia.domain;

import java.time.LocalDateTime;

import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class UserReport {
    private Long reportId;
    private Integer reportedUserId;
    private Integer reporterUserId;
    private ReportReason reasonCode;
    private String reasonText;

    private Integer postId;          // nullable
    private Integer commentId;       // nullable
    private Integer lostPostId;      // nullable
    private Integer lostCommentId;   // nullable

    private ReportStatus status;
    private String adminNote;
    private LocalDateTime createdAt;
    private LocalDateTime reviewedAt;
     private String reporterEmail;
}
