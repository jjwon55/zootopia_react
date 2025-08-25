package com.aloha.zootopia.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.aloha.zootopia.domain.PostReport;
import com.aloha.zootopia.domain.ReportReason;
import com.aloha.zootopia.domain.ReportStatus;

@Mapper
public interface PostReportMapper {

    int countByFilter(
        @Param("q") String q,
        @Param("status") ReportStatus status,
        @Param("reason") ReportReason reason,
        @Param("postId") Integer postId
    );

    List<PostReport> findByFilter(
        @Param("q") String q,
        @Param("status") ReportStatus status,
        @Param("reason") ReportReason reason,
        @Param("postId") Integer postId,
        @Param("offset") int offset,
        @Param("size") int size,
        @Param("sort") String sort,
        @Param("dir") String dir
    );

    int existsRecentSame(
        @Param("reporterUserId") int reporterUserId,
        @Param("postId") Integer postId,
        @Param("hours") int hours
    );

    void insert(PostReport report);

    void updateStatus(
        @Param("reportId") long reportId,
        @Param("status") ReportStatus status,
        @Param("adminNote") String adminNote
    );
}
