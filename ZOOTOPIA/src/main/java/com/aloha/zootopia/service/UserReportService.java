package com.aloha.zootopia.service;

import com.aloha.zootopia.domain.ReportReason;
import com.aloha.zootopia.domain.ReportStatus;
import com.aloha.zootopia.domain.UserReport;

import java.util.Map;

public interface UserReportService {
    void create(UserReport report, int reporterUserId);

    int countPendingByUser(int reportedUserId);

    Map<String, Object> list(String q, ReportStatus status, ReportReason reason,
                         Integer reportedUserId, int page, int size, String sort, String dir);
    void updateStatus(long reportId, ReportStatus status, String adminNote);
}