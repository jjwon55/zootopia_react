package com.aloha.zootopia.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.aloha.zootopia.domain.Comment;
import com.aloha.zootopia.domain.CustomUser;
import com.aloha.zootopia.service.LostAnimalCommentService;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Objects;

@RestController
@RequiredArgsConstructor
@RequestMapping("/lost/comments")
public class LostAnimalCommentController {

    private final LostAnimalCommentService commentService;

    /** 📌 댓글 목록 조회 (postId 기준) */
    @GetMapping("/{postId}")
    public ResponseEntity<List<Comment>> getComments(@PathVariable("postId") Integer postId) {
        List<Comment> comments = commentService.getCommentsByPostIdAsTree(postId);
        return ResponseEntity.ok(comments);
    }

    /** 📌 댓글 등록 */
    @PostMapping
    public ResponseEntity<?> addComment(
            @RequestBody Comment comment,
            @AuthenticationPrincipal CustomUser user
    ) throws Exception {
        if (user == null || user.getUser() == null) {
            return ResponseEntity.status(401).body("로그인이 필요합니다.");
        }

        comment.setUserId(user.getUser().getUserId());
        commentService.addComment(comment);

        return ResponseEntity.ok(comment);
    }

    /** 📌 댓글 수정 */
    @PutMapping("/{commentId}")
    public ResponseEntity<?> updateComment(
            @PathVariable("commentId") Integer commentId,
            @RequestBody Comment comment,
            @AuthenticationPrincipal CustomUser user
    ) throws Exception {
        if (user == null || user.getUser() == null) {
            return ResponseEntity.status(401).body("로그인이 필요합니다.");
        }

        Comment original = commentService.findById(commentId);
        if (original == null) {
            return ResponseEntity.notFound().build();
        }
        if (!Objects.equals(original.getUserId(), user.getUser().getUserId())) {
            return ResponseEntity.status(403).body("수정 권한이 없습니다.");
        }

        comment.setCommentId(commentId);
        commentService.updateCommentContent(comment);

        return ResponseEntity.ok("수정 완료");
    }

    /** 📌 댓글 삭제 */
    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(
            @PathVariable("commentId") Integer commentId,
            @AuthenticationPrincipal CustomUser user
    ) throws Exception {
        if (user == null || user.getUser() == null) {
            return ResponseEntity.status(401).body("로그인이 필요합니다.");
        }

        Comment original = commentService.findById(commentId);
        if (original == null) {
            return ResponseEntity.notFound().build();
        }
        if (!Objects.equals(original.getUserId(), user.getUser().getUserId())) {
            return ResponseEntity.status(403).body("삭제 권한이 없습니다.");
        }

        commentService.deleteComment(commentId);
        return ResponseEntity.ok("삭제 완료");
    }

    /** 📌 답글 등록 */
    @PostMapping("/reply")
    public ResponseEntity<?> addReply(
            @RequestBody Comment reply,
            @AuthenticationPrincipal CustomUser user
    ) throws Exception {
        if (user == null || user.getUser() == null) {
            return ResponseEntity.status(401).body("로그인이 필요합니다.");
        }

        reply.setUserId(user.getUser().getUserId());
        commentService.addComment(reply);

        return ResponseEntity.ok(reply);
    }
}
