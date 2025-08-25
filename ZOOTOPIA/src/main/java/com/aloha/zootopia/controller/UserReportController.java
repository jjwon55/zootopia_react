package com.aloha.zootopia.controller;

import java.util.Map;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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

    @PostMapping
    public void create(@RequestBody UserReport report,
                    @AuthenticationPrincipal CustomUser loginUser) {
        if (loginUser == null) throw new RuntimeException("로그인이 필요합니다.");
        userReportService.create(report, loginUser.getUserId().intValue());
    }
    @PutMapping("/{reportId}/status")
    public void updateStatus(
            @PathVariable Integer reportId,
            @RequestBody Map<String, Object> body
    ) {
        String statusStr = (String) body.get("status");
        String adminNote = (String) body.get("adminNote");

        userReportService.updateStatus(reportId, ReportStatus.valueOf(statusStr), adminNote);
    }

}
