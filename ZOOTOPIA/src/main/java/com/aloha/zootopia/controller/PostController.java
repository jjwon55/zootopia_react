package com.aloha.zootopia.controller;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.aloha.zootopia.domain.Comment;
import com.aloha.zootopia.domain.CustomUser;
import com.aloha.zootopia.domain.Pagination;
import com.aloha.zootopia.domain.Posts;
import com.aloha.zootopia.service.CommentService;
import com.aloha.zootopia.service.PostLikeService;
import com.aloha.zootopia.service.PostService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequestMapping("/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;
    private final CommentService commentService;
    private final PostLikeService postLikeService;

    /**
     * 게시글 목록 (자유글/질문글) + 인기 게시물
     */
    @GetMapping("/list")
    public String list(
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "category", required = false) String category,
            @RequestParam(name = "type", required = false) String type,
            @RequestParam(name = "keyword", required = false) String keyword,
            @RequestParam(name = "sort", defaultValue = "latest") String sort, 
            Model model
    ) throws Exception {

        List<Posts> list;
        Pagination pagination = new Pagination();
        pagination.setPage(page);
        pagination.setSize(size);
        pagination.setCount(10); // 보여줄 페이지 번호 수 (예: 1 2 3 ... 10)
        pagination.setOffset((page - 1) * size);
        pagination.setCategory(category); // 카테고리도 페이징 객체에 포함

        
        if (type != null && keyword != null && !keyword.isBlank()) {
            // 🔍 검색 결과
            list = postService.pageBySearch(type, keyword, pagination);
            long totalCount = postService.countBySearch(type, keyword);
            pagination.setTotal(totalCount);
        } else {
            if ("popular".equals(sort)) {
            list = postService.pageByPopularity(pagination);
            } else {
                list = postService.page(pagination);
            }
        }

        // 인기글
        List<Posts> topList = postService.getTop10PopularPosts();
        if (topList == null) topList = new ArrayList<>();

        // 검색 파라미터 전달 (검색 유지용)
        Map<String, String> paramMap = new HashMap<>();
        if (type != null) paramMap.put("type", type);
        if (keyword != null) paramMap.put("keyword", keyword);
        paramMap.put("sort", sort);

        // 모델 속성 주입
        model.addAttribute("list", list);
        model.addAttribute("pageInfo", pagination); // ✅ 템플릿에 동일 변수로 전달
        model.addAttribute("category", category);
        model.addAttribute("type", type);
        model.addAttribute("keyword", keyword);
        model.addAttribute("param", paramMap);
        model.addAttribute("topList", topList);
        model.addAttribute("sort", sort);

        return "posts/list";
    }



    /**
     * 게시글 읽기
     */
   @GetMapping("/read/{id}")
    public String read(
        @PathVariable("id") int id,
        Model model,
        HttpServletRequest request,
        @RequestParam(value = "editId", required = false) Integer editId,
        @AuthenticationPrincipal CustomUser user
    ) throws Exception {
        Posts post = postService.selectById(id);
        int postId = post.getPostId();

        // 조회수 관련 코드
        HttpSession session = request.getSession();
        String viewKey = "viewed_post_" + postId;
        Long lastViewTime = (Long) session.getAttribute(viewKey);
        long now = System.currentTimeMillis();
        long expireTime = 60 * 60 * 1000L;

        if (lastViewTime == null || now - lastViewTime > expireTime) {
            postService.increaseViewCount(postId);
            session.setAttribute(viewKey, now);
        }

        boolean isOwner = user != null && post.getUserId().equals(user.getUserId());

        List<Comment> comments = commentService.getCommentsByPostIdAsTree(postId);
        post.setComments(comments);

        boolean liked = false;
        if (user != null) {
            liked = postLikeService.isLiked(postId, user.getUserId());
        }

        model.addAttribute("post", post);
        model.addAttribute("isOwner", isOwner);
        model.addAttribute("editId", editId); 
        model.addAttribute("loginUserId", user != null ? user.getUser().getUserId() : null);
        model.addAttribute("liked", liked); 

        return "posts/read";
    }



    /**
     * 게시글 작성 폼
     */
    @GetMapping("/create")
    public String createForm(@AuthenticationPrincipal CustomUser user, Model model, RedirectAttributes ra) {

        if (user == null) {
            ra.addFlashAttribute("error", "로그인 후 이용 가능합니다.");
            return "redirect:/login";
        }
        model.addAttribute("post", new Posts());
        return "posts/create";
    }

    /**
     * 게시글 작성 처리
     */
    @PostMapping("/create")
    public String create(
            @ModelAttribute Posts post,
            @AuthenticationPrincipal CustomUser user,  // 로그인 사용자 정보
            RedirectAttributes ra
    ) throws Exception {

        if (post.getTitle() == null || post.getTitle().trim().isEmpty()) {
            ra.addFlashAttribute("error", "제목은 1자 이상 입력해주세요.");
            return "redirect:/posts/create";
        }

        if (post.getContent() == null || post.getContent().trim().length() < 5) {
            ra.addFlashAttribute("error", "본문은 5자 이상 입력해주세요.");
            return "redirect:/posts/create";
        }


        post.setUserId(user.getUser().getUserId());  
        
        boolean result = postService.insert(post);
        if (result) {
            ra.addFlashAttribute("msg", "등록되었습니다.");
            return "redirect:/posts/list";
        }
        ra.addFlashAttribute("error", "등록에 실패했습니다.");
        return "redirect:/posts/create";
    }

    @PostMapping("/upload/image")
    @ResponseBody
    public Map<String, Object> uploadImage(@RequestParam("image") MultipartFile file) {
        Map<String, Object> result = new HashMap<>();
        try {

            File uploadFolder = new File("C:/upload");
            if (!uploadFolder.exists()) {
                uploadFolder.mkdirs();  
            }

            String uuid = UUID.randomUUID().toString();
            String fileName = uuid + "_" + file.getOriginalFilename();
            String savePath = "C:/upload/" + fileName;

            file.transferTo(new File(savePath));

            result.put("success", 1);
            result.put("imageUrl", "/upload/" + fileName); 
        } catch (Exception e) {
            result.put("success", 0);
            result.put("message", "업로드 실패");
        }
        return result;
    }







    /**
     * 게시글 삭제
     */
    @PostMapping("/delete/{id}")
    public String delete(
        @PathVariable("id") int id,
        @AuthenticationPrincipal CustomUser user,
        RedirectAttributes ra
    ) throws Exception {
        // 🔐 글쓴이인지 확인
        boolean isOwner = postService.isOwner(id, user.getUser().getUserId());

        if (!isOwner) {
            ra.addFlashAttribute("error", "삭제 권한이 없습니다.");
            return "redirect:/posts/list";
        }

        // 🧹 삭제 서비스 호출 (댓글 + 이미지 포함)
        boolean result = postService.deleteById(id);

        if (result) {
            ra.addFlashAttribute("msg", "삭제되었습니다.");
        } else {
            ra.addFlashAttribute("error", "삭제에 실패했습니다.");
        }

        return "redirect:/posts/list";
    }


    @GetMapping("/edit/{id}")
    public String editForm(
        @PathVariable("id") int id,
        @AuthenticationPrincipal CustomUser user,
        Model model,
        RedirectAttributes ra
    ) throws Exception {

        if (user == null) {
            ra.addFlashAttribute("alert", "로그인 후 이용해주세요.");
            return "redirect:/login";
        }
        boolean isOwner = postService.isOwner(id, user.getUserId());
        if (!isOwner) {
            ra.addFlashAttribute("error", "수정 권한이 없습니다.");
            return "redirect:/posts/list";
        }

        Posts post = postService.selectById(id);
        model.addAttribute("post", post);
        return "posts/edit";  // edit.html로 이동
    }


    @PostMapping("/edit/{id}")
    public String update(
        @PathVariable("id") int id,
        @ModelAttribute Posts post,
        @AuthenticationPrincipal CustomUser user,
        RedirectAttributes ra
    ) throws Exception {

        // 🔒 글쓴이 확인
        if (!postService.isOwner(id, user.getUserId())) {
            ra.addFlashAttribute("error", "수정 권한이 없습니다.");
            return "redirect:/posts/list";
        }

        // ✅ 유효성 검사
        if (post.getTitle() == null || post.getTitle().trim().isEmpty()) {
            ra.addFlashAttribute("error", "제목은 1자 이상 입력해주세요.");
            return "redirect:/posts/edit/" + id;
        }

        if (post.getContent() == null || post.getContent().replaceAll("<[^>]*>", "").trim().length() < 5) {
            ra.addFlashAttribute("error", "본문은 5자 이상 입력해주세요.");
            return "redirect:/posts/edit/" + id;
        }

        // 수동 설정
        post.setPostId(id);
        post.setUserId(user.getUserId());

        boolean result = postService.updateById(post); // 이미지 따로 안 다루는 경우

        if (result) {
            ra.addFlashAttribute("msg", "글이 수정되었습니다.");
            return "redirect:/posts/read/" + id;
        } else {
            ra.addFlashAttribute("error", "글 수정에 실패했습니다.");
            return "redirect:/posts/edit/" + id;
        }
    }


    @PostMapping("/like/{id}")
    public String toggleLike(
            @PathVariable("id") int postId,
            @AuthenticationPrincipal CustomUser user,
            RedirectAttributes ra
    ) {
        if (user == null) {
            ra.addFlashAttribute("error", "로그인 후 이용 가능합니다.");
            return "redirect:/login";
        }

        boolean liked = postLikeService.toggleLike(postId, user.getUserId());
        if (liked) {
            ra.addFlashAttribute("msg", "좋아요를 눌렀습니다.");
        } else {
            ra.addFlashAttribute("msg", "좋아요를 취소했습니다.");
        }
        return "redirect:/posts/read/" + postId;
    }


}