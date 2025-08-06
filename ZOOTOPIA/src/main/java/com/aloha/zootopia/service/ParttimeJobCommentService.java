package com.aloha.zootopia.service;

import java.util.List;

import com.aloha.zootopia.domain.ParttimeJobComment;

public interface ParttimeJobCommentService {
    void registerComment(ParttimeJobComment comment);
    List<ParttimeJobComment> getAllComments();
    List<ParttimeJobComment> getAllCommentsPaged(int offset, int size);
    int countAll();
    void deleteComment(int commentId);
    ParttimeJobComment save(ParttimeJobComment comment);
    ParttimeJobComment getCommentById(int commentId);
}
