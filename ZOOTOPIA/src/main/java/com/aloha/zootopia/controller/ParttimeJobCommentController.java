package com.aloha.zootopia.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.aloha.zootopia.domain.CustomUser;
import com.aloha.zootopia.domain.ParttimeJobComment;
import com.aloha.zootopia.service.ParttimeJobCommentService;

@Controller
@RequestMapping("/parttime/job/comment")
public class ParttimeJobCommentController {

    @Autowired
    private ParttimeJobCommentService commentService;

    // ✅ 댓글 등록은 로그인 사용자만 가능하게 유지
    @PostMapping("/register")
    public String registerComment(@RequestParam String writer,
                                @RequestParam String content,
                                @AuthenticationPrincipal CustomUser user) {
        ParttimeJobComment comment = new ParttimeJobComment();
        comment.setWriter(writer);
        comment.setContent(content);
        comment.setCreatedAt(LocalDateTime.now());

        if (user != null) {
            comment.setUserId(user.getUserId());
        }

        commentService.registerComment(comment);
        return "redirect:/parttime/list";
    }

    // ✅ 전체 댓글 페이징 조회 (비동기용)
    @GetMapping("/all-comments")
    public Map<String, Object> getAllComments(@RequestParam(defaultValue = "1") int page) {
        int size = 5;
        int offset = (page - 1) * size;

        List<ParttimeJobComment> comments = commentService.getAllCommentsPaged(offset, size);
        int total = commentService.countAll();

        int totalPages = (int) Math.ceil((double) total / size);

        Map<String, Object> result = new HashMap<>();
        result.put("comments", comments);
        result.put("currentPage", page);
        result.put("totalPages", totalPages);

        return result;
    }

    
    // ✅ 변경 후
    @PostMapping("/delete/{commentId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public String deleteComment(@PathVariable int commentId) {
        commentService.deleteComment(commentId);
        return "redirect:/parttime/list"; // 또는 현재 페이지 경로
    }
}
