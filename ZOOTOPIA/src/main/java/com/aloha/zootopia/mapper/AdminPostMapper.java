package com.aloha.zootopia.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.aloha.zootopia.domain.AdminPost;

@Mapper
public interface AdminPostMapper {

    int countByFilter(
        @Param("q") String q,
        @Param("category") String category,
        @Param("hidden") Boolean hidden
    );

    List<AdminPost> findByFilter(
        @Param("q") String q,
        @Param("category") String category,
        @Param("hidden") Boolean hidden,
        @Param("offset") int offset,
        @Param("size") int size,
        @Param("sort") String sort,
        @Param("dir") String dir
    );

    AdminPost selectOne(@Param("postId") Integer postId);

    int updateHidden(@Param("postId") Integer postId, @Param("hidden") boolean hidden);

    int delete(@Param("postId") Integer postId);
}
