package com.aloha.zootopia.controller;

import java.util.Map;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aloha.zootopia.domain.CustomUser;
import com.aloha.zootopia.domain.PostReport;
import com.aloha.zootopia.domain.ReportReason;
import com.aloha.zootopia.domain.ReportStatus;
import com.aloha.zootopia.service.PostReportService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/reports/posts")
@RequiredArgsConstructor
public class PostReportController {

    private final PostReportService postReportService;

    @GetMapping
    public Map<String, Object> list(
        @RequestParam(name = "q", required = false) String q,
        @RequestParam(name = "status", required = false) ReportStatus status,
        @RequestParam(name = "reason", required = false) ReportReason reason,
        @RequestParam(name = "postId", required = false) Integer postId,
        @RequestParam(name = "page", defaultValue = "0") int page,
        @RequestParam(name = "size", defaultValue = "10") int size,
        @RequestParam(name = "sort", defaultValue = "created") String sort,
        @RequestParam(name = "dir", defaultValue = "desc") String dir
    ) {
        return postReportService.list(q, status, reason, postId, page, size, sort, dir);
    }

    @PostMapping
    public void create(@RequestBody PostReport report,
                       @AuthenticationPrincipal CustomUser loginUser) {
        if (loginUser == null) throw new RuntimeException("로그인이 필요합니다.");
        postReportService.create(report, loginUser.getUserId().intValue());
    }

    @PostMapping("/status")
    public void updateStatus(@RequestParam long reportId,
                             @RequestParam ReportStatus status,
                             @RequestParam(required = false) String adminNote) {
        postReportService.updateStatus(reportId, status, adminNote);
    }
}

