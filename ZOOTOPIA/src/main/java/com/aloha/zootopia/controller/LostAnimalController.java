package com.aloha.zootopia.controller;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
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
import com.aloha.zootopia.domain.LostAnimalPost;
import com.aloha.zootopia.domain.Pagination;
import com.aloha.zootopia.service.LostAnimalCommentService;
import com.aloha.zootopia.service.LostAnimalService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
@RequestMapping("/lost")
public class LostAnimalController {

    private final LostAnimalService lostAnimalService;
    private final LostAnimalCommentService lostAnimalCommentService;

    /* 목록 */
    @GetMapping("/list")
    public String list(
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "type", required = false) String type,
            @RequestParam(name = "keyword", required = false) String keyword,
            Model model
    ) throws Exception {

        List<LostAnimalPost> list;
        Pagination pagination = new Pagination();
        pagination.setPage(page);
        pagination.setSize(size);
        pagination.setCount(10); // 페이지 번호 수
        pagination.setOffset((page - 1) * size);

        if (type != null && keyword != null && !keyword.isBlank()) {
            // 🔍 검색 결과
            list = lostAnimalService.pageBySearch(type, keyword, pagination);
            long totalCount = lostAnimalService.countBySearch(type, keyword);
            pagination.setTotal(totalCount);
        } else {
            // 전체 목록 조회 (최신순)
            list = lostAnimalService.getAll(pagination);
            long totalCount = lostAnimalService.countAll();
            pagination.setTotal(totalCount);
        }

        // 검색 유지용 파라미터 전달
        Map<String, String> paramMap = new HashMap<>();
        if (type != null) paramMap.put("type", type);
        if (keyword != null) paramMap.put("keyword", keyword);

        model.addAttribute("list", list);
        model.addAttribute("pageInfo", pagination);
        model.addAttribute("type", type);
        model.addAttribute("keyword", keyword);
        model.addAttribute("param", paramMap);

        return "lost/list";
    }


    /** 글쓰기 폼 */
    @GetMapping("/create")
    public String createForm(@AuthenticationPrincipal CustomUser user, Model model, RedirectAttributes ra) {

        if (user == null) {
            ra.addFlashAttribute("error", "로그인이 필요합니다.");
            return "redirect:/login";
        }
        model.addAttribute("post", new LostAnimalPost());
        return "lost/create";
    }

    /** 글 등록 처리 */
    @PostMapping("/create")
    public String create(@ModelAttribute LostAnimalPost post,
                         @AuthenticationPrincipal CustomUser user,
                         RedirectAttributes ra) {
        if (user == null) {
            ra.addFlashAttribute("error", "로그인이 필요합니다.");
            return "redirect:/lost/list";
        }

        post.setUserId(user.getUser().getUserId());
        boolean result = lostAnimalService.insert(post);

        ra.addFlashAttribute(result ? "msg" : "error", result ? "등록되었습니다." : "등록 실패");
        return result ? "redirect:/lost/list" : "redirect:/lost/create";
    }

    /* 게시글 읽기 */
    @GetMapping("/read/{id}")
    public String read(@PathVariable("id") int id,
                       @AuthenticationPrincipal CustomUser user,
                       @RequestParam(value = "editId", required = false) Integer editId,
                       HttpServletRequest request,
                       Model model) {

        LostAnimalPost post = lostAnimalService.getById(id);
        int postId = post.getPostId();


        // 댓글
        List<Comment> commentList = lostAnimalCommentService.getCommentsByPostIdAsTree(postId);
        post.setComments(commentList);

        // 조회수 중복 방지
        HttpSession session = request.getSession();
        String key = "viewed_lost_" + id;
        Long lastViewed = (Long) session.getAttribute(key);
        long now = System.currentTimeMillis();

        if (lastViewed == null || now - lastViewed > 60 * 60 * 1000) {
            lostAnimalService.increaseViewCount(postId);
            session.setAttribute(key, now);
        }

        Long loginUserId = user != null ? user.getUser().getUserId() : null;
        boolean isOwner = Objects.equals(post.getUserId(), loginUserId);

        model.addAttribute("post", post);
        model.addAttribute("isOwner", isOwner);
        model.addAttribute("editId", editId); 
        model.addAttribute("loginUserId", loginUserId);

        return "lost/read";
    }

    /** 🔧 수정 폼 */
    @GetMapping("/edit/{id}")
    public String editForm(
            @PathVariable("id") int id,
            @AuthenticationPrincipal CustomUser user,
            Model model,
            RedirectAttributes ra
    ) {

        if (user == null) {
            ra.addFlashAttribute("alert", "로그인 후 이용해주세요.");
            return "redirect:/login";
        }
       boolean isOwner = lostAnimalService.isOwner(id, user.getUserId());
        if (!isOwner) {
            ra.addFlashAttribute("error", "수정 권한이 없습니다.");
            return "redirect:/lost/list";
        }

        LostAnimalPost post = lostAnimalService.getById(id);
        model.addAttribute("post", post);
        return "lost/edit";  // edit.html로 이동
    }

    /** 🔧 수정 처리 */
    @PostMapping("/edit/{id}")
    public String update(
            @PathVariable("id") int id,
            @ModelAttribute LostAnimalPost post,
            @AuthenticationPrincipal CustomUser user,
            RedirectAttributes ra
    ) {
        // 🔒 글쓴이 확인
        if (!lostAnimalService.isOwner(id, user.getUserId())) {
            ra.addFlashAttribute("error", "수정 권한이 없습니다.");
            return "redirect:/lost/list";
        }

        // ✅ 유효성 검사
        if (post.getTitle() == null || post.getTitle().trim().isEmpty()) {
            ra.addFlashAttribute("error", "제목은 1자 이상 입력해주세요.");
            return "redirect:/lost/edit/" + id;
        }

        if (post.getContent() == null || post.getContent().replaceAll("<[^>]*>", "").trim().length() < 5) {
            ra.addFlashAttribute("error", "본문은 5자 이상 입력해주세요.");
            return "redirect:/lost/edit/" + id;
        }

        // 수동 설정
        post.setPostId(id);
        post.setUserId(user.getUserId());

        boolean result = lostAnimalService.update(post); // 이미지 따로 안 다루는 경우

        if (result) {
            ra.addFlashAttribute("msg", "글이 수정되었습니다.");
            return "redirect:/lost/read/" + id;
        } else {
            ra.addFlashAttribute("error", "글 수정에 실패했습니다.");
            return "redirect:/lost/edit/" + id;
        }
    }

    /** 삭제 */
    @PostMapping("/delete/{id}")
    public String delete(@PathVariable("id") int id,
                         @AuthenticationPrincipal CustomUser user,
                         RedirectAttributes ra) {
        LostAnimalPost post = lostAnimalService.getById(id);
        if (post == null || user == null || !Objects.equals(post.getUserId(), user.getUser().getUserId())) {
            ra.addFlashAttribute("error", "삭제 권한이 없습니다.");
            return "redirect:/lost/list";
        }

        boolean result = lostAnimalService.delete(id);
        ra.addFlashAttribute(result ? "msg" : "error", result ? "삭제되었습니다." : "삭제 실패");

        return "redirect:/lost/list";
    }

    /** 이미지 업로드 */
    @PostMapping("/upload/image")
    @ResponseBody
    public Map<String, Object> uploadImage(@RequestParam("image") MultipartFile file) {
        Map<String, Object> result = new HashMap<>();
        try {
            File uploadFolder = new File("C:/upload");
            if (!uploadFolder.exists()) uploadFolder.mkdirs();

            String uuid = UUID.randomUUID().toString();
            String fileName = uuid + "_" + file.getOriginalFilename();
            file.transferTo(new File(uploadFolder, fileName));

            result.put("success", 1);
            result.put("imageUrl", "/upload/" + fileName);
        } catch (Exception e) {
            result.put("success", 0);
            result.put("message", "업로드 실패");
        }
        return result;
    }
}
