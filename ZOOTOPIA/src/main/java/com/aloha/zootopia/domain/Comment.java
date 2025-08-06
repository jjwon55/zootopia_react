package com.aloha.zootopia.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Comment {

    private int commentId;   
    private String content;      
    private Date createdAt;      
    private Date updatedAt;      
    private Boolean isDeleted;   
    private Long userId;     
    private int postId;      
    private String nickname;     
    private String profileImg;   
    private Integer parentId; 
    private List<Comment> replies;
    private String postTitle;
    private String postCategory;
    
}
