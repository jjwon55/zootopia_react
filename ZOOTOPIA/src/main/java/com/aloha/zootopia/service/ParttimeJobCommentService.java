package com.aloha.zootopia.service;

import java.util.List;
import com.aloha.zootopia.domain.ParttimeJobComment;

public interface ParttimeJobCommentService {

    void registerComment(ParttimeJobComment comment);

    List<ParttimeJobComment> getAllComments();

    // 페이징용
    List<ParttimeJobComment> getAllCommentsPaged(int offset, int limit);

    int countAll();

    void deleteComment(Long commentId);

    ParttimeJobComment save(ParttimeJobComment comment);

    ParttimeJobComment getCommentById(Long commentId);

    // 특정 공고 댓글 페이징
    List<ParttimeJobComment> getCommentsByJobIdPaged(Long jobId, int offset, int limit);

    int countByJobId(Long jobId);
}