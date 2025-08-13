package com.aloha.zootopia.mapper;

import org.apache.ibatis.annotations.*;

@Mapper
public interface PostLikeMapper {

  @Select("SELECT EXISTS(SELECT 1 FROM post_likes WHERE post_id=#{postId} AND user_id=#{userId})")
  boolean isLiked(@Param("postId") int postId, @Param("userId") long userId);

  @Insert("INSERT INTO post_likes(post_id,user_id,created_at) VALUES(#{postId},#{userId},NOW())")
  int insertLike(@Param("postId") int postId, @Param("userId") long userId);

  @Delete("DELETE FROM post_likes WHERE post_id=#{postId} AND user_id=#{userId}")
  int deleteLike(@Param("postId") int postId, @Param("userId") long userId);

  @Update("UPDATE posts SET like_count = COALESCE(like_count,0) + 1 WHERE post_id = #{postId}")
  int increaseLikeCount(@Param("postId") int postId);

  @Update("""
  UPDATE posts
  SET like_count = GREATEST(COALESCE(like_count,0) - 1, 0)
  WHERE post_id = #{postId}
  """)
  int decreaseLikeCount(@Param("postId") int postId);
}

