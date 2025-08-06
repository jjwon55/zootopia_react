package com.aloha.zootopia.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.aloha.zootopia.domain.LostAnimalPost;
import com.aloha.zootopia.domain.Pagination;
import com.aloha.zootopia.domain.Tag;

@Mapper
public interface LostAnimalMapper {

    // 전체 목록 + 페이징
    List<LostAnimalPost> findAll(Pagination pagination);
    long countAll();

    // 단건 조회
    LostAnimalPost findById(int postId);

    // 태그 조회
    List<Tag> selectTagsByPostIds(@Param("list") List<Integer> postIds);

    // 등록
    int insert(LostAnimalPost post);

    // 수정
    int update(LostAnimalPost post);

    // 삭제
    int delete(int postId);

    // 썸네일 업데이트
    int updateThumbnail(LostAnimalPost post);

    // 조회수 증가
    void increaseViewCount(@Param("postId") int postId);

    // 태그 연관 작업 (lost_animal_tags 기준)
    void insertPostTag(@Param("postId") int postId, @Param("tagId") int tagId);
    
    void deletePostTagsByPostId(@Param("postId") int postId);

    int updateCommentCount(int postId);
    
    int minusCommentCount(int postId);

    // 검색 + 페이징
    List<LostAnimalPost> pageBySearch(
        @Param("type") String type,
        @Param("keyword") String keyword,
        @Param("pagination") Pagination pagination
    );

    // 검색 결과 개수
    long countBySearch(
        @Param("type") String type,
        @Param("keyword") String keyword
    );

    List<LostAnimalPost> findByUserId(Long userId);


}
