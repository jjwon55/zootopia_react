package com.aloha.zootopia.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aloha.zootopia.domain.CustomUser;
import com.aloha.zootopia.domain.ParttimeJob;
import com.aloha.zootopia.domain.ParttimeJobApplicant;
import com.aloha.zootopia.domain.Users;
import com.aloha.zootopia.service.ParttimeJobApplicantService;
import com.aloha.zootopia.service.ParttimeJobService;
import com.aloha.zootopia.service.UserService;

@RestController
@RequestMapping("/parttime")
public class ParttimeJobRestController {

    @Autowired private ParttimeJobService jobService;
    @Autowired private UserService userService;
    @Autowired private ParttimeJobApplicantService applicantService;

    private long loginUserId(Authentication auth) {
        if (auth == null) return -1L;
        Object p = auth.getPrincipal();
        if (p instanceof CustomUser) return ((CustomUser) p).getUserId();
        return -1L;
    }

    private boolean isAdmin(Authentication auth) {
        if (auth == null) return false;
        for (GrantedAuthority a : auth.getAuthorities()) {
            if ("ROLE_ADMIN".equals(a.getAuthority())) return true;
        }
        return false;
    }

    // 목록 + 필터 + 페이지
    @GetMapping
    public ResponseEntity<?> list(
        @RequestParam(name = "page", defaultValue = "1") int page,
        @RequestParam(name = "location", required = false) String location,
        @RequestParam(name = "animalType", required = false) String animalType,
        @RequestParam(name = "payRange", required = false) String payRange,
        @RequestParam(name = "startDate", required = false) String startDate,
        @RequestParam(name = "endDate", required = false) String endDate,
        @RequestParam(name = "keyword", required = false) String keyword
    ) {
        page = Math.max(1, page);
        int pageSize = 8;
        int offset = (page - 1) * pageSize;

        Map<String, Object> filters = new HashMap<>();
        filters.put("location", location);
        filters.put("animalType", animalType);
        filters.put("payRange", payRange);
        filters.put("startDate", startDate);
        filters.put("endDate", endDate);
        filters.put("keyword", keyword);
        filters.put("offset", offset);
        filters.put("limit", pageSize);

        List<ParttimeJob> jobs = jobService.getFilteredJobs(filters);
        int total = jobService.countFilteredJobs(filters);
        int totalPages = Math.max(1, (int) Math.ceil((double) total / pageSize));

        // 작성자 닉네임 채우기 (예외/널 가드)
        for (ParttimeJob j : jobs) {
            try {
                Long writerId = j.getUserId();
                if (writerId != null) {
                    Users writer = userService.getUserById(writerId);
                    if (writer != null) j.setNickname(writer.getNickname());
                }
            } catch (Exception ignore) {
                // 로그 필요하면 여기서 남기기
            }
        }

        Map<String, Object> body = new HashMap<>();
        body.put("jobs", jobs);
        body.put("currentPage", page);
        body.put("totalPages", totalPages);
        return ResponseEntity.ok(body);
    }

    // 단건 조회 (상세)
    @GetMapping("/{jobId}")
    public ResponseEntity<?> read(
            @PathVariable("jobId") Long jobId,
            @RequestParam(name = "applicantPage", defaultValue = "1") int applicantPage,
            Authentication auth
    ) {
        ParttimeJob job = jobService.getJob(jobId);
        if (job == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "알바를 찾을 수 없습니다."));
        }

        Users writer = null;
        Long writerId = job.getUserId();
        try {
            if (writerId != null) {
                writer = userService.getUserById(writerId);
            }
        } catch (Exception ignore) {
            // 필요시 로그
        }

        long uid = loginUserId(auth);
        boolean admin = isAdmin(auth);
        boolean writerView = (uid > 0 && writerId != null && writerId.longValue() == uid);

        Map<String, Object> body = new HashMap<>();
        body.put("job", job);
        body.put("writerNickname", writer != null ? writer.getNickname() : "");
        body.put("writerEmail", writer != null ? writer.getEmail() : "");
        body.put("writerId", writerId);
        body.put("loginUserId", uid);
        body.put("isWriter", writerView);

        // 작성자/관리자는 지원자 목록 페이징 조회
        if (writerView || admin) {
            int pageSize = 3;
            int offset = (applicantPage - 1) * pageSize;
            List<ParttimeJobApplicant> applicants = applicantService.getPagedApplicants(jobId, offset, pageSize);
            int totalApplicants = applicantService.countApplicantsByJobId(jobId);
            int totalApplicantPages = Math.max(1, (int) Math.ceil((double) totalApplicants / pageSize));

            body.put("applicants", applicants);
            body.put("applicantPage", applicantPage);
            body.put("totalApplicantPages", totalApplicantPages);
        } else if (uid > 0) {
            // 일반 로그인 사용자: 본인 신청 여부
            boolean hasApplied = applicantService.hasApplied(jobId, uid);
            body.put("hasApplied", hasApplied);
            if (hasApplied) {
                ParttimeJobApplicant my = applicantService.getApplicantByJobIdAndUserId(jobId, uid);
                body.put("myApplication", my);
            }
        } else {
            body.put("hasApplied", false);
        }

        return ResponseEntity.ok(body);
    }

    // 등록
    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> create(@RequestBody ParttimeJob job, Authentication auth) {
        long uid = loginUserId(auth);
        if (uid < 0) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "로그인 필요"));
        }
        job.setUserId(uid);
        jobService.registerJob(job);
        return ResponseEntity.ok(Map.of("ok", true, "jobId", job.getJobId()));
    }

    // 수정
    @PostMapping("/{jobId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> update(@PathVariable Long jobId, @RequestBody ParttimeJob job, Authentication auth) {
        ParttimeJob origin = jobService.getJob(jobId);
        if (origin == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "존재하지 않습니다."));
        }

        long uid = loginUserId(auth);
        boolean admin = isAdmin(auth);
        Long ownerId = origin.getUserId();
        if (ownerId == null || (ownerId.longValue() != uid && !admin)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "작성자 또는 관리자만 수정 가능"));
        }

        job.setJobId(jobId);
        job.setUserId(ownerId);
        jobService.updateJob(job);
        return ResponseEntity.ok(Map.of("ok", true));
    }

    // 삭제
    @DeleteMapping("/{jobId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> delete(@PathVariable Long jobId, Authentication auth) {
        ParttimeJob origin = jobService.getJob(jobId);
        if (origin == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "존재하지 않습니다."));
        }

        long uid = loginUserId(auth);
        boolean admin = isAdmin(auth);
        Long ownerId = origin.getUserId();
        if (ownerId == null || (ownerId.longValue() != uid && !admin)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "작성자 또는 관리자만 삭제 가능"));
        }

        jobService.deleteJob(jobId);
        return ResponseEntity.ok(Map.of("ok", true));
    }
}