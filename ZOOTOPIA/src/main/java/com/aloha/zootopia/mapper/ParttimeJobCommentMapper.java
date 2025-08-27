package com.aloha.zootopia.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.aloha.zootopia.domain.ParttimeJobComment;

@Mapper
public interface ParttimeJobCommentMapper {

    void insertComment(ParttimeJobComment comment);

    ParttimeJobComment getCommentById(@Param("commentId") Long commentId);

    void deleteComment(@Param("commentId") Long commentId);

    List<ParttimeJobComment> selectCommentsByJobId(@Param("jobId") Long jobId);

    int countByJobId(@Param("jobId") Long jobId);

    int countAll();

    // 페이징용
    List<ParttimeJobComment> selectAllPaged(@Param("offset") int offset, @Param("limit") int limit);

    List<ParttimeJobComment> selectByJobIdPaged(
        @Param("jobId") Long jobId,
        @Param("offset") int offset,
        @Param("limit") int limit
    );
}