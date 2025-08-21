package com.aloha.zootopia.domain;

import java.time.LocalDateTime;

import lombok.Data;

/**
 * 관리자 화면용 게시글 요약/상세 DTO
 */
@Data
public class AdminPost {
    private Integer postId;
    private String category;       // 자유글/질문글/자랑글
    private String title;
    private String content;

    private Integer viewCount;
    private Integer likeCount;
    private Integer commentCount;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private Integer userId;
    private String userEmail;      // JOIN users.email
    private String userNickname;   // JOIN users.nickname

    private String thumbnailUrl;
    private Boolean hidden;        // posts.hidden
}
