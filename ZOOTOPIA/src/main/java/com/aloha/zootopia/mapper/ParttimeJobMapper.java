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
    ParttimeJob selectJobById(Long jobId);
    void updateJob(ParttimeJob job);
    void deleteJob(Long jobId);

    // ✅ 페이징용 메서드 추가
    List<ParttimeJob> selectPaged(@Param("offset") int offset, @Param("limit") int limit);
    int countAllJobs();

    // ✅ 필터링된 구인 목록 조회 메서드 추가
    List<ParttimeJob> getFilteredJobs(Map<String, Object> filters);
    List<ParttimeJob> selectFilteredJobs(Map<String, Object> filters);
    int countFilteredJobs(Map<String, Object> filters);

}
