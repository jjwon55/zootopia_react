package com.aloha.zootopia.service;

public interface PostLikeService {
    boolean toggleLike(int postId, long userId);
    boolean isLiked(int postId, long userId);
    
}
