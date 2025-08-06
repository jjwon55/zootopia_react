package com.aloha.zootopia.mapper;

import org.apache.ibatis.annotations.*;

@Mapper
public interface PostLikeMapper {

    @Select("SELECT COUNT(*) FROM post_likes WHERE post_id = #{postId} AND user_id = #{userId}")
    boolean isLiked(@Param("postId") int postId, @Param("userId") long userId);

    @Insert("INSERT INTO post_likes(post_id, user_id, created_at) VALUES(#{postId}, #{userId}, NOW())")
    int insertLike(@Param("postId") int postId, @Param("userId") long userId);

    @Delete("DELETE FROM post_likes WHERE post_id = #{postId} AND user_id = #{userId}")
    int deleteLike(@Param("postId") int postId, @Param("userId") long userId);

    @Update("UPDATE posts SET like_count = like_count + 1 WHERE post_id = #{postId}")
    void increaseLikeCount(int postId);

    @Update("UPDATE posts SET like_count = like_count - 1 WHERE post_id = #{postId}")
    void decreaseLikeCount(int postId);
    
}
