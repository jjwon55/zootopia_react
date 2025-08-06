package com.aloha.zootopia.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.aloha.zootopia.domain.Posts;
import com.aloha.zootopia.domain.Users;
import com.aloha.zootopia.domain.Comment;
import com.aloha.zootopia.domain.UserPet;

@Mapper
public interface MypageMapper {

    Users findUserById(@Param("userId") Long userId);

    List<UserPet> findPetsByUserId(@Param("userId") Long userId);

    List<Posts> findPostsByUserId(@Param("userId") Long userId);

    List<Comment> findCommentsByUserId(@Param("userId") Long userId);

    List<Posts> findLikedPostsByUserId(@Param("userId") Long userId);

    List<Comment> findCommentsWithPostTitleByUserId(Long userId);
}
