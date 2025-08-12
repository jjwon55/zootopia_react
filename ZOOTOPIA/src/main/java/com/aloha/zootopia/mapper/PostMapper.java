package com.aloha.zootopia.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.aloha.zootopia.domain.Pagination;
import com.aloha.zootopia.domain.Posts;
import com.aloha.zootopia.domain.Tag;

@Mapper
public interface PostMapper {

    List<Posts> list() throws Exception;

    List<Posts> page(Pagination pagination) throws Exception;

    long count(Pagination pagination) throws Exception;

    // XML: WHERE p.post_id = #{id}
    Posts selectById(@Param("id") int postId) throws Exception;

    int insert(Posts post) throws Exception;

    int updateById(Posts post) throws Exception;

    // XML: #{postId}
    int deleteById(@Param("postId") int postId) throws Exception;

    int updateThumbnail(Posts post) throws Exception;

    // XML: #{postId}
    int updateViewCount(@Param("postId") int postId);

    // XML: #{postId}
    int updateCommentCount(@Param("postId") int postId);

    // XML: #{postId}  (음수 방지 쿼리로 바꾸는 것도 권장)
    int minusCommentCount(@Param("postId") int postId);

    // XML: LIMIT #{limit}
    List<Posts> selectTopNByLikeCount(@Param("limit") int limit) throws Exception;

    List<Posts> selectTop10ByPopularity();

    List<Tag> selectTagsByPostIds(@Param("list") List<Integer> postIds);

    List<Posts> pageBySearch(
        @Param("type") String type,
        @Param("keyword") String keyword,
        @Param("pagination") Pagination pagination
    );

    long countBySearch(
        @Param("type") String type,
        @Param("keyword") String keyword
    );

    List<Posts> pageByPopularity(Pagination pagination) throws Exception;

    // XML: WHERE user_id = #{userId}
    List<Posts> findByUserId(@Param("userId") Long userId);
}