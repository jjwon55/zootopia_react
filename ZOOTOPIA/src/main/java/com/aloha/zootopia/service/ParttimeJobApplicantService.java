package com.aloha.zootopia.service;

import java.util.List;

import com.aloha.zootopia.domain.ParttimeJobApplicant;

public interface ParttimeJobApplicantService {
    void registerApplicant(ParttimeJobApplicant applicant);
    List<ParttimeJobApplicant> listApplicants(Long jobId);
    void updateApplicant(ParttimeJobApplicant applicant);
    void deleteApplicant(int applicantId);
    boolean hasApplied(Long jobId, Long userId);
    ParttimeJobApplicant getApplicantByJobIdAndUserId(Long jobId, Long userId);
    ParttimeJobApplicant getApplicant(int applicantId);

    // 지원자 전체 수
    int countApplicantsByJobId(Long jobId);
    // 페이징된 지원자 목록
    List<ParttimeJobApplicant> getPagedApplicants(Long jobId, int offset, int limit);
}
