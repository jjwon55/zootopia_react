package com.aloha.zootopia.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.aloha.zootopia.domain.ParttimeJob;

@Mapper
public interface ParttimeJobMapper {
    void insertJob(ParttimeJob job);

    List<ParttimeJob> listJobs();

    ParttimeJob selectJobById(@Param("jobId") Long jobId);

    void updateJob(ParttimeJob job);

    void deleteJob(@Param("jobId") Long jobId);
    
    
    // 페이징 목록
    List<ParttimeJob> selectPaged(@Param("offset") int offset,
    @Param("limit") int limit);
    
    int countAllJobs();
    
    // 🔧 필터 조회: 하나로 통일 (Service에선 getFilteredJobs → 내부적으로 이 메서드 호출)
    List<ParttimeJob> selectFilteredJobs(Map<String, Object> filters);
    
    int countFilteredJobs(Map<String, Object> filters);    

}