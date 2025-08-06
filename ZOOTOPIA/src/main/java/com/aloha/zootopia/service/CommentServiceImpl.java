package com.aloha.zootopia.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aloha.zootopia.domain.Comment;
import com.aloha.zootopia.mapper.CommentMapper;




@Service

public class CommentServiceImpl implements CommentService {

    @Autowired
    private CommentMapper commentMapper;
    @Autowired
    private PostService postService;


    @Override
    public List<Comment> getCommentsByPostId(Integer postId) {
        return commentMapper.findByPostId(postId);
    }

    @Override
    public void addComment(Comment comment) {
        commentMapper.insert(comment);
        postService.increaseCommentCount(comment.getPostId());
    }

    @Override
    public void deleteComment(Integer commentId) {
        commentMapper.softDelete(commentId);
    }
    
    @Override
    public void updateCommentContent(Comment comment) {
        commentMapper.updateContent(comment);
    }

    @Override
    public Comment findById(Integer commentId) {
        return commentMapper.findById(commentId);
    }



    public List<Comment> getCommentsByPostIdAsTree(Integer postId) {
        List<Comment> flatList = commentMapper.findByPostId(postId); 
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
