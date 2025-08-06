package com.aloha.zootopia.service;

import org.springframework.stereotype.Service;

import com.aloha.zootopia.mapper.PostLikeMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostLikeServiceImpl implements PostLikeService {

    private final PostLikeMapper postLikeMapper;

    @Override
    public boolean toggleLike(int postId, long userId) {
        if (postLikeMapper.isLiked(postId, userId)) {
            postLikeMapper.deleteLike(postId, userId);
            postLikeMapper.decreaseLikeCount(postId);
            return false; // 좋아요 취소됨
        } else {
            postLikeMapper.insertLike(postId, userId);
            postLikeMapper.increaseLikeCount(postId);
            return true; // 좋아요 등록됨
        }
    }
    

    @Override
    public boolean isLiked(int postId, long userId) {
        return postLikeMapper.isLiked(postId, userId);
    }


    
    
}

