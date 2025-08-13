package com.aloha.zootopia.controller;

import java.io.File;
import java.util.*;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.aloha.zootopia.domain.Comment;
import com.aloha.zootopia.domain.CustomUser;
import com.aloha.zootopia.domain.LostAnimalPost;
import com.aloha.zootopia.domain.Pagination;
import com.aloha.zootopia.service.LostAnimalCommentService;
import com.aloha.zootopia.service.LostAnimalService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequestMapping("/lost")
@RequiredArgsConstructor
public class LostAnimalController {

    private final LostAnimalService lostAnimalService;
    private final LostAnimalCommentService lostAnimalCommentService;

    /** 📌 목록 조회 */
    @GetMapping
    public ResponseEntity<Map<String, Object>> list(
            @RequestParam(name = "page", defaultValue = "1") long page,
            @RequestParam(name = "size", defaultValue = "10") long size,
            @RequestParam(name = "count", defaultValue = "10") long count,
            @RequestParam(name = "type", required = false) String type,
            @RequestParam(name = "keyword", required = false) String keyword
    ) throws Exception {

        long total = (type != null && keyword != null && !keyword.isBlank())
                ? lostAnimalService.countBySearch(type, keyword)
                : lostAnimalService.countAll();

        Pagination pagination = new Pagination(page, size, count, total);

        List<LostAnimalPost> list = (type != null && keyword != null && !keyword.isBlank())
                ? lostAnimalService.pageBySearch(type, keyword, pagination)
                : lostAnimalService.getAll(pagination);

        Map<String, Object> response = new HashMap<>();
        response.put("posts", list);
        response.put("pagination", pagination);

        return ResponseEntity.ok(response);
    }

    /** 📌 단일 게시글 조회 */
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> read(
            @PathVariable("id") int id,
            HttpServletRequest request,
            HttpServletResponse response,
            @AuthenticationPrincipal CustomUser user
    ) throws Exception {
        LostAnimalPost post = lostAnimalService.getById(id);
        if (post == null) return ResponseEntity.notFound().build();

        int postId = post.getPostId();

        // ✅ 조회수 중복 방지 (쿠키 기반)
        String viewCookieName = "viewed_lost_" + postId;
        boolean viewedRecently = false;

        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if (viewCookieName.equals(cookie.getName())) {
                    viewedRecently = true;
                    break;
                }
            }
        }

        if (!viewedRecently) {
            lostAnimalService.increaseViewCount(postId);
            Cookie newCookie = new Cookie(viewCookieName, "true");
            newCookie.setMaxAge(60 * 60); // 1시간
            newCookie.setPath("/");
            response.addCookie(newCookie);
        }

        // 로그인 정보
        Long loginUserId = (user != null && user.getUser() != null) ? user.getUser().getUserId() : null;
        boolean isOwner = loginUserId != null && Objects.equals(post.getUserId(), loginUserId);

        // 댓글
        List<Comment> comments = lostAnimalCommentService.getCommentsByPostIdAsTree(postId);
        post.setComments(comments);

        Map<String, Object> result = new HashMap<>();
        result.put("post", post);
        result.put("isOwner", isOwner);
        result.put("loginUserId", loginUserId);

        return ResponseEntity.ok(result);
    }

    /** 📌 글 작성 */
    @PostMapping
    public ResponseEntity<?> create(
            @RequestBody LostAnimalPost post,
            @AuthenticationPrincipal CustomUser user
    ) throws Exception {
        if (user == null) return ResponseEntity.status(401).body("로그인 필요");

        if (post.getTitle() == null || post.getTitle().trim().isEmpty())
            return ResponseEntity.badRequest().body("제목은 1자 이상 입력해주세요.");

        if (post.getContent() == null || post.getContent().replaceAll("<[^>]*>", "").trim().length() < 5)
            return ResponseEntity.badRequest().body("본문은 5자 이상 입력해주세요.");

        post.setUserId(user.getUser().getUserId());
        boolean result = lostAnimalService.insert(post);

        return result ? ResponseEntity.ok("등록 완료") : ResponseEntity.status(500).body("등록 실패");
    }

    /** 📌 글 수정 */
    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @PathVariable("id") int id,
            @RequestBody LostAnimalPost post,
            @AuthenticationPrincipal CustomUser user
    ) throws Exception {
        if (user == null || user.getUser() == null)
            return ResponseEntity.status(401).body("로그인이 필요합니다");

        long userId = user.getUser().getUserId();

        if (!lostAnimalService.isOwner(id, userId))
            return ResponseEntity.status(403).body("수정 권한 없음");

        post.setPostId(id);
        post.setUserId(userId);

        boolean success = lostAnimalService.update(post);
        return success ? ResponseEntity.ok("수정 완료")
                       : ResponseEntity.status(500).body("수정 실패");
    }

    /** 📌 글 삭제 */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(
            @PathVariable("id") int id,
            @AuthenticationPrincipal CustomUser user
    ) throws Exception {
        if (user == null || user.getUser() == null)
            return ResponseEntity.status(401).body("로그인이 필요합니다");

        long userId = user.getUser().getUserId();

        if (!lostAnimalService.isOwner(id, userId))
            return ResponseEntity.status(403).body("삭제 권한 없음");

        return lostAnimalService.delete(id)
                ? ResponseEntity.ok("삭제 완료")
                : ResponseEntity.status(500).body("삭제 실패");
    }

    /** 📌 이미지 업로드 */
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
