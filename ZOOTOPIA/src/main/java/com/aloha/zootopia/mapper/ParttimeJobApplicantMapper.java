package com.aloha.zootopia.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import com.aloha.zootopia.domain.ParttimeJobApplicant;

@Mapper
public interface ParttimeJobApplicantMapper {
    void insertApplicant(ParttimeJobApplicant applicant);

    List<ParttimeJobApplicant> selectApplicantsByJobId(@Param("jobId") Long jobId);

    void updateApplicant(ParttimeJobApplicant applicant);

    void deleteApplicant(@Param("applicantId") int applicantId);

    ParttimeJobApplicant selectApplicant(@Param("applicantId") int applicantId);

    ParttimeJobApplicant getApplicantByJobIdAndUserId(@Param("jobId") Long jobId,
                                                      @Param("userId") Long userId);

    @Select("SELECT COUNT(*) > 0 FROM parttime_job_applicant WHERE job_id = #{jobId} AND user_id = #{userId}")
    boolean hasApplied(@Param("jobId") Long jobId, @Param("userId") Long userId);

    int countApplicantsByJobId(@Param("jobId") Long jobId);

    List<ParttimeJobApplicant> getPagedApplicants(@Param("jobId") Long jobId,
                                                  @Param("offset") int offset,
                                                  @Param("limit") int limit);
}