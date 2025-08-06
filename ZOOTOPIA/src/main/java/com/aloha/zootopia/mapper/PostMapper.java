package com.aloha.zootopia.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.aloha.zootopia.domain.Pagination;
import com.aloha.zootopia.domain.Posts;
import com.aloha.zootopia.domain.Tag;

@Mapper
public interface PostMapper {

    // 전체 목록 (비페이징)
    List<Posts> list() throws Exception;

    // 페이징 목록 (카테고리 포함 가능)
    List<Posts> page(Pagination pagination) throws Exception;

    // 전체 게시글 수 (카테고리 포함 가능)
    long count(Pagination pagination) throws Exception;

    // 단건 조회
    Posts selectById(int postId) throws Exception;

    // 등록
    int insert(Posts post) throws Exception;

    // 수정
    int updateById(Posts post) throws Exception;

    // 삭제
    int deleteById(int postId) throws Exception;

    // 썸네일 업데이트
    int updateThumbnail(Posts post) throws Exception;

    // 조회수 증가
    int updateViewCount(int postId);

    // 댓글 수 증가/감소
    int updateCommentCount(int postId);
    int minusCommentCount(int postId);

    // 인기글
    List<Posts> selectTopNByLikeCount(int limit) throws Exception;
    List<Posts> selectTop10ByPopularity();

    // 태그 조회
    List<Tag> selectTagsByPostIds(@Param("list") List<Integer> postIds);

    // 검색 + 페이징
    List<Posts> pageBySearch(
        @Param("type") String type,
        @Param("keyword") String keyword,
        @Param("pagination") Pagination pagination
    );

    // 검색 결과 개수
    long countBySearch(
        @Param("type") String type,
        @Param("keyword") String keyword
    );
 
    
    List<Posts> pageByPopularity(Pagination pagination) throws Exception;

    List<Posts> findByUserId(Long userId);
}
