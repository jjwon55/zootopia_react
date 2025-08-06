package com.aloha.zootopia.controller;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.aloha.zootopia.domain.CustomUser;
import com.aloha.zootopia.domain.ParttimeJob;
import com.aloha.zootopia.domain.ParttimeJobApplicant;
import com.aloha.zootopia.domain.ParttimeJobComment;
import com.aloha.zootopia.domain.Users;
import com.aloha.zootopia.service.ParttimeJobApplicantService;
import com.aloha.zootopia.service.ParttimeJobCommentService;
import com.aloha.zootopia.service.ParttimeJobService;
import com.aloha.zootopia.service.UserService;

@Controller
@RequestMapping("/parttime")
public class ParttimeJobController {

    @Autowired
    private ParttimeJobService jobService;

    @Autowired
    private UserService userService;

    @Autowired
    private ParttimeJobCommentService commentService;

    @Autowired
    private ParttimeJobApplicantService applicantService;

    /* ✅ 2. Controller 수정: 페이지 유효성 검사 */
    @GetMapping("/list")
    public String listJobs(@RequestParam(defaultValue = "1") int page,
                            @RequestParam(name = "commentPage", defaultValue = "1") int commentPage,
                            @RequestParam(required = false) String location,
                            @RequestParam(required = false) String animalType,
                            @RequestParam(required = false) String payRange,
                            @RequestParam(required = false) String startDate,
                            @RequestParam(required = false) String endDate,
                            @RequestParam(required = false) String keyword,
                            Model model,
                            Principal principal) throws Exception {

        // ✅ 필터 조건 Map 생성
        Map<String, Object> filters = new HashMap<>();
        filters.put("location", location);
        filters.put("animalType", animalType);
        filters.put("payRange", payRange);
        filters.put("startDate", startDate);
        filters.put("endDate", endDate);
        filters.put("keyword", keyword);

        // ✅ 페이징 설정
        int pageSize = 8;
        int start = (page - 1) * pageSize;
        filters.put("offset", start);
        filters.put("limit", pageSize);

        // ✅ 필터링된 목록 가져오기
        List<ParttimeJob> jobs = jobService.getFilteredJobs(filters);
        int totalJobs = jobService.countFilteredJobs(filters);
        int totalPages = totalJobs > 0 ? (int) Math.ceil((double) totalJobs / pageSize) : 1;

        for (ParttimeJob job : jobs) {
            Users writer = userService.getUserById(job.getUserId());
            if (writer != null) {
                job.setNickname(writer.getNickname());
            }
        }

        if (page < 1 || page > totalPages) {
            return "redirect:/parttime/list?page=1"; // 잘못된 접근 방지
        }

        // ✅ 댓글 페이징 처리
        int commentPageSize = 5;
        int commentOffset = (commentPage - 1) * commentPageSize;
        List<ParttimeJobComment> pagedComments = commentService.getAllCommentsPaged(commentOffset, commentPageSize);
        int totalComments = commentService.countAll();
        // int totalCommentPages = (int) Math.ceil((double) totalComments / commentPageSize);

        int totalCommentPages = totalComments > 0
        ? (int) Math.ceil((double) totalComments / commentPageSize)
        : 1;

        // ✅ 모델에 추가
        model.addAttribute("jobs", jobs);
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", totalPages);
        
        model.addAttribute("comments", pagedComments);
        model.addAttribute("totalComments", totalComments); 
        model.addAttribute("commentPage", commentPage);
        model.addAttribute("totalCommentPages", totalCommentPages);

        // ✅ 필터 값도 모델에 포함 (선택값 유지용)
        model.addAttribute("location", location);
        model.addAttribute("animalType", animalType);
        model.addAttribute("payRange", payRange);
        model.addAttribute("startDate", startDate);
        model.addAttribute("endDate", endDate);
        model.addAttribute("keyword", keyword);

        if (principal != null) {
            String email = principal.getName();
            Users user = userService.select(email);
            model.addAttribute("user", user);
        }

        return "parttime/list";
    }


    // 등록 폼 (로그인 사용자만 접근)
    @GetMapping("/create")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public String showCreateForm() {
        return "parttime/create";
    }

