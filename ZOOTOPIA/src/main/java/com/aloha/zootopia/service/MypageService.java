package com.aloha.zootopia.service;

import java.util.List;

import com.aloha.zootopia.domain.Comment;
import com.aloha.zootopia.domain.LostAnimalPost;
import com.aloha.zootopia.domain.Posts;
import com.aloha.zootopia.domain.Users;
import com.aloha.zootopia.domain.UserPet;

public interface MypageService {

    Users getUserInfo(Long userId);
    List<UserPet> getPets(Long userId);
    List<Posts> getMyPosts(Long userId);
    List<Comment> getMyComments(Long userId);
    List<Posts> getLikedPosts(Long userId);
    List<LostAnimalPost> getMyLostAnimalPosts(Long userId);
}
