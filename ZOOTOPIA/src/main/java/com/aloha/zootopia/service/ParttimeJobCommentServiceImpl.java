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
        comment.setCreatedAt(LocalDateTime.now());
        commentMapper.insertComment(comment);
    }

    @Override
    public ParttimeJobComment save(ParttimeJobComment comment) {
        comment.setCreatedAt(LocalDateTime.now());
        commentMapper.insertComment(comment);
        return comment;
    }

    @Override
    public ParttimeJobComment getCommentById(Long commentId) {
        return commentMapper.getCommentById(commentId);
    }

    @Override
    public void deleteComment(Long commentId) {
        commentMapper.deleteComment(commentId);
    }

    @Override
    public List<ParttimeJobComment> getAllComments() {
        return commentMapper.selectCommentsByJobId(null); // 모든 댓글 조회 시 null 처리
    }

    @Override
    public int countAll() {
        return commentMapper.countAll();
    }

    @Override
    public List<ParttimeJobComment> getAllCommentsPaged(int offset, int limit) {
        return commentMapper.selectAllPaged(offset, limit);
    }

    @Override
    public List<ParttimeJobComment> getCommentsByJobIdPaged(Long jobId, int offset, int limit) {
        return commentMapper.selectByJobIdPaged(jobId, offset, limit);
    }

    @Override
    public int countByJobId(Long jobId) {
        return commentMapper.countByJobId(jobId);
    }
}