    // 등록 처리
    @PostMapping("/register")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public String registerJob(ParttimeJob job, Principal principal) {
        if (principal == null) {
            throw new SecurityException("로그인 후 등록 가능합니다.");
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUser customUser = (CustomUser) authentication.getPrincipal();
        job.setUserId(customUser.getUserId());

        jobService.registerJob(job);
        return "redirect:/parttime/list";
    }

    @GetMapping("/read/{jobId}")
    public String read(@PathVariable Long jobId,
                        @RequestParam(defaultValue = "1") int applicantPage, 
                        Model model, 
                        @AuthenticationPrincipal CustomUser user) throws Exception {
        System.out.println("💥💥💥 [READ 호출됨] jobId = " + jobId); 
        
        // 1. 알바 정보 가져오기
        ParttimeJob job = jobService.getJob(jobId);
        model.addAttribute("job", job);

        // 2. 작성자 정보
        Users writer = userService.getUserById(job.getUserId());
        if (writer == null) {
            throw new IllegalStateException("작성자 정보를 찾을 수 없습니다.");
        }

        model.addAttribute("writerNickname", writer.getNickname());
        model.addAttribute("writerEmail", writer.getEmail());
        model.addAttribute("writerId", writer.getUserId());

        // 3. 로그인 사용자 정보
        Long loginUserId = null;
        if (user != null) {
            loginUserId = user.getUserId();
            model.addAttribute("loginUserNickname", user.getUser().getNickname());
            model.addAttribute("loginUserEmail", user.getUsername());
            model.addAttribute("loginUserId", loginUserId);
        } else {
            model.addAttribute("loginUserNickname", "");
            model.addAttribute("loginUserEmail", "");
            model.addAttribute("loginUserId", "");
        }

        // 4. 작성자인 경우: 전체 지원자 목록 표시
        if (loginUserId != null && loginUserId.equals(job.getUserId())) {
            int pageSize = 3;
            int offset = (applicantPage - 1) * pageSize;

            List<ParttimeJobApplicant> applicants = applicantService.getPagedApplicants(jobId, offset, pageSize);
            int totalApplicants = applicantService.countApplicantsByJobId(jobId);
            int totalApplicantPages = (int) Math.ceil((double) totalApplicants / pageSize);

            model.addAttribute("applicants", applicants);
            model.addAttribute("isWriter", true);
            model.addAttribute("applicantPage", applicantPage);
            model.addAttribute("totalApplicantPages", totalApplicantPages);
        } else if (loginUserId != null) {
            // 5. 신청자인 경우: 본인 신청 내역만 표시
            boolean hasApplied = applicantService.hasApplied(jobId, loginUserId);
            model.addAttribute("hasApplied", hasApplied);
            model.addAttribute("isWriter", false);
            if (hasApplied) {
                ParttimeJobApplicant myApplication = applicantService.getApplicantByJobIdAndUserId(jobId, loginUserId);
                model.addAttribute("myApplication", myApplication);
            }
        } else {
            // 6. 비로그인 사용자
            model.addAttribute("isWriter", false);
            model.addAttribute("hasApplied", false);
        }

        return "parttime/read";
    }

    // 수정 폼
    @GetMapping("/update/{jobId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public String showUpdateForm(@PathVariable Long jobId, Model model) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof CustomUser)) {
            throw new SecurityException("인증 정보를 가져올 수 없습니다.");
        }

        CustomUser user = (CustomUser) authentication.getPrincipal();
        Long userId = user.getUserId();

        ParttimeJob job = jobService.getJob(jobId);
        boolean isAdmin = user.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!job.getUserId().equals(userId) && !isAdmin) {
            throw new SecurityException("작성자 또는 관리자만 수정할 수 있습니다.");
        }

        model.addAttribute("job", job);
        return "parttime/update";
    }

    // 수정 처리
    @PostMapping("/update")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public String updateJob(ParttimeJob job, @AuthenticationPrincipal CustomUser user) {
        Long currentUserId = user.getUserId();
        ParttimeJob existingJob = jobService.getJob(job.getJobId());

        if (!Objects.equals(currentUserId, existingJob.getUserId())) {
            throw new SecurityException("작성자만 수정할 수 있습니다.");
        }

        jobService.updateJob(job);
        return "redirect:/parttime/read/" + job.getJobId();
    }

    // 삭제 처리
    @PostMapping("/delete/{jobId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public String deleteJob(@PathVariable Long jobId, @AuthenticationPrincipal CustomUser user,
                            RedirectAttributes redirectAttributes) {
        ParttimeJob job = jobService.getJob(jobId);
        Long userId = user.getUserId();
        boolean isAdmin = user.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!Objects.equals(job.getUserId(), userId) && !isAdmin) {
            redirectAttributes.addFlashAttribute("errorMessage", "작성자 또는 관리자만 삭제할 수 있습니다.");
            return "redirect:/parttime/read/" + jobId; // 상세 페이지로 리다이렉트
        }

        jobService.deleteJob(jobId);
        return "redirect:/parttime/list";
    }
} 
