package com.aloha.zootopia.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aloha.zootopia.domain.ParttimeJob;
import com.aloha.zootopia.mapper.ParttimeJobMapper;

@Service
public class ParttimeJobServiceImpl implements ParttimeJobService {

    @Autowired
    private ParttimeJobMapper jobMapper;

    @Override
    public void registerJob(ParttimeJob job) {
        jobMapper.insertJob(job);
    }

    @Override
    public List<ParttimeJob> listJobs() {
        return jobMapper.listJobs();
    }


    @Override
    public ParttimeJob getJob(Long jobId) {
        return jobMapper.selectJobById(jobId);
    }

    @Override
    public void updateJob(ParttimeJob job) {
        jobMapper.updateJob(job);
    }

    @Override
    public void deleteJob(Long jobId) {
        jobMapper.deleteJob(jobId);
    }
    
    @Override
    public List<ParttimeJob> getPagedJobs(int offset, int limit) {
        return jobMapper.selectPaged(offset, limit);
    }

    @Override
    public int countAllJobs() {
        return jobMapper.countAllJobs();
    }

    @Override
    public List<ParttimeJob> getFilteredJobs(Map<String, Object> filters) {
        return jobMapper.selectFilteredJobs(filters);
    }

    @Override
    public int countFilteredJobs(Map<String, Object> filters) {
        return jobMapper.countFilteredJobs(filters);
    }
}
