package com.aloha.zootopia.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.aloha.zootopia.domain.Tag;

@Mapper
public interface TagMapper {
    // Integer findTagIdByName(String name);
    // int insertTag(Tag tag); 
    // int insertPostTag(@Param("postId") int postId, @Param("tagId") int tagId);
    // List<String> getTagsByPostId(int postId);

    // void deletePostTagsByPostId(int postId);
     // 공통
    Integer findTagIdByName(String name);
    int insertTag(Tag tag);

    // 커뮤니티
    int insertPostTag(@Param("postId") int postId, @Param("tagId") int tagId);
    void deletePostTagsByPostId(int postId);
    List<String> getTagsByPostId(int postId);

    // 유실동물
    int insertLostPostTag(@Param("postId") int postId, @Param("tagId") int tagId);
    void deleteLostPostTagsByPostId(int postId);
    List<String> getLostTagsByPostId(int postId);
    List<Tag> selectTagsByPostIds(@Param("list") List<Integer> postIds);
}

