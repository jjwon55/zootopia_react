package com.aloha.zootopia.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aloha.zootopia.domain.ParttimeJobApplicant;
import com.aloha.zootopia.mapper.ParttimeJobApplicantMapper;

@Service
public class ParttimeJobApplicantServiceImpl implements ParttimeJobApplicantService {
    
    @Autowired
    private ParttimeJobApplicantMapper applicantMapper;

    @Override
    public void registerApplicant(ParttimeJobApplicant applicant) {
        applicantMapper.insertApplicant(applicant);
    }

    @Override
    public List<ParttimeJobApplicant> listApplicants(Long jobId) {
        return applicantMapper.selectApplicantsByJobId(jobId);
    }


    @Override
    public void updateApplicant(ParttimeJobApplicant applicant) {
        applicantMapper.updateApplicant(applicant);
    }

    @Override
    public void deleteApplicant(int applicantId) {
        applicantMapper.deleteApplicant(applicantId);
    }

    @Override
    public ParttimeJobApplicant getApplicant(int applicantId) {
        return applicantMapper.selectApplicant(applicantId);
    }

    @Override
    public boolean hasApplied(Long jobId, Long userId) {
    return applicantMapper.hasApplied(jobId, userId);
    }

    @Override
    public ParttimeJobApplicant getApplicantByJobIdAndUserId(Long jobId, Long userId) {
    return applicantMapper.getApplicantByJobIdAndUserId(jobId, userId);
    }

        // ✅ 전체 지원자 수
    @Override
    public int countApplicantsByJobId(Long jobId) {
        return applicantMapper.countApplicantsByJobId(jobId);
    }

    // ✅ 페이징 지원자 목록
    @Override
    public List<ParttimeJobApplicant> getPagedApplicants(Long jobId, int offset, int limit) {
        return applicantMapper.getPagedApplicants(jobId, offset, limit);
    }
}
