    package com.aloha.zootopia.service;

    import org.springframework.stereotype.Service;
    import org.springframework.transaction.annotation.Transactional;

    import com.aloha.zootopia.mapper.PostLikeMapper;

    import lombok.RequiredArgsConstructor;

    @Service
    @RequiredArgsConstructor
    public class PostLikeServiceImpl implements PostLikeService {

        private final PostLikeMapper postLikeMapper;
        @Transactional
        @Override
        public boolean toggleLike(int postId, long userId) {
            boolean isLiked = postLikeMapper.isLiked(postId, userId);
            if (isLiked) {
                // 좋아요 취소
                postLikeMapper.deleteLike(postId, userId);
                postLikeMapper.decreaseLikeCount(postId);
                return false;
            } else {
                // 좋아요 추가
                postLikeMapper.insertLike(postId, userId);
                postLikeMapper.increaseLikeCount(postId);
                return true;
            }
        }
        

        @Override
        public boolean isLiked(int postId, long userId) {
            return postLikeMapper.isLiked(postId, userId);
        }


        
        
    }

