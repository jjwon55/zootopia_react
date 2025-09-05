package com.aloha.zootopia.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.aloha.zootopia.domain.JobPet;
import com.aloha.zootopia.mapper.JobPetMapper;

@Service
public class JobPetService {

    private final JobPetMapper mapper;

    public JobPetService(JobPetMapper mapper) {
        this.mapper = mapper;
    }

    public void addJobPet(Long jobId, Long petId) {
        mapper.insert(new JobPet(jobId, petId));
    }

    public List<JobPet> getPetsByJob(Long jobId) {
        return mapper.findByJobId(jobId);
    }

    public void removeJobPet(Long jobId, Long petId) {
        mapper.delete(jobId, petId);
    }

    public void removeByJobId(Long jobId) {
        mapper.deleteByJobId(jobId);
    }
}
