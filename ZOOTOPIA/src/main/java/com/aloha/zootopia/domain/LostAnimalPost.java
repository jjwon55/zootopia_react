package com.aloha.zootopia.domain;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LostAnimalPost {
    private int postId;
    private String title;
    private String content;          
    private String lostLocation;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate lostTime;
    private String contactPhone;

    private int viewCount;
    private int likeCount;
    private int commentCount;

    private Date createdAt;
    private Date updatedAt;

    private String thumbnailUrl;

    private Long userId;
    private Users user;  

    private List<Comment> comments;

    private String category;
    private String tags;
    private List<Tag> tagList;
}
