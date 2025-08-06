package com.aloha.zootopia.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import com.aloha.zootopia.domain.ParttimeJobApplicant;

@Mapper
public interface ParttimeJobApplicantMapper {
    void insertApplicant(ParttimeJobApplicant applicant);
    List<ParttimeJobApplicant> selectApplicantsByJobId(Long jobId);
    void updateApplicant(ParttimeJobApplicant applicant);
    void deleteApplicant(int applicantId);

    ParttimeJobApplicant selectApplicant(int applicantId);
    
    ParttimeJobApplicant getApplicantByJobIdAndUserId(@Param("jobId") Long jobId, @Param("userId") Long userId);

    // ✅ 사용자가 이미 지원했는지 확인
    @Select("SELECT COUNT(*) > 0 FROM parttime_job_applicant WHERE job_id = #{jobId} AND user_id = #{userId}")
    boolean hasApplied(@Param("jobId") Long jobId, @Param("userId") Long userId);

    // ✅ 추가
    int countApplicantsByJobId(Long jobId);
    List<ParttimeJobApplicant> getPagedApplicants(Long jobId, int offset, int limit);
}
