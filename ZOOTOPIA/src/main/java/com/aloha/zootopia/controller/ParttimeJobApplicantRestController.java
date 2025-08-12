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
import com.aloha.zootopia.service.ParttimeJobApplicantService;
import com.aloha.zootopia.service.ParttimeJobService;

@RestController
@RequestMapping("/parttime")
public class ParttimeJobApplicantRestController {

    @Autowired private ParttimeJobApplicantService applicantService;
    @Autowired private ParttimeJobService jobService;

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

    // 신청
    @PostMapping("/{jobId}/applicants")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<?> apply(
            @PathVariable Long jobId,
            @RequestBody ParttimeJobApplicant req,
            Authentication auth
    ) {
        long userId = uid(auth);
        if (userId < 0) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message","로그인 필요"));
        if (applicantService.hasApplied(jobId, userId)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message","이미 신청한 알바입니다."));
        }
        ParttimeJobApplicant app = new ParttimeJobApplicant();
        app.setJobId(jobId);
        app.setUserId(userId);
        app.setEmail(req.getEmail());
        app.setPhone(req.getPhone());
        app.setIntroduction(req.getIntroduction());
        applicantService.registerApplicant(app);
        return ResponseEntity.ok(Map.of("ok", true));
    }

    // 특정 알바 지원자 목록(작성자/관리자만)
    @GetMapping("/{jobId}/applicants")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<?> list(
            @PathVariable Long jobId,
            @RequestParam(defaultValue="1") int page,
            Authentication auth
    ) {
        ParttimeJob job = jobService.getJob(jobId);
        if (job == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message","존재하지 않습니다."));

        long userId = uid(auth);
        boolean isAdmin = admin(auth);
        if (job.getUserId() == null || (job.getUserId() != userId && !isAdmin)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message","작성자 또는 관리자만 조회 가능"));
        }

        int pageSize = 3;
        int offset = (page - 1) * pageSize;
        List<ParttimeJobApplicant> list = applicantService.getPagedApplicants(jobId, offset, pageSize);
        int total = applicantService.countApplicantsByJobId(jobId);
        int totalPages = Math.max(1, (int)Math.ceil((double)total / pageSize));

        Map<String,Object> body = new HashMap<>();
        body.put("applicants", list);
        body.put("currentPage", page);
        body.put("totalPages", totalPages);
        return ResponseEntity.ok(body);
    }

    // 신청 취소(본인만) 또는 관리자 강제 삭제
    @DeleteMapping("/applicants/{applicantId}")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<?> delete(@PathVariable int applicantId, Authentication auth) {
        ParttimeJobApplicant app = applicantService.getApplicant(applicantId);
        if (app == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message","신청 내역 없음"));
        long userId = uid(auth);
        boolean isAdmin = admin(auth);
        if (app.getUserId() != userId && !isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message","본인 또는 관리자만 삭제 가능"));
        }
        applicantService.deleteApplicant(applicantId);
        return ResponseEntity.ok(Map.of("ok", true));
    }
}