package com.aloha.zootopia.service;

import com.aloha.zootopia.domain.Comment;
import java.util.List;

public interface LostAnimalCommentService {

    List<Comment> getCommentsByPostId(Integer postId);
    void addComment(Comment comment);
    void deleteComment(Integer commentId);
    void updateCommentContent(Comment comment);
    Comment findById(Integer commentId);
    List<Comment> getCommentsByPostIdAsTree(Integer postId);

}
