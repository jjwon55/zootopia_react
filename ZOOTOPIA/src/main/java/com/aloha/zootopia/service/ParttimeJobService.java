package com.aloha.zootopia.service;

import java.util.List;
import java.util.Map;

import com.aloha.zootopia.domain.ParttimeJob;


public interface ParttimeJobService {
    void registerJob(ParttimeJob job);
    List<ParttimeJob> listJobs();
    ParttimeJob getJob(Long jobId);
    void updateJob(ParttimeJob job);
    void deleteJob(Long jobId);

    List<ParttimeJob> getPagedJobs(int offset, int limit);
    int countAllJobs();

    List<ParttimeJob> getFilteredJobs(Map<String, Object> filters);
    int countFilteredJobs(Map<String, Object> filters);
}
