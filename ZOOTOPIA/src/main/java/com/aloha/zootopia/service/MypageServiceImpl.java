package com.aloha.zootopia.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.aloha.zootopia.domain.Comment;
import com.aloha.zootopia.domain.LostAnimalPost;
import com.aloha.zootopia.domain.Posts;
import com.aloha.zootopia.domain.Users;
import com.aloha.zootopia.domain.UserPet;
import com.aloha.zootopia.mapper.LostAnimalMapper;
import com.aloha.zootopia.mapper.MypageMapper;
import com.aloha.zootopia.mapper.PostMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MypageServiceImpl implements MypageService {

    private final MypageMapper mypageMapper;
    private final PostMapper postMapper ;
    private final LostAnimalMapper lostAnimalMapper  ;


    @Override
    public Users getUserInfo(Long userId) {
        return mypageMapper.findUserById(userId);
    }

    @Override
    public List<UserPet> getPets(Long userId) {
        return mypageMapper.findPetsByUserId(userId);
    }

    @Override
    public List<Posts> getMyPosts(Long userId) {
        List<Posts> combinedList = new ArrayList<>();

        // 일반 게시글
        List<Posts> postList = postMapper.findByUserId(userId);
        for (Posts post : postList) {
            if (post.getCategory() == null) post.setCategory("자유글"); // 기본값 보정
        }
        combinedList.addAll(postList);

        // 유실동물 글
        List<LostAnimalPost> lostPosts = lostAnimalMapper.findByUserId(userId);
        for (LostAnimalPost lost : lostPosts) {
            Posts p = new Posts();
            p.setPostId(lost.getPostId());
            p.setTitle(lost.getTitle());
            p.setCategory("유실동물");
            combinedList.add(p);
        }


        return combinedList;
    }


    public List<Comment> getMyComments(Long userId) {
        return mypageMapper.findCommentsWithPostTitleByUserId(userId);
    }

    @Override
    public List<Posts> getLikedPosts(Long userId) {
        return mypageMapper.findLikedPostsByUserId(userId);
    }

    @Override
    public List<LostAnimalPost> getMyLostAnimalPosts(Long userId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getMyLostAnimalPosts'");
    }

}
