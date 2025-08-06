package com.aloha.zootopia.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aloha.zootopia.domain.ParttimeJobComment;
import com.aloha.zootopia.mapper.ParttimeJobCommentMapper;

@Service
public class ParttimeJobCommentServiceImpl implements ParttimeJobCommentService {
    
    @Autowired
    private ParttimeJobCommentMapper commentMapper;

    @Override
    public void registerComment(ParttimeJobComment comment) {
        commentMapper.insertComment(comment);
    }

    @Override
    public List<ParttimeJobComment> getAllComments() {
        return commentMapper.selectAll();
    }

    @Override
    public void deleteComment(int commentId) {
        commentMapper.deleteComment(commentId);
    }
    
    @Override
    public ParttimeJobComment save(ParttimeJobComment comment) {
        comment.setCreatedAt(LocalDateTime.now());        // 등록 시간 설정
        commentMapper.insertComment(comment);             // DB에 INSERT
        return comment;
    }

    @Override
    public List<ParttimeJobComment> getAllCommentsPaged(int offset, int size) {
    return commentMapper.selectAllPaged(offset, size);
    }

    @Override
    public int countAll() {
    return commentMapper.countAll();
    }

    
    @Override
    public ParttimeJobComment getCommentById(int commentId) {
        return commentMapper.getCommentById(commentId);
    }

}
