package com.aloha.zootopia.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.aloha.zootopia.domain.ParttimeJobComment;

@Mapper
public interface ParttimeJobCommentMapper {
    void insertComment(ParttimeJobComment comment);
    List<ParttimeJobComment> selectCommentsByJobId(Long jobId);
    List<ParttimeJobComment> selectAll();
    List<ParttimeJobComment> selectAllPaged(@Param("offset") int offset, @Param("size") int size);
    int countAll(); 
    void deleteComment(int commentId);
    ParttimeJobComment getCommentById(int commentId);
}
