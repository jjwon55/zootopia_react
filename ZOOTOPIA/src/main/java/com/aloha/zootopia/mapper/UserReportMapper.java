package com.aloha.zootopia.mapper;


import java.util.List;
import org.apache.ibatis.annotations.*;
import com.aloha.zootopia.domain.*;

@Mapper
public interface UserReportMapper {

  int countByFilter(
      @Param("q") String q,
      @Param("status") ReportStatus status,
      @Param("reason") ReportReason reason,
      @Param("reportedUserId") Integer reportedUserId
  );

  List<UserReport> findByFilter(
      @Param("q") String q,
      @Param("status") ReportStatus status,
      @Param("reason") ReportReason reason,
      @Param("reportedUserId") Integer reportedUserId,
      @Param("offset") int offset,
      @Param("size") int size,
      @Param("sort") String sort,
      @Param("dir") String dir
  );

  int existsRecentSame(
      @Param("reporterUserId") int reporterUserId,
      @Param("reportedUserId") Integer reportedUserId,
      @Param("postId") Integer postId,
      @Param("commentId") Integer commentId,
      @Param("lostPostId") Integer lostPostId,
      @Param("lostCommentId") Integer lostCommentId,
      @Param("hours") int hours
  );

  int countPendingByUser(@Param("reportedUserId") int reportedUserId);

  void insert(UserReport report);

  void updateStatus(
      @Param("reportId") long reportId,
      @Param("status") ReportStatus status,
      @Param("adminNote") String adminNote
  );
}

