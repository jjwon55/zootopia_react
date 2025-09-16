package com.aloha.zootopia.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.aloha.zootopia.service.AdminPostService;

import lombok.RequiredArgsConstructor;

@RestController
// @CrossOrigin("*")
@RequestMapping("/admin/post") // ✅ 게시글 관리 전용 엔드포인트
@RequiredArgsConstructor
public class AdminPostController {

    private final AdminPostService service;

    /**
     * 게시글 목록
     * 프론트 파라미터: q, category, hidden, page, size, sort, dir
     * 예) GET /admin/posts?q=&category=&hidden=&page=0&size=20&sort=createdAt&dir=desc
     */
    @GetMapping
    public ResponseEntity<?> list(
            @RequestParam(name = "q", required = false) String q,
            @RequestParam(name = "category", required = false) String category,
            @RequestParam(name = "hidden", required = false) Boolean hidden,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "20") int size,
            @RequestParam(name = "sort", defaultValue = "createdAt") String sort,
            @RequestParam(name = "dir", defaultValue = "desc") String dir
    ) {
        // AdminUserController와 동일한 응답 포맷 유지
        var result = service.list(q, category, hidden, page, size, sort, dir);

        Map<String, Object> body = new HashMap<>();
        body.put("data", result.content());
        Map<String, Object> pageInfo = Map.of(
                "number", result.page(),
                "size", result.size(),
                "totalElements", result.totalElements(),
                "totalPages", (int) Math.ceil((double) result.totalElements() / result.size())
        );
        body.put("page", pageInfo);
        body.put("meta", Map.of("timestamp", LocalDateTime.now().toString()));
        return ResponseEntity.ok(body);
    }

    /**
     * 게시글 상세
     * GET /admin/posts/{postId}
     */
    @GetMapping("/{postId}")
    public ResponseEntity<?> get(@PathVariable("postId") Integer postId) {
        var data = service.get(postId);
        return ResponseEntity.ok(Map.of("data", data));
    }

    /**
     * 게시글 숨김/해제
     * 프론트: PATCH /admin/posts/{postId}/hide?hidden=true|false
     */
    @PatchMapping("/{postId}/hide")
    public ResponseEntity<?> hide(
            @PathVariable("postId") Integer postId,
            @RequestParam(name = "hidden", defaultValue = "true") boolean hidden
    ) {
        service.setHidden(postId, hidden);
        return ResponseEntity.ok(Map.of("ok", true));
    }

    /**
     * 게시글 삭제
     * DELETE /admin/posts/{postId}
     */
    @DeleteMapping("/{postId}")
    public ResponseEntity<?> delete(@PathVariable("postId") Integer postId) {
        service.delete(postId);
        return ResponseEntity.ok(Map.of("ok", true));
    }
}
