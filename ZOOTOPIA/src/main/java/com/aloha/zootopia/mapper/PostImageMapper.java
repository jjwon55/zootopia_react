package com.aloha.zootopia.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import com.aloha.zootopia.domain.PostImage;

@Mapper
public interface PostImageMapper {

    List<PostImage> findByPostId(int postId) throws Exception;

   
    int insert(PostImage image) throws Exception;


    int deleteByPostId(int postId) throws Exception;

   
    PostImage selectThumbnailByPostId(int postId) throws Exception;
}
