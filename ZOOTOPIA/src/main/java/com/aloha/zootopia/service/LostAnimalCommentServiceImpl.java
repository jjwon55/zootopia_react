package com.aloha.zootopia.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aloha.zootopia.domain.Comment;
import com.aloha.zootopia.mapper.CommentMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LostAnimalCommentServiceImpl implements LostAnimalCommentService{
    
    @Autowired
    private CommentMapper commentMapper;

    @Autowired
    private LostAnimalService lostAnimalService;

    @Override
    public List<Comment> getCommentsByPostId(Integer postId) {
        return commentMapper.findLostByPostId(postId);
    }

    @Override
    public void addComment(Comment comment) {
        commentMapper.insertLost(comment);
        lostAnimalService.increaseCommentCount(comment.getPostId());
    }

    @Override
    public void deleteComment(Integer commentId) {
        commentMapper.softDeleteLost(commentId);
    }

    @Override
    public void updateCommentContent(Comment comment) {
        commentMapper.updateLostContent(comment);
    }

    @Override
    public Comment findById(Integer commentId) {
        return commentMapper.findLostById(commentId);
    }


    public List<Comment> getCommentsByPostIdAsTree(Integer postId) {
        List<Comment> flatList = commentMapper.findLostByPostId(postId); 
        return buildCommentTree(flatList);
    }


    public List<Comment> buildCommentTree(List<Comment> flatList) {
        Map<Integer, Comment> map = new HashMap<>();
        List<Comment> roots = new ArrayList<>();

        for (Comment c : flatList) {
            c.setReplies(new ArrayList<>());
            map.put(c.getCommentId(), c);
        }

        for (Comment c : flatList) {
            if (c.getParentId() == null) {
                roots.add(c); // 원댓글
            } else {
                Comment parent = map.get(c.getParentId());
                if (parent != null) {
                    parent.getReplies().add(c); // 대댓글 연결
                }
            }
        }

        return roots;
    }
}


