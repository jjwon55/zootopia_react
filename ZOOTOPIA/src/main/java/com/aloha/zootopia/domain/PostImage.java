package com.aloha.zootopia.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 게시글 이미지 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostImage {

    private Integer imageId;      
    private String imageUrl;      
    private Integer ordering;     
    private Integer postId;       
    
}
