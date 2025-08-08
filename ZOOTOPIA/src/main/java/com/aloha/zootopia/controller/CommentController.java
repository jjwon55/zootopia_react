package com.aloha.zootopia.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.aloha.zootopia.domain.Comment;
import com.aloha.zootopia.domain.CustomUser;
import com.aloha.zootopia.service.CommentService;

import lombok.RequiredArgsConstructor;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/comments")
public class CommentController {

    private final CommentService commentService;

    // ✅ 댓글 목록 가져오기 (postId 기준)
    @GetMapping("/{postId}")
    public ResponseEntity<List<Comment>> getComments(@PathVariable("postId") Integer postId) {
        List<Comment> comments = commentService.getCommentsByPostIdAsTree(postId);
        return ResponseEntity.ok(comments);
    }

    // ✅ 댓글 등록
    @PostMapping
    public ResponseEntity<Comment> addComment(@RequestBody Comment comment,
            @AuthenticationPrincipal CustomUser user) throws Exception {
       
        comment.setUserId(user.getUser().getUserId());

        commentService.addComment(comment);
        return ResponseEntity.ok(comment);
    }

    // ✅ 댓글 수정
    @PutMapping("/{commentId}")
    public ResponseEntity<?> updateComment(@PathVariable Integer commentId,
            @RequestBody Comment comment,
            @AuthenticationPrincipal CustomUser user) throws Exception {
        Comment original = commentService.findById(commentId);
        if (!original.getUserId().equals(user.getUser().getUserId())) {
            return ResponseEntity.status(403).body("수정 권한이 없습니다.");
        }

        comment.setCommentId(commentId);
        commentService.updateCommentContent(comment);
        return ResponseEntity.ok().build();
    }

    // ✅ 댓글 삭제
    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable Integer commentId,
            @AuthenticationPrincipal CustomUser user) throws Exception {
        Comment original = commentService.findById(commentId);
        if (!original.getUserId().equals(user.getUser().getUserId())) {
            return ResponseEntity.status(403).body("삭제 권한이 없습니다.");
        }

        commentService.deleteComment(commentId);
        return ResponseEntity.ok().build();
    }

    // ✅ 답글 등록
    @PostMapping("/reply")
    public ResponseEntity<Comment> addReply(@RequestBody Comment reply,
            @AuthenticationPrincipal CustomUser user) throws Exception {
   

        reply.setUserId(user.getUser().getUserId());
        commentService.addComment(reply);
        return ResponseEntity.ok(reply);
    }
}
