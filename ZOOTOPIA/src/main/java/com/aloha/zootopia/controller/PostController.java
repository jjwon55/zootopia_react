package com.aloha.zootopia.controller;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.aloha.zootopia.domain.Comment;
import com.aloha.zootopia.domain.CustomUser;
import com.aloha.zootopia.domain.Pagination;
import com.aloha.zootopia.domain.Posts;
import com.aloha.zootopia.service.CommentService;
import com.aloha.zootopia.service.PostLikeService;
import com.aloha.zootopia.service.PostService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
// @CrossOrigin("*")
@RequestMapping("/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;
    private final CommentService commentService;
    private final PostLikeService postLikeService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> list(
            @RequestParam(name = "page", defaultValue = "1") long page,
            @RequestParam(name = "size", defaultValue = "10") long size,
            @RequestParam(name = "count", defaultValue = "10") long count,
            @RequestParam(name = "category", required = false) String category,
            @RequestParam(name = "type", required = false) String type,
            @RequestParam(name = "keyword", required = false) String keyword,
            @RequestParam(name = "sort", defaultValue = "latest") String sort
    ) throws Exception {

        long total = (type != null && keyword != null && !keyword.isBlank())
                ? postService.countBySearch(type, keyword)
                : postService.list().stream()
                    .filter(post -> category == null || category.equals(post.getCategory()))
                    .count();

        Pagination pagination = new Pagination(page, size, count, total);
        pagination.setCategory(category);

        List<Posts> list = (type != null && keyword != null && !keyword.isBlank())
                ? postService.pageBySearch(type, keyword, pagination)
                : ("popular".equals(sort)
                    ? postService.pageByPopularity(pagination)
                    : postService.page(pagination));

        List<Posts> topList = Optional.ofNullable(postService.getTop10PopularPosts()).orElse(new ArrayList<>());

        Map<String, Object> response = new HashMap<>();
        response.put("posts", list);
        response.put("pagination", pagination);
        response.put("topPosts", topList);

        return ResponseEntity.ok(response);
    }

   @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> read(
            @PathVariable("id") int id,
            HttpServletRequest request,
            HttpServletResponse response,
            @AuthenticationPrincipal CustomUser user
    ) throws Exception {
        Posts post = postService.selectById(id);
        if (post == null) return ResponseEntity.notFound().build();

        int postId = post.getPostId();
        String viewCookieName = "viewed_post_" + postId;
        boolean viewedRecently = false;

        // 쿠키 확인
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if (viewCookieName.equals(cookie.getName())) {
                    viewedRecently = true;
                    break;
                }
            }
        }

        // 1시간 내에 조회한 적 없으면 조회수 증가 + 쿠키 설정
        if (!viewedRecently) {
            postService.increaseViewCount(postId);
            Cookie newCookie = new Cookie(viewCookieName, "true");
            newCookie.setMaxAge(60 * 60); // 1시간
            newCookie.setPath("/");
            response.addCookie(newCookie);
        }

        // 로그인/권한
        Long loginUserId = (user != null && user.getUser() != null) ? user.getUser().getUserId() : null;
        boolean isOwner = loginUserId != null && Objects.equals(post.getUserId(), loginUserId);
        boolean liked = loginUserId != null && postLikeService.isLiked(postId, loginUserId);

        // 댓글 트리
        List<Comment> comments = commentService.getCommentsByPostIdAsTree(postId);
        post.setComments(comments);

        Map<String, Object> result = new HashMap<>();
        result.put("post", post);
        result.put("isOwner", isOwner);
        result.put("liked", liked);
        result.put("loginUserId", loginUserId);

        return ResponseEntity.ok(result);
    }

    @PostMapping
    public ResponseEntity<?> create(
            @RequestBody Posts post,
            @AuthenticationPrincipal CustomUser user
    ) throws Exception {
        if (user == null) return ResponseEntity.status(401).body("로그인 필요");

        if (post.getTitle() == null || post.getTitle().trim().isEmpty())
            return ResponseEntity.badRequest().body("제목은 1자 이상 입력해주세요.");

        if (post.getContent() == null || post.getContent().trim().length() < 5)
            return ResponseEntity.badRequest().body("본문은 5자 이상 입력해주세요.");

        post.setUserId(user.getUser().getUserId());
        boolean result = postService.insert(post);

        return result ? ResponseEntity.ok("등록 완료") : ResponseEntity.status(500).body("등록 실패");
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @PathVariable("id") int id,
            @RequestBody Posts post,
            @AuthenticationPrincipal CustomUser user
    ) throws Exception {
        if (user == null || user.getUser() == null) {
            return ResponseEntity.status(401).body("로그인이 필요합니다");
        }

        long userId = user.getUser().getUserId();

        if (!postService.isOwner(id, userId)) {
            return ResponseEntity.status(403).body("수정 권한 없음");
        }

        post.setPostId(id);
        post.setUserId(userId);

        boolean success = postService.updateById(post);
        return success ? ResponseEntity.ok("수정 완료")
                       : ResponseEntity.status(500).body("수정 실패");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(
            @PathVariable("id") int id,
            @AuthenticationPrincipal CustomUser user
    ) throws Exception {
        if (user == null || user.getUser() == null) {
            return ResponseEntity.status(401).body("로그인이 필요합니다");
        }

        long userId = user.getUser().getUserId();

        if (!postService.isOwner(id, userId)) {
            return ResponseEntity.status(403).body("삭제 권한 없음");
        }

        return postService.deleteById(id)
                ? ResponseEntity.ok("삭제 완료")
                : ResponseEntity.status(500).body("삭제 실패");
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<?> toggleLike(
            @PathVariable("id") int id,
            @AuthenticationPrincipal CustomUser user
    ) throws Exception {
        
        if (user == null || user.getUser() == null) {
            return ResponseEntity.status(401).body("로그인 필요");
        }

        boolean liked = postLikeService.toggleLike(id, user.getUser().getUserId());

        // ✅ 토글 후 최신 likeCount 재조회
        int likeCount = Optional.ofNullable(postService.selectById(id))
                                .map(Posts::getLikeCount)
                                .orElse(0);

        return ResponseEntity.ok(Map.of(
            "liked", liked,
            "likeCount", likeCount
        ));
    }

    @PostMapping("/upload/image")
    public ResponseEntity<Map<String, Object>> uploadImage(@RequestParam("image") MultipartFile file) {
        Map<String, Object> result = new HashMap<>();
        try {
            File uploadFolder = new File("C:/upload");
            if (!uploadFolder.exists()) uploadFolder.mkdirs();

            String uuid = UUID.randomUUID().toString();
            String fileName = uuid + "_" + file.getOriginalFilename();
            file.transferTo(new File(uploadFolder, fileName));

            result.put("success", 1);
            result.put("imageUrl", "/upload/" + fileName);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            result.put("success", 0);
            result.put("message", "업로드 실패");
            return ResponseEntity.status(500).body(result);
        }
    }
}
