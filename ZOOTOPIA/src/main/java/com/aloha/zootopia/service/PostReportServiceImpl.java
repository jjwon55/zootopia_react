package com.aloha.zootopia.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aloha.zootopia.domain.PageInfo;
import com.aloha.zootopia.domain.Pagination;
import com.aloha.zootopia.domain.PostReport;
import com.aloha.zootopia.domain.ReportReason;
import com.aloha.zootopia.domain.ReportStatus;
import com.aloha.zootopia.mapper.PostReportMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostReportServiceImpl implements PostReportService {

    private final PostReportMapper mapper;

    @Override
    @Transactional
    public void create(PostReport report, int reporterUserId) {
        if (report.getPostId() == null)
            throw new IllegalArgumentException("신고 대상 게시글이 없습니다.");

        int dup = mapper.existsRecentSame(reporterUserId, report.getPostId(), 24);
        if (dup > 0)
            throw new IllegalStateException("이미 신고하셨습니다. 검토 중입니다.");

        report.setReporterUserId(reporterUserId);
        mapper.insert(report);
    }

    @Override
    public Map<String, Object> list(String q, ReportStatus status, ReportReason reason,
            Integer postId, int page, int size, String sort, String dir) {

        int total = mapper.countByFilter(q, status, reason, postId);

        Pagination p = new Pagination(page + 1L, size, 10, total);
        int offset = p.getOffset();

        List<PostReport> data = mapper.findByFilter(
            q, status, reason, postId, offset, (int) p.getSize(), sort, dir
        );

        PageInfo pi = new PageInfo();
        pi.setPageNum((int) p.getPage());
        pi.setPageSize((int) p.getSize());
        pi.setTotal((int) p.getTotal());
        pi.setPages((int) p.getLast());
        pi.setStartPage((int) p.getStart());
        pi.setEndPage((int) p.getEnd());
        pi.setHasPreviousPage(p.getPage() > 1);
        pi.setHasNextPage(p.getPage() < p.getLast());
        pi.setHasFirstPage(p.getPage() > 1);
        pi.setHasLastPage(p.getPage() < p.getLast());

        Map<String, Object> pageInfo = Map.of(
            "number",        pi.getPageNum() - 1,
            "size",          pi.getPageSize(),
            "totalElements", pi.getTotal(),
            "totalPages",    pi.getPages()
        );

        return Map.of("data", data, "page", pageInfo);
    }

    @Override
    @Transactional
    public void updateStatus(long reportId, ReportStatus status, String adminNote) {
        mapper.updateStatus(reportId, status, adminNote);
    }
}

