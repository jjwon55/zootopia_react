package com.aloha.zootopia.controller;

import java.io.File;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

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
@RequestMapping("/showoff")
@RequiredArgsConstructor
public class ShowoffController {

    private final PostService postService;
    private final CommentService commentService;
    private final PostLikeService postLikeService;

    private static final String CATEGORY = "자랑글";

    /**
     * 자랑글 목록 + 인기글
     * params: page, size(기본 12), type(title|titleContent|tag), keyword, sort(latest|popular)
     * 반환: { list, topList, pageInfo }
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> list(
            @RequestParam(name = "page", defaultValue = "1") long page,
            @RequestParam(name = "size", defaultValue = "12") long size,
            @RequestParam(name = "type", required = false) String type,
            @RequestParam(name = "keyword", required = false) String keyword,
            @RequestParam(name = "sort", defaultValue = "latest") String sort
    ) throws Exception {

        // 총 건수
        long total = (type != null && keyword != null && !keyword.isBlank())
                ? postService.countBySearch(type, keyword) // 검색 총건수
                : postService.list().stream()
                    .filter(p -> CATEGORY.equals(p.getCategory()))
                    .count();

        // 페이지 정보
        Pagination pageInfo = new Pagination(page, size, /*count per pager*/10, total);
        pageInfo.setCategory(CATEGORY);

        // 목록
        List<Posts> list =
                (type != null && keyword != null && !keyword.isBlank())
                    ? postService.pageBySearch(type, keyword, pageInfo).stream()
                        .filter(p -> CATEGORY.equals(p.getCategory())) // 혹시 다른 카테고리 섞여 오면 방지
                        .collect(Collectors.toList())
                    : ("popular".equals(sort)
                        ? postService.pageByPopularity(pageInfo)
                        : postService.page(pageInfo));

        // 인기글 top10
        List<Posts> topList = Optional.ofNullable(postService.getTop10PopularPosts())
                .orElseGet(ArrayList::new);

        Map<String, Object> body = new HashMap<>();
        body.put("list", list);
        body.put("pageInfo", pageInfo);
        body.put("topList", topList);

        return ResponseEntity.ok(body);
    }

    /**
     * 자랑글 읽기
     * 반환: { post, isOwner, liked, loginUserId }
     * 조회수: 1시간 중복 방지(쿠키)
     */
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> read(
            @PathVariable("id") int id,
            HttpServletRequest request,
            HttpServletResponse response,
            @AuthenticationPrincipal CustomUser user
    ) throws Exception {

        Posts post = postService.selectById(id);
        if (post == null || !CATEGORY.equals(post.getCategory())) {
            return ResponseEntity.notFound().build();
        }

        int postId = post.getPostId();
        String viewCookieName = "viewed_showoff_" + postId;
        boolean viewedRecently = false;

        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie c : cookies) {
                if (viewCookieName.equals(c.getName())) {
                    viewedRecently = true;
                    break;
                }
            }
        }

        if (!viewedRecently) {
            postService.increaseViewCount(postId);
            Cookie cookie = new Cookie(viewCookieName, "true");
            cookie.setMaxAge(60 * 60); // 1시간
            cookie.setPath("/");
            response.addCookie(cookie);
        }

        Long loginUserId = (user != null && user.getUser() != null) ? user.getUser().getUserId() : null;
        boolean isOwner = loginUserId != null && Objects.equals(post.getUserId(), loginUserId);
        boolean liked = loginUserId != null && postLikeService.isLiked(postId, loginUserId);

        // 댓글 트리
        List<Comment> comments = commentService.getCommentsByPostIdAsTree(postId);
        post.setComments(comments);

        Map<String, Object> body = new HashMap<>();
        body.put("post", post);
        body.put("isOwner", isOwner);
        body.put("liked", liked);
        body.put("loginUserId", loginUserId);

        return ResponseEntity.ok(body);
    }

    /**
     * 자랑글 작성
     */
    @PostMapping
    public ResponseEntity<?> create(
            @RequestBody Posts post,
            @AuthenticationPrincipal CustomUser user
    ) throws Exception {
        if (user == null || user.getUser() == null) {
            return ResponseEntity.status(401).body("로그인 필요");
        }

        if (post.getTitle() == null || post.getTitle().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("제목은 1자 이상 입력해주세요.");
        }
        if (post.getContent() == null || post.getContent().trim().length() < 5) {
            return ResponseEntity.badRequest().body("본문은 5자 이상 입력해주세요.");
        }

        post.setCategory(CATEGORY);
        post.setUserId(user.getUser().getUserId());

        boolean ok = postService.insert(post);
        return ok ? ResponseEntity.ok("등록 완료")
                  : ResponseEntity.status(500).body("등록 실패");
    }

    /**
     * 자랑글 수정
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @PathVariable("id") int id,
            @RequestBody Posts post,
            @AuthenticationPrincipal CustomUser user
    ) throws Exception {
        if (user == null || user.getUser() == null) {
            return ResponseEntity.status(401).body("로그인 필요");
        }
        long loginUserId = user.getUser().getUserId();

        if (!postService.isOwner(id, loginUserId)) {
            return ResponseEntity.status(403).body("수정 권한 없음");
        }

        post.setPostId(id);
        post.setUserId(loginUserId);
        post.setCategory(CATEGORY); // 카테고리 고정

        boolean ok = postService.updateById(post);
        return ok ? ResponseEntity.ok("수정 완료")
                  : ResponseEntity.status(500).body("수정 실패");
    }

    /**
     * 자랑글 삭제
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(
            @PathVariable("id") int id,
            @AuthenticationPrincipal CustomUser user
    ) throws Exception {
        if (user == null || user.getUser() == null) {
            return ResponseEntity.status(401).body("로그인 필요");
        }
        long loginUserId = user.getUser().getUserId();

        if (!postService.isOwner(id, loginUserId)) {
            return ResponseEntity.status(403).body("삭제 권한 없음");
        }

        boolean ok = postService.deleteById(id);
        return ok ? ResponseEntity.ok("삭제 완료")
                  : ResponseEntity.status(500).body("삭제 실패");
    }

    /**
     * 좋아요 토글
     * 반환: { liked, likeCount }
     */
    @PostMapping("/{id}/like")
    public ResponseEntity<Map<String, Object>> toggleLike(
            @PathVariable("id") int id,
            @AuthenticationPrincipal CustomUser user
    ) throws Exception {
        if (user == null || user.getUser() == null) {
            return ResponseEntity.status(401).body(Map.of("error", "로그인 필요"));
        }

        boolean liked = postLikeService.toggleLike(id, user.getUser().getUserId());
        int likeCount = Optional.ofNullable(postService.selectById(id))
                                .map(Posts::getLikeCount)
                                .orElse(0);

        return ResponseEntity.ok(Map.of(
                "liked", liked,
                "likeCount", likeCount
        ));
    }

    /**
     * 에디터 이미지 업로드
     * 반환: { success: 1|0, imageUrl }
     */
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
            log.error("이미지 업로드 실패", e);
            result.put("success", 0);
            result.put("message", "업로드 실패");
            return ResponseEntity.status(500).body(result);
        }
    }
}
