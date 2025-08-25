package com.aloha.zootopia.controller;

import java.util.Map;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.aloha.zootopia.domain.CustomUser;
import com.aloha.zootopia.domain.ReportReason;
import com.aloha.zootopia.domain.ReportStatus;
import com.aloha.zootopia.domain.UserReport;
import com.aloha.zootopia.service.UserReportService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
public class UserReportController {

    private final UserReportService userReportService;

    /** ✅ 신고 목록 조회 */
    @GetMapping
    public Map<String, Object> list(
        @RequestParam(name = "q", required = false) String q,
        @RequestParam(name = "status", required = false) ReportStatus status,
        @RequestParam(name = "reason", required = false) ReportReason reason,
        @RequestParam(name = "reportedUserId", required = false) Integer reportedUserId,
        @RequestParam(name = "page", defaultValue = "0") int page,
        @RequestParam(name = "size", defaultValue = "10") int size,
        @RequestParam(name = "sort", defaultValue = "created") String sort,
        @RequestParam(name = "dir", defaultValue = "desc") String dir
    ) {
        return userReportService.list(q, status, reason, reportedUserId, page, size, sort, dir);
    }

    /** ✅ 신고 생성 */
    @PostMapping
    public void create(
        @RequestBody UserReport report,
        @AuthenticationPrincipal CustomUser loginUser
    ) {
        if (loginUser == null) throw new RuntimeException("로그인이 필요합니다.");
        userReportService.create(report, loginUser.getUserId().intValue());
    }

    /** ✅ 신고 상태 변경 (관리자 전용) */
    @PutMapping("/{reportId}/status")
    public void updateStatus(
        @PathVariable("reportId") Integer reportId,   // ❗ 이름 지정
        @RequestBody Map<String, Object> body
    ) {
        String statusStr = (String) body.get("status");
        String adminNote = (String) body.get("adminNote");

        if (statusStr == null) throw new IllegalArgumentException("status 값이 필요합니다.");

        ReportStatus status = ReportStatus.valueOf(statusStr);
        userReportService.updateStatus(reportId, status, adminNote);
    }
}
