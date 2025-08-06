package com.aloha.zootopia.service;

import java.util.List;

import com.aloha.zootopia.domain.Pagination;
import com.aloha.zootopia.domain.Posts;

public interface PostService {

    // 게시글 전체 목록
    List<Posts> list() throws Exception;

    // 페이징 목록
    List<Posts> page(Pagination pagination) throws Exception;

    // // PageHelper 기반 페이징
    // PageInfo<Posts> page(int page, int size, String category) throws Exception;

    // 인기글 Top N
    List<Posts> getTopN(int limit) throws Exception;

    // 단건 조회
    Posts selectById(int postId) throws Exception;

    // 등록 
    boolean insert(Posts post) throws Exception;

    // 수정
    boolean updateById(Posts post) throws Exception;

    // 삭제
    boolean deleteById(int postId) throws Exception;

    // 소유자 검증
    boolean isOwner(int postId, Long userId) throws Exception;

    void increaseViewCount(Integer postId);

    void increaseCommentCount(int postId);
    
    void decreaseCommentCount(int postId);

    List<Posts> getTop10PopularPosts();

    List<Posts> pageBySearch(String type, String keyword, Pagination pagination) throws Exception;

    long countBySearch(String type, String keyword) throws Exception;

    List<Posts> pageByPopularity(Pagination pagination) throws Exception;

}
