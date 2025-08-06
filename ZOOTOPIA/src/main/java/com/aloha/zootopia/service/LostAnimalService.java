package com.aloha.zootopia.service;

import java.util.List;

import com.aloha.zootopia.domain.LostAnimalPost;
import com.aloha.zootopia.domain.Pagination;

public interface LostAnimalService {

    // 전체 목록 조회 (페이징 포함)
    List<LostAnimalPost> getAll(Pagination pagination);

    // 전체 게시글 수 조회
    long countAll();

    // 단건 조회
    LostAnimalPost getById(int postId);

    // 게시글 등록
    boolean insert(LostAnimalPost post);

    // 게시글 수정
    boolean update(LostAnimalPost post);

    // 게시글 삭제
    boolean delete(int postId);

    // 조회수 증가
    void increaseViewCount(int postId);

    boolean isOwner(int postId, Long userId);

    void increaseCommentCount(int postId);

    void decreaseCommentCount(int postId);

    List<LostAnimalPost> pageBySearch(String type, String keyword, Pagination pagination) throws Exception;

    long countBySearch(String type, String keyword) throws Exception;
    
    // List<LostAnimalPost> searchByTag(String tag);
    // List<LostAnimalPost> getTopByViewsOrLikes();
}
