package com.aloha.zootopia.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import com.aloha.zootopia.domain.CustomUser;
import com.aloha.zootopia.domain.ParttimeJobComment;
import com.aloha.zootopia.service.ParttimeJobCommentService;

@RestController
@RequestMapping("/api/parttime/comments")
public class ParttimeJobCommentRestController {

    @Autowired private ParttimeJobCommentService commentService;

    private long uid(Authentication auth) {
        if (auth == null) return -1L;
        Object p = auth.getPrincipal();
        if (p instanceof CustomUser) return ((CustomUser)p).getUserId();
        return -1L;
    }
    private boolean admin(Authentication auth) {
        if (auth == null) return false;
        for (GrantedAuthority a : auth.getAuthorities()) {
            if ("ROLE_ADMIN".equals(a.getAuthority())) return true;
        }
        return false;
    }

    // 전체 댓글 페이징
    @GetMapping
    public ResponseEntity<?> list(@RequestParam(defaultValue="1") int page) {
        int size = 5;
        int offset = (page - 1) * size;
        List<ParttimeJobComment> comments = commentService.getAllCommentsPaged(offset, size);
        int total = commentService.countAll();
        int totalPages = Math.max(1, (int)Math.ceil((double) total / size));

        Map<String,Object> body = new HashMap<>();
        body.put("comments", comments);
        body.put("currentPage", page);
        body.put("totalPages", totalPages);
        body.put("totalComments", total);
        return ResponseEntity.ok(body);
    }

    // 등록 (USER)
    @PostMapping
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<?> create(@RequestBody ParttimeJobComment req, Authentication auth) {
        long userId = uid(auth);
        if (userId < 0) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message","로그인 필요"));

        ParttimeJobComment c = new ParttimeJobComment();
        c.setUserId(userId);
        c.setWriter(req.getWriter());             // 닉네임/표시명
        c.setJobId(req.getJobId());               // 특정 알바에 종속이면 세팅, 아니면 null 가능
        c.setContent(req.getContent());
        c.setCreatedAt(LocalDateTime.now());
        commentService.registerComment(c);

        return ResponseEntity.ok(Map.of("ok", true, "commentId", c.getCommentId()));
    }

    // 삭제 (본인/관리자)
    @DeleteMapping("/{commentId}")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<?> delete(@PathVariable int commentId, Authentication auth) {
        ParttimeJobComment c = commentService.getCommentById(commentId);
        if (c == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message","댓글이 없습니다."));
        long userId = uid(auth);
        boolean isAdmin = admin(auth);
        if (c.getUserId() == null || (c.getUserId() != userId && !isAdmin)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message","작성자 또는 관리자만 삭제 가능"));
        }
        commentService.deleteComment(commentId);
        return ResponseEntity.ok(Map.of("ok", true));
    }
}