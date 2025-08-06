package com.aloha.zootopia.domain;

import java.util.Date;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Posts {

    private int postId;            
    private String category;          
    private String title;             
    private String content;           

    private int viewCount;        
    private int likeCount;        
    private int commentCount;     

    private Date createdAt;           
    private Date updatedAt;           

    private Long userId;           
    private Users user;              

    private String thumbnailUrl;     

    private List<PostImage> images;   

    private List<Comment> comments;

    private String tags;

    private List<Tag> tagList;
    
}
