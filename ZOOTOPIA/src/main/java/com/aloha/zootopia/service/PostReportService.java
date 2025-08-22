package com.aloha.zootopia.service;

import com.aloha.zootopia.domain.PostReport;
import com.aloha.zootopia.domain.ReportReason;
import com.aloha.zootopia.domain.ReportStatus;

import java.util.Map;

public interface PostReportService {
    void create(PostReport report, int reporterUserId);
    Map<String, Object> list(String q, ReportStatus status, ReportReason reason,
                             Integer postId, int page, int size, String sort, String dir);
    void updateStatus(long reportId, ReportStatus status, String adminNote);
}